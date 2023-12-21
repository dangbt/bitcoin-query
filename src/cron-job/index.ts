import { RPCService } from "../services/rpc"
import { SymbolService } from "../services/symbol"
import { TransactionService } from "../services/transaction"
import Symbol from "../database/models/symbol.model"
import { TransactionCreationAttributes } from "../database/models/transaction.model"

export default class CronJob {
  rpcService
  transactionService
  symbolService
  symbol: Symbol
  constructor(
    rpcService: RPCService,
    transactionService: TransactionService,
    symbolService: SymbolService,
    symbol: string,
  ) {
    this.rpcService = rpcService
    this.transactionService = transactionService
    this.symbolService = symbolService

    this.symbolService.findSymbol({ name: symbol }).then((symbol) => {
      if (symbol) {
        this.symbol = symbol
      }
    })
  }
  start = async (height: number) => {
    try {
      const res = await this.rpcService.getBlockStats(`${height}`)
      const hash = res.blockhash
      const block = await this.rpcService.getBlock(hash)
      const tx = block.tx
      if (tx.length) {
        tx.map(async (t, i) => {
          const transaction = await this.rpcService.getRawTransaction({
            transactionHash: t,
            blockHash: hash,
          })
          const vout = transaction.vout
          // this transaction is for miner, who is an owner block, dont have from address
          if (i === 0) {
            vout.forEach(async (out) => {
              if (out.scriptPubKey.address) {
                const data: TransactionCreationAttributes = {
                  from: "0",
                  to: out.scriptPubKey.address,
                  value: out.value,
                  time: transaction.time,
                  symbol_id: this.symbol.id,
                }
                const trans =
                  await this.transactionService.createTransaction(data)
              }
            })
          } else {
            vout.map(async (out) => {
              const data: TransactionCreationAttributes = {
                from: transaction.vin[0].prevout.scriptPubKey.address,
                to: out.scriptPubKey.address,
                value: out.value,
                time: transaction.time,
                symbol_id: this.symbol.id,
              }
              const trans =
                await this.transactionService.createTransaction(data)
            })
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
