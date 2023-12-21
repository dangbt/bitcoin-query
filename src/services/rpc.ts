import instance from "../axios/axios"
import type { Block, BlockStats } from "../types"
import dotenv from "dotenv"
import { TransactionRaw } from "../types/transacton"

dotenv.config()

const USER = process.env.RPC_USER
const PASS = process.env.RPC_PASSWORD

export class RPCService {
  url
  constructor(url: string) {
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

  getBlock = async (hash: string): Promise<Block> => {
    try {
      const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblock","params":["${hash}"]}`
      const res = await instance.post<Block>("/", dataString)
      return res.data
    } catch (error) {
      throw Error(error as string)
    }
  }
  getBlockStats = async (hash: string): Promise<BlockStats> => {
    try {
      const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblockstats","params":["${hash}"]}`
      const res = await instance.post<BlockStats>("/", dataString)
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
  }): Promise<TransactionRaw> => {
    try {
      const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getrawtransaction","params":[${transactionHash}, 2, ${blockHash}]}`
      const res = await instance.post<TransactionRaw>("/", dataString)
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

const rpcService = new RPCService(`http://${USER}:${PASS}@127.0.0.1:8332/`)
export default rpcService
