export interface Block {
  hash: string // (string) the block hash (same as provided)
  confirmations: number // (numeric) The number of confirmations, or -1 if the block is not on the main chain
  size: number // (numeric) The block size
  strippedsize: number // (numeric) The block size excluding witness data
  weight: number // (numeric) The block weight as defined in BIP 141
  height: number // (numeric) The block height or index
  version: number // (numeric) The block version
  versionHex: string // (string) The block version formatted in hexadecimal
  merkleroot: string // (string) The merkle root
  // (json array) The transaction ids
  // (string) The transaction id
  tx: string[]
  time: string // (numeric) The block time expressed in UNIX epoch time
  mediantime: string // (numeric) The median block time expressed in UNIX epoch time
  nonce: number // (numeric) The nonce
  bits: string // (string) The bits
  difficulty: number // (numeric) The difficulty
  chainwork: string // (string) Expected number of hashes required to produce the chain up to this block (in hex)
  nTx: number // (numeric) The number of transactions in the block
  previousblockhash: string // (string, optional) The hash of the previous block (if available)
  nextblockhash: string // (string, optional) The hash of the next block (if available)
}
