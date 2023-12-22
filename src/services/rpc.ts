import instance from "../axios/axios"
import type { Block, BlockStats, ResponseRPC } from "../types"
import { TransactionRaw } from "../types/transacton"

export class RPCService {
  url: string
  constructor(url: string) {
    if (!url) {
      throw Error(
        "URL required, it is look like http://${USER}:${PASS}@127.0.0.1:8332/",
      )
    }

    this.url = url
    instance.defaults.baseURL = url
    instance.defaults.headers.common["Content-Type"] = "text/plain"
  }

  getBlockCount = async (): Promise<number> => {
    try {
      const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblockcount","params":[]}`
      const res = await instance.post<number>("/", dataString)
      return res.data
    } catch (error) {
      throw Error(error as string)
    }
  }

  getBlock = async (hash: string): Promise<ResponseRPC<Block>> => {
    try {
      const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblock","params":["${hash}"]}`
      const res = await instance.post<ResponseRPC<Block>>("/", dataString)
      return res.data
    } catch (error) {
      throw Error(error as string)
    }
  }
  getBlockStats = async (height: number): Promise<ResponseRPC<BlockStats>> => {
    try {
      const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblockstats","params":[${height}]}`
      const res = await instance.post<ResponseRPC<BlockStats>>("/", dataString)
      return res.data
    } catch (error) {
      throw Error(error as string)
    }
  }

  getRawTransaction = async ({
    transactionHash,
    blockHash,
  }: {
    transactionHash: string
    blockHash: string
  }): Promise<ResponseRPC<TransactionRaw>> => {
    try {
      const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getrawtransaction","params":["${transactionHash}", 2, "${blockHash}"]}`
      const res = await instance.post<ResponseRPC<TransactionRaw>>(
        "/",
        dataString,
      )
      return res.data
    } catch (error) {
      throw Error(error as string)
    }
  }

  // getBestBlockHash = () => {}
  // getConnectionCount = () => {}
  // getDifficulty = () => {}
  // getBlockChainInfo = () => {}
  // getMiningInfo = () => {}
  // getPeerInfo = () => {}
  // getRawMemPool = () => {}
}

export default RPCService
