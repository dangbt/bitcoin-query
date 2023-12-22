import type { Request, Response } from "express"
import RPCService from "../services/rpc"
import symbolService from "../services/symbol"
import type { SymbolService } from "../services/symbol"
import handler, { StatusCode } from "../utils/handler"
import dotenv from "dotenv"

dotenv.config()

const USER = process.env.RPC_USER
const PASS = process.env.RPC_PASSWORD
const rpcService = new RPCService(`http://${USER}:${PASS}@127.0.0.1:8332/`)

class RPCController {
  rpcService
  symbolService
  constructor(rpcService: RPCService, symbolService: SymbolService) {
    this.rpcService = rpcService
    this.symbolService = symbolService
  }

  getBlockCount = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.rpcService.getBlockCount()
      res.status(StatusCode.SUCCESS).json(
        handler.success({
          data: data,
        }),
      )
    } catch (error) {
      res.status(StatusCode.ERROR).json(handler.error({}))
    }
  }

  getBlock = async (req: Request, res: Response): Promise<void> => {
    try {
      const hash = req.params.hash
      if (hash) {
        const data = await this.rpcService.getBlock(hash)
        res.status(StatusCode.SUCCESS).json(
          handler.success({
            data: data,
          }),
        )
      } else {
        res.status(StatusCode.BAD_REQUEST).json(handler.error({}))
      }
    } catch (error) {
      res.status(StatusCode.ERROR).json(handler.error({}))
    }
  }
  getBlockStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const hash = req.params.hash
      if (hash) {
        const data = await this.rpcService.getBlockStats(Number(hash))
        res.status(StatusCode.SUCCESS).json(
          handler.success({
            data: data,
          }),
        )
      } else {
        res.status(StatusCode.BAD_REQUEST).json(handler.error({}))
      }
    } catch (error) {
      res.status(StatusCode.ERROR).json(handler.error({}))
    }
  }
}

const rpcController = new RPCController(rpcService, symbolService)

export default rpcController
