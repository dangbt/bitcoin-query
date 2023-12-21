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

export interface BlockStats {
  avgfee: number // (numeric, optional) Average fee in the block
  avgfeerate: number // (numeric, optional) Average feerate (in satoshis per virtual byte)
  avgtxsize: number // (numeric, optional) Average transaction size
  blockhash: string // (string, optional) The block hash (to check for potential reorgs)
  feerate_percentiles: [
    // (json array, optional) Feerates at the 10th, 25th, 50th, 75th, and 90th percentile weight unit (in satoshis per virtual byte)
    number, // (numeric) The 10th percentile feerate
    number, // (numeric) The 25th percentile feerate
    number, // (numeric) The 50th percentile feerate
    number, // (numeric) The 75th percentile feerate
    number, // (numeric) The 90th percentile feerate
  ] //
  height: number // (numeric, optional) The height of the block
  ins: number // (numeric, optional) The number of inputs (excluding coinbase)
  maxfee: number // (numeric, optional) Maximum fee in the block
  maxfeerate: number // (numeric, optional) Maximum feerate (in satoshis per virtual byte)
  maxtxsize: number // (numeric, optional) Maximum transaction size
  medianfee: number // (numeric, optional) Truncated median fee in the block
  mediantime: number // (numeric, optional) The block median time past
  mediantxsize: number // (numeric, optional) Truncated median transaction size
  minfee: number // (numeric, optional) Minimum fee in the block
  minfeerate: number // (numeric, optional) Minimum feerate (in satoshis per virtual byte)
  mintxsize: number // (numeric, optional) Minimum transaction size
  outs: number // (numeric, optional) The number of outputs
  subsidy: number // (numeric, optional) The block subsidy
  swtotal_size: number // (numeric, optional) Total size of all segwit transactions
  swtotal_weight: number // (numeric, optional) Total weight of all segwit transactions
  swtxs: number // (numeric, optional) The number of segwit transactions
  time: number // (numeric, optional) The block time
  total_out: number // (numeric, optional) Total amount in all outputs (excluding coinbase and thus reward [ie subsidy + totalfee])
  total_size: number // (numeric, optional) Total size of all non-coinbase transactions
  total_weight: number // (numeric, optional) Total weight of all non-coinbase transactions
  totalfee: number // (numeric, optional) The fee total
  txs: number // (numeric, optional) The number of transactions (including coinbase)
  utxo_increase: number // (numeric, optional) The increase/decrease in the number of unspent outputs (not discounting op_return and similar)
  utxo_size_inc: number // (numeric, optional) The increase/decrease in size for the utxo index (not discounting op_return and similar)
  utxo_increase_actual: number // (numeric, optional) The increase/decrease in the number of unspent outputs, not counting unspendables
  utxo_size_inc_actual: number // (numeric, optional) The increase/decrease in size for the utxo index, not counting unspendables
} //
