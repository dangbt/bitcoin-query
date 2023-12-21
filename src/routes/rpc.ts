import express from "express"
import rpcController from "../controller/rpc"
const router = express.Router()

router.get("/getblockcount", rpcController.getBlockCount)
router.get("/getblockhash/:hash", rpcController.getBlock)
router.get("/getblockstats/:hash", rpcController.getBlockStats)

export default router
