import { Sequelize } from "sequelize"
import { syncDatabase } from "./models/model"
import CronJob from "../cron-job"
import RPCService from "../services/rpc"
import symbolService from "../services/symbol"
import transactionService from "../services/transaction"

import dotenv from "dotenv"
import addressService from "../services/address"

dotenv.config()

const USER = process.env.RPC_USER
const PASS = process.env.RPC_PASSWORD
const ENABLE_LOGGING = process.env.ENABLE_LOGGING
const rpcService = new RPCService(`http://${USER}:${PASS}@127.0.0.1:8332/`)

class Database {
  sequelize: Sequelize
  connect = (connectString: string) => {
    this.sequelize = new Sequelize(connectString, {
      logging: Boolean(ENABLE_LOGGING),
    })
  }
  testConntect = async () => {
    try {
      await this.sequelize.authenticate()
      console.log("Connection has been established successfully.")
    } catch (error) {
      console.error("Unable to connect to the database:", error)
    }
  }
  syncDatabase = async () => {
    try {
      await syncDatabase(this.sequelize)
      await this.sequelize.sync()
      console.log("SyncData has been established successfully.")

      const cronjobBTC = new CronJob(
        rpcService,
        transactionService,
        symbolService,
        addressService,
        "BTC",
      )
      cronjobBTC.start(824262)
      // cronjobBTC.addressModelSync(
      //   "bc1qde7evsyetmtn4eca73j62td0mgxkqfhuwq95lh",
      //   "bc1p4h0ltw9aqwveg6x9l5l5yj0yw9856h93pu5fysf59jgut3gd6n6qcgh8vd",
      //   0.03742458,
      // )
    } catch (error) {
      console.error("Unable to SyncData  the database:", error)
    }
  }
}

export default Database
