export interface TransactionRaw {
  in_active_chain: true | false // (boolean, optional) Whether specified block is in the active chain or not (only present with explicit "blockhash" argument)
  blockhash: string // (string, optional) the block hash
  confirmations: number // (numeric, optional) The confirmations
  blocktime: string // (numeric, optional) The block time expressed in UNIX epoch time
  time: number // (numeric, optional) Same as "blocktime"
  hex: string // (string) The serialized, hex-encoded data for 'txid'
  txid: string // (string) The transaction id (same as provided)
  hash: string // (string) The transaction hash (differs from txid for witness transactions)
  size: number // (numeric) The serialized transaction size
  vsize: number // (numeric) The virtual transaction size (differs from size for witness transactions)
  weight: number // (numeric) The transaction's weight (between vsize*4-3 and vsize*4)
  version: number // (numeric) The version
  locktime: string // (numeric) The lock time
  vout: {
    //(json object)
    value: number //(numeric) The value in BTC
    n: number //(numeric) index
    scriptPubKey: {
      //(json object)
      asm: string //(string) Disassembly of the public key script
      desc: string //(string) Inferred descriptor for the output
      hex: string //(string) The raw public key script bytes, hex-encoded
      address: string //(string, optional) The Bitcoin address (only if a well-defined address exists)
      type: string //(string) The type (one of: nonstandard, pubkey, pubkeyhash, scripthash, multisig, nulldata, witness_v0_scripthash, witness_v0_keyhash, witness_v1_taproot, witness_unknown)
    }
  }[]
  fee: number //(numeric, optional) transaction fee in BTC, omitted if block undo data is not available
  vin: {
    //(json object) utxo being spent
    // (json object)
    coinbase: string // (string, optional) The coinbase value (only if coinbase transaction)
    txid: string // (string, optional) The transaction id (if not coinbase transaction)
    vout: number // (numeric, optional) The output number (if not coinbase transaction)
    scriptSig: {
      // (json object, optional) The script (if not coinbase transaction)
      asm: string // (string) Disassembly of the signature script
      hex: string // (string) The raw signature script bytes, hex-encoded
    }
    txinwitness: [
      //(json array, optional)
      string, //(string) hex-encoded witness data (if any)
    ]
    sequence: number //(numeric) The script sequence number
    prevout: {
      //(json object, optional) The previous output, omitted if block undo data is not available
      generated: true | false //(boolean) Coinbase or not
      height: number //(numeric) The height of the prevout
      value: number //(numeric) The value in BTC
      scriptPubKey: {
        //(json object)
        asm: string //(string) Disassembly of the public key script
        desc: string //(string) Inferred descriptor for the output
        hex: string //(string) The raw public key script bytes, hex-encoded
        address: string //(string, optional) The Bitcoin address (only if a well-defined address exists)
        type: string //(string) The type (one of: nonstandard, pubkey, pubkeyhash, scripthash, multisig, nulldata, witness_v0_scripthash, witness_v0_keyhash, witness_v1_taproot, witness_unknown)
      }
    }
  }[] //(json array)
}
