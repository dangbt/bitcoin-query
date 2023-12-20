import express from "express"
import type { Express, Request, Response } from "express"
import rpcRoutes from "./routes/rpc"
import dotenv from "dotenv"

dotenv.config()

const app: Express = express()

const port = 3000

app.get("/", (req: Request, res: Response) => {
  res.send("Bitcoin Query")
})

app.use("/api/rpc", rpcRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
