import { RPCService } from "../services/rpc"
import { SymbolService } from "../services/symbol"
import { TransactionService } from "../services/transaction"
import Symbol from "../database/models/symbol.model"
import { TransactionCreationAttributes } from "../database/models/transaction.model"
import { AddressService } from "@/services/address"
import Address from "@/database/models/address.model"

export default class CronJob {
  rpcService
  transactionService
  symbolService
  addressService
  symbol: Symbol
  defaultAddressRecord = {
    value: 0,
    avg_price: 0,
    symbol_id: 1,
  }
  constructor(
    rpcService: RPCService,
    transactionService: TransactionService,
    symbolService: SymbolService,
    addressService: AddressService,
    symbol: string,
  ) {
    this.rpcService = rpcService
    this.transactionService = transactionService
    this.symbolService = symbolService
    this.addressService = addressService

    this.symbolService.findSymbol({ name: symbol }).then((symbol) => {
      if (symbol) {
        this.symbol = symbol
      }
    })
  }

  checkTransactionsExisted = async (
    tx: TransactionCreationAttributes["tx"],
  ) => {
    const res = await this.transactionService.findTransactionByTx(tx)
    if (res) return true
    return false
  }

  addressModelSync = async (
    addressFrom: Address["address"],
    addressTo: Address["address"],
    value: Address["value"],
  ) => {
    try {
      const currentPriceOnPlatform = 45000
      // avg price for addressTo
      // reduce value for addressFrom
      const addressFromOld =
        await this.addressService.findAddressByAddress(addressFrom)
      let addressFromNew
      if (addressFromOld) {
        addressFromNew = addressFromOld.dataValues
      } else {
        const newAddressRecord = {
          ...this.defaultAddressRecord,
          address: addressFrom,
        }

        const newAddress =
          await this.addressService.createAddress(newAddressRecord)

        if (newAddress) {
          addressFromNew = newAddress.dataValues
        }
      }
      if (addressFromNew) {
        addressFromNew.value = addressFromNew.value - value
        this.addressService.updateAddress(addressFromNew)
      }

      const addressToOld =
        await this.addressService.findAddressByAddress(addressTo)

      let addressToNew
      if (addressToOld) {
        addressToNew = addressToOld.dataValues
      } else {
        const newAddressRecord = {
          ...this.defaultAddressRecord,
          address: addressTo,
        }
        const newAddress =
          await this.addressService.createAddress(newAddressRecord)
        if (newAddress) {
          addressToNew = newAddress.dataValues
        }
      }
      if (addressToNew) {
        addressToNew.avg_price =
          (addressToNew.value * addressToNew.avg_price +
            value * currentPriceOnPlatform) /
          2
        addressToNew.value = addressToNew.value + value
        this.addressService.updateAddress(addressToNew)
      }
      return true
    } catch (error) {}
  }

  start = async (height: number) => {
    try {
      const res = await this.rpcService.getBlockStats(height)
      const hash = res.result.blockhash
      let blockhash = hash
      while (blockhash) {
        const block = await this.rpcService.getBlock(blockhash)
        const tx = block.result.tx

        if (tx.length) {
          for (let i = 0; i < tx.length; i++) {
            const t = tx[i]
            const existed = await this.checkTransactionsExisted(t)
            if (!existed) {
              const transaction = await this.rpcService.getRawTransaction({
                transactionHash: t,
                blockHash: blockhash,
              })
              const vout = transaction.result.vout
              // this transaction is for miner, who is an owner block, dont have from address
              if (i === 0) {
                for (let i = 0; i < vout.length; i++) {
                  const out = vout[i]
                  if (out.scriptPubKey.address) {
                    const data: TransactionCreationAttributes = {
                      from: "0",
                      blockhash: blockhash,
                      tx: t,
                      to: out.scriptPubKey.address,
                      value: out.value,
                      time: transaction.result.time,
                      symbol_id: this.symbol.id,
                    }
                    await this.transactionService.createTransaction(data)
                    await this.addressModelSync(data.from, data.to, data.value)
                  }
                }
              } else {
                for (let i = 0; i < vout.length; i++) {
                  const out = vout[i]
                  const data: TransactionCreationAttributes = {
                    blockhash: blockhash,
                    tx: t,
                    from: transaction.result.vin[0].prevout.scriptPubKey
                      .address,
                    to: out.scriptPubKey.address,
                    value: out.value,
                    time: transaction.result.time,
                    symbol_id: this.symbol.id,
                  }
                  await this.transactionService.createTransaction(data)
                  await this.addressModelSync(data.from, data.to, data.value)
                }
              }
            }
          }
        }
        // auto migrate next block
        blockhash = ""
      }
    } catch (error) {
      console.log(error)
    }
  }
}
