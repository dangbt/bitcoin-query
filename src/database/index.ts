import { Sequelize } from "sequelize"
import { syncDatabase } from "./models/model"
import CronJob from "../cron-job"
import RPCService from "../services/rpc"
import symbolService from "../services/symbol"
import transactionService from "../services/transaction"

import dotenv from "dotenv"

dotenv.config()

const USER = process.env.RPC_USER
const PASS = process.env.RPC_PASSWORD
const rpcService = new RPCService(`http://${USER}:${PASS}@127.0.0.1:8332/`)

class Database {
  sequelize: Sequelize
  connect = (connectString: string) => {
    this.sequelize = new Sequelize(connectString)
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
        "BTC",
      )
    } catch (error) {
      console.error("Unable to SyncData  the database:", error)
    }
  }
}

export default Database
