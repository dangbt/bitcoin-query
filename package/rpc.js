"use strict"
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, "__esModule", { value: true })
exports.RPCService = void 0
const axios_1 = __importDefault(require("../axios/axios"))
class RPCService {
  constructor(url) {
    this.getBlockCount = () =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblockcount","params":[]}`
          const res = yield axios_1.default.post("/", dataString)
          return res.data
        } catch (error) {
          throw Error(error)
        }
      })
    this.getBlock = (hash) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblock","params":["${hash}"]}`
          const res = yield axios_1.default.post("/", dataString)
          return res.data
        } catch (error) {
          throw Error(error)
        }
      })
    this.getBlockStats = (height) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblockstats","params":[${height}]}`
          const res = yield axios_1.default.post("/", dataString)
          return res.data
        } catch (error) {
          throw Error(error)
        }
      })
    this.getRawTransaction = ({ transactionHash, blockHash }) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getrawtransaction","params":["${transactionHash}", 2, "${blockHash}"]}`
          const res = yield axios_1.default.post("/", dataString)
          return res.data
        } catch (error) {
          throw Error(error)
        }
      })
    if (!url) {
      throw Error(
        "URL required, it is look like http://${USER}:${PASS}@127.0.0.1:8332/",
      )
    }
    this.url = url
    axios_1.default.defaults.baseURL = url
    axios_1.default.defaults.headers.common["Content-Type"] = "text/plain"
  }
}
exports.RPCService = RPCService
exports.default = RPCService
