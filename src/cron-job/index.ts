import { RPCService } from "../services/rpc"
import { SymbolService } from "../services/symbol"
import { TransactionService } from "../services/transaction"
import Symbol from "../database/models/symbol.model"
import Transaction, {
  TransactionCreationAttributes,
} from "../database/models/transaction.model"
import { AddressService } from "@/services/address"
import Address from "@/database/models/address.model"
import { HistoryPriceService } from "@/services/history-price"

export default class CronJob {
  rpcService
  transactionService
  symbolService
  addressService
  historyPriceService
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
    historyPriceService: HistoryPriceService,
    symbol: string,
  ) {
    this.rpcService = rpcService
    this.transactionService = transactionService
    this.symbolService = symbolService
    this.addressService = addressService
    this.historyPriceService = historyPriceService

    this.symbolService.findByName({ name: symbol }).then((symbol) => {
      if (symbol) {
        this.symbol = symbol
      }
    })
  }

  checkTransactionsExisted = async (
    tx: TransactionCreationAttributes["tx"],
  ) => {
    const res = await this.transactionService.findByTx(tx)
    if (res) return true
    return false
  }

  getPriceByTime = async (time: Transaction["time"]) => {
    try {
      return await this.historyPriceService.findByTime(time)
    } catch (error) {}
  }

  addressModelSync = async (
    addressFrom: Address["address"],
    addressTo: Address["address"],
    value: Address["value"],
    time: Transaction["time"],
  ) => {
    try {
      // avg price for addressTo
      // reduce value for addressFrom
      let addressFromNew
      let addressToNew

      const [addressFromOld, addressToOld, price] = await Promise.all([
        this.addressService.findByAddress(addressFrom),
        this.addressService.findByAddress(addressTo),
        this.getPriceByTime(time),
      ])
      let currentPriceOnPlatform = 0
      if (price) {
        currentPriceOnPlatform =
          (price.dataValues.high + price.dataValues.low) / 2
      }

      if (addressFromOld) {
        addressFromNew = addressFromOld.dataValues
      } else {
        const newAddressRecord = {
          ...this.defaultAddressRecord,
          address: addressFrom,
        }

        const newAddress = await this.addressService.create(newAddressRecord)

        if (newAddress) {
          addressFromNew = newAddress.dataValues
        }
      }

      if (addressFromNew) {
        addressFromNew.value = addressFromNew.value - Math.abs(value)
        this.addressService.update(addressFromNew)
      }

      if (addressToOld) {
        addressToNew = addressToOld.dataValues
      } else {
        const newAddressRecord = {
          ...this.defaultAddressRecord,
          address: addressTo,
        }
        const newAddress = await this.addressService.create(newAddressRecord)
        if (newAddress) {
          addressToNew = newAddress.dataValues
        }
      }
      if (addressToNew) {
        addressToNew.avg_price =
          (Math.abs(addressToNew.value) * addressToNew.avg_price +
            Math.abs(value) * currentPriceOnPlatform) /
          (Math.abs(addressToNew.value) + Math.abs(value))

        addressToNew.value = addressToNew.value + value

        this.addressService.update(addressToNew)
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
              if (
                t ===
                "c4144dfef4f12559fce5aa7e37da365d1b5da0672a176f8ee7c3413e51433fc1"
              ) {
                console.log(transaction.result.vout)
              }
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
                    await this.transactionService.create(data)
                    await this.addressModelSync(
                      data.from,
                      data.to,
                      data.value,
                      transaction.result.time,
                    )
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
                  await this.transactionService.create(data)
                  await this.addressModelSync(
                    data.from,
                    data.to,
                    data.value,
                    transaction.result.time,
                  )
                }
              }
            }
          }
        }
        // auto migrate next block
        blockhash = block.result.previousblockhash
      }
    } catch (error) {
      console.log(error)
    }
  }
}
