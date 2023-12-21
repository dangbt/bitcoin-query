import express from "express"
import type { Express, Request, Response } from "express"
import dotenv from "dotenv"

import rpcRoutes from "./routes/rpc"
import Database from "./database"

dotenv.config()

const PORT = process.env.PORT || 3000
const CONNECTION_STRING = process.env.CONNECTION_STRING

const app: Express = express()

export const database = new Database()
database.connect(CONNECTION_STRING as string)
database.testConntect()
database.syncDatabase()

app.get("/", (req: Request, res: Response) => {
  res.send("Bitcoin Query")
})

app.use("/api/rpc", rpcRoutes)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
