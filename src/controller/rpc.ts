import type { Request, Response } from "express"
import rpcService from "../services/rpc"
import symbolService from "../services/symbol"
import type { RPCService } from "../services/rpc"
import type { SymbolService } from "../services/symbol"
import handler, { StatusCode } from "../utils/handler"

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
        const data = await this.rpcService.getBlockStats(hash)
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
