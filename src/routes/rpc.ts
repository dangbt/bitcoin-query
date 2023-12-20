import express from "express"
import rpcController from "../controller/rpc"
const router = express.Router()

router.get("/getblockcount", rpcController.getBlockCount)
router.get("/getblockhash/:hash", rpcController.getBlockHash)

export default router
