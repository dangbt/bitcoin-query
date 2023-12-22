# Bitcoin Query
A javascript Bitcoin library for `node.js`. Written in `TypeScript`.


# Use can trust the source
This source doesn't have any address wallet or connect string. you can trust the source code `100%`

## Installing
  Before installing, you need to make sure that [Bitcoin core](https://bitcoin.org/en/download) was installed and runned

  ```
    pnpm i bitcoin-query
   
  ```

  ## Example 

  ``` 
    import RPCServices from "bitcoin-query"
    
    const rpcServices = new RPCServices(url) // url is a bitcoin core connecting string

    rpcServices.getBlockCount() // get height number of latest block
  ```