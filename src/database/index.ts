import { InferAttributes, Sequelize } from "sequelize"
import fs from "fs"
import { syncDatabase } from "./models/model"
import CronJob from "../cron-job"
import RPCService from "../services/rpc"
import symbolService from "../services/symbol"
import transactionService from "../services/transaction"
import { parse } from "csv-parse"
import dotenv from "dotenv"
import addressService from "../services/address"
import historyPriceService from "../services/history-price"
import HistoryPrice, {
  HistoryPriceCreationAttributes,
} from "./models/history-price"

dotenv.config()

const USER = process.env.RPC_USER
const PASS = process.env.RPC_PASSWORD
const ENABLE_LOGGING = process.env.ENABLE_LOGGING
const rpcService = new RPCService(`http://${USER}:${PASS}@127.0.0.1:8332/`)

class Database {
  sequelize: Sequelize
  connect = (connectString: string) => {
    this.sequelize = new Sequelize(connectString, {
      logging: ENABLE_LOGGING === "true" ? true : false,
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
  initHistoryPriceData = () => {
    try {
      let id = 1
      fs.createReadStream(`${__dirname}/BTC_All_graph_coinmarketcap.csv`)
        .pipe(parse({ delimiter: ";", from_line: 2 }))
        .on("data", async function (row) {
          const history: any = {
            id: id,
            symbol_id: 1,
            open: Number(row[1]),
            high: Number(row[2]),
            low: Number(row[3]),
            close: Number(row[4]),
            volume: Number(row[5]),
            market_cap: Number(row[6]),
            time: new Date(row[7]).getTime() / 1000, // convert to second
          }
          historyPriceService.updateSert(history)
          id += 1
        })
    } catch (error) {
      console.log(error)
    }
  }
  syncDatabase = async () => {
    try {
      await syncDatabase(this.sequelize)
      await this.sequelize.sync()
      this.initHistoryPriceData()
      console.log("SyncData has been established successfully.")

      const cronjobBTC = new CronJob(
        rpcService,
        transactionService,
        symbolService,
        addressService,
        historyPriceService,
        "BTC",
      )
      cronjobBTC.start(824811)
      // // cronjobBTC.addressModelSync(
      // //   "bc1qde7evsyetmtn4eca73j62td0mgxkqfhuwq95lh",
      // //   "bc1p4h0ltw9aqwveg6x9l5l5yj0yw9856h93pu5fysf59jgut3gd6n6qcgh8vd",
      // //   0.03742458,
      // // )
    } catch (error) {
      console.error("Unable to SyncData  the database:", error)
    }
  }
}

export default Database
