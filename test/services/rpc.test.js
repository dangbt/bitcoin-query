const { describe, it } = require("mocha")
const { expect } = require("chai")
const dotenv = require("dotenv")
const RPCService = require("../../build/services/rpc")
dotenv.config()

const USER = process.env.RPC_USER
const PASS = process.env.RPC_PASSWORD

const url = `http://${USER}:${PASS}@127.0.0.1:8332/`

describe("RPCService", () => {
  describe("getBlockCount", () => {
    it("should return a number", async () => {
      const service = new RPCService(url)
      const count = await service.getBlockCount()
      expect(count).to.be.a("number")
    })
  })

  describe("getBlock", () => {
    it("should return a block", async () => {
      const service = new RPCService(url)
      const block = await service.getBlock(
        "0000000000000000000000000000000000000000000000000000000000000",
      )
      expect(block).to.have.property("hash")
    })
  })

  describe("getBlockStats", () => {
    it("should return a block stats", async () => {
      const service = new RPCService(url)
      const stats = await service.getBlockStats(1)
      expect(stats).to.have.property("tx")
    })
  })

  describe("getRawTransaction", () => {
    it("should return a raw transaction", async () => {
      const service = new RPCService(url)
      const transaction = await service.getRawTransaction({
        transactionHash:
          "0000000000000000000000000000000000000000000000000000000000000",
        blockHash:
          "0000000000000000000000000000000000000000000000000000000000000",
      })
      expect(transaction).to.have.property("vout")
    })
  })
})

describe("RPCService", () => {
  describe("getBlockCount", () => {
    it("should return a number", async () => {
      const service = new RPCService(url)
      const count = await service.getBlockCount()
      expect(count).to.be.a("number")
    })
  })

  describe("getBlock", () => {
    it("should return a block", async () => {
      const service = new RPCService(url)
      const block = await service.getBlock(
        "0000000000000000000000000000000000000000000000000000000000000",
      )
      expect(block).to.have.property("hash")
    })
  })

  describe("getBlockStats", () => {
    it("should return a block stats", async () => {
      const service = new RPCService(url)
      const stats = await service.getBlockStats(1)
      expect(stats).to.have.property("tx")
    })
  })

  describe("getRawTransaction", () => {
    it("should return a raw transaction", async () => {
      const service = new RPCService(url)
      const transaction = await service.getRawTransaction({
        transactionHash:
          "0000000000000000000000000000000000000000000000000000000000000",
        blockHash:
          "0000000000000000000000000000000000000000000000000000000000000",
      })
      expect(transaction).to.have.property("vout")
    })
  })
})
