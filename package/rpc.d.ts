import type { Block, BlockStats, ResponseRPC } from "../types"
import { TransactionRaw } from "../types/transacton"
export declare class RPCService {
  url: string
  constructor(url: string)
  getBlockCount: () => Promise<number>
  getBlock: (hash: string) => Promise<ResponseRPC<Block>>
  getBlockStats: (height: number) => Promise<ResponseRPC<BlockStats>>
  getRawTransaction: ({
    transactionHash,
    blockHash,
  }: {
    transactionHash: string
    blockHash: string
  }) => Promise<ResponseRPC<TransactionRaw>>
}
export default RPCService
