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

  reduceValueToAddress = async (
    address: Address["address"],
    value: Address["value"],
  ) => {
    try {
      const addressOld = await this.addressService.findByAddress(address)
      let addressNew

      if (addressOld) {
        addressNew = addressOld.dataValues
      } else {
        const newAddressRecord = {
          ...this.defaultAddressRecord,
          address: address,
        }

        const newAddress = await this.addressService.create(newAddressRecord)

        if (newAddress) {
          addressNew = newAddress.dataValues
        }
      }

      if (addressNew) {
        addressNew.value = addressNew.value - Math.abs(value)
        this.addressService.update(addressNew)
      }
    } catch (error) {}
  }
  addValueToAddress = async (
    address: Address["address"],
    value: Address["value"],
    time: Transaction["time"],
  ) => {
    try {
      const [addressOld, price] = await Promise.all([
        this.addressService.findByAddress(address),
        this.getPriceByTime(time),
      ])

      let currentPriceOnPlatform = 0
      if (price) {
        currentPriceOnPlatform =
          (price.dataValues.high + price.dataValues.low) / 2
      }
      let addressNew

      if (addressOld) {
        addressNew = addressOld.dataValues
      } else {
        const newAddressRecord = {
          ...this.defaultAddressRecord,
          address: address,
        }

        const newAddress = await this.addressService.create(newAddressRecord)

        if (newAddress) {
          addressNew = newAddress.dataValues
        }
      }

      if (addressNew) {
        addressNew.avg_price =
          (Math.abs(addressNew.value) * addressNew.avg_price +
            Math.abs(value) * currentPriceOnPlatform) /
          (Math.abs(addressNew.value) + Math.abs(value))
        addressNew.value = addressNew.value + value

        this.addressService.update(addressNew)
      }
    } catch (error) {}
  }

  addressModelSync = async (
    addressFrom: Address["address"][],
    addressTo: Address["address"][],
    valueOfAdress: { [key: Address["address"]]: Address["value"] },
    time: Transaction["time"],
  ) => {
    try {
      addressFrom.forEach((address) => {
        const value = valueOfAdress[address]
        this.reduceValueToAddress(address, value)
      })
      addressTo.forEach((address) => {
        const value = valueOfAdress[address]
        this.addValueToAddress(address, value, time)
      })
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
              const vin = transaction.result.vin
              // this transaction is for miner, who is an owner block, dont have from address
              if (i === 0) {
                let toAdresss = []
                let value = 0
                let valueOfAdress: {
                  [key: Address["address"]]: Address["value"]
                } = {}

                for (let i = 0; i < vin.length; i++) {
                  const vinItem = vin[i]
                }

                for (let i = 0; i < vout.length; i++) {
                  const out = vout[i]
                  toAdresss.push(out.scriptPubKey.address)
                  value += out.value
                  valueOfAdress[out.scriptPubKey.address] = out.value
                }
                valueOfAdress["0"] = value

                const data: TransactionCreationAttributes = {
                  from: "0",
                  blockhash: blockhash,
                  tx: t,
                  to: JSON.stringify(toAdresss),
                  fee: transaction.result.fee,
                  value: value, // total value of the transaction without fee
                  time: transaction.result.time,
                  symbol_id: this.symbol.id,
                }
                await this.transactionService.create(data)
                await this.addressModelSync(
                  [data.from],
                  JSON.parse(data.to),
                  valueOfAdress,
                  transaction.result.time,
                )
              } else {
                let fromAdresss = []
                let toAdresss = []
                let value = 0
                let valueOfAdress: {
                  [key: Address["address"]]: Address["value"]
                } = {}
                for (let i = 0; i < vin.length; i++) {
                  const vinItem = vin[i]
                  fromAdresss.push(vinItem.prevout.scriptPubKey.address)
                  valueOfAdress[vinItem.prevout.scriptPubKey.address] =
                    vinItem.prevout.value
                }
                for (let i = 0; i < vout.length; i++) {
                  const out = vout[i]
                  toAdresss.push(out.scriptPubKey.address)
                  value += out.value
                  valueOfAdress[out.scriptPubKey.address] = out.value
                }
                const data: TransactionCreationAttributes = {
                  blockhash: blockhash,
                  tx: t,
                  from: JSON.stringify(fromAdresss),
                  to: JSON.stringify(toAdresss),
                  fee: transaction.result.fee,
                  value: value,
                  time: transaction.result.time,
                  symbol_id: this.symbol.id,
                }
                await this.transactionService.create(data)
                await this.addressModelSync(
                  JSON.parse(data.from),
                  JSON.parse(data.to),
                  valueOfAdress,
                  transaction.result.time,
                )
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
