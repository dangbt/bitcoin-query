import { Sequelize } from "sequelize"
import { syncDatabase } from "./models/model"
import CronJob from "../cron-job"
import rpcService from "../services/rpc"
import symbolService from "../services/symbol"
import transactionService from "../services/transaction"

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
