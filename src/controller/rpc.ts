import type { Request, Response } from "express"
import rpcService from "../services/rpc"
import type { RPCService } from "../services/rpc"

class RPCController {
  rpcService
  constructor(rpcService: RPCService) {
    this.rpcService = rpcService
  }

  getBlockCount = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.rpcService.getBlockCount()
      res.status(200).json(data)
    } catch (error) {
      console.log(error)
    }
  }

  getBlockHash = async (req: Request, res: Response): Promise<void> => {
    try {
      const hash = req.params.hash
      if (hash) {
        const data = await this.rpcService.getBlockHash(hash)
        res.status(200).json(data)
      } else {
        res.status(500)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

const rpcController = new RPCController(rpcService)

export default rpcController
