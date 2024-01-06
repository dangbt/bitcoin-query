import { InferAttributes, Op } from "sequelize"
import HistoryPrice, {
  HistoryPriceCreationAttributes,
} from "../database/models/history-price"

export class HistoryPriceService {
  find = async (id: HistoryPrice["id"]) => {
    try {
      const res = await HistoryPrice.findOne({
        where: { id },
      })
      return res
    } catch (error) {}
  }
  findByTime = async (time: HistoryPrice["time"]) => {
    try {
      let res

      res = await HistoryPrice.findOne({
        where: {
          time: {
            [Op.lt]: time,
          },
        },
        order: [["time", "DESC"]], // order by desc will make highest to the first record
      })
      return res
    } catch (error) {}
  }
  create = async (history: HistoryPriceCreationAttributes) => {
    try {
      const res = await HistoryPrice.create(history)
      return res
    } catch (error) {}
  }
  update = async (history: InferAttributes<HistoryPrice>) => {
    try {
      const res = await HistoryPrice.update(history, {
        where: {
          id: history.id,
        },
      })
      return res
    } catch (error) {}
  }
  updateSert = async (history: InferAttributes<HistoryPrice>) => {
    try {
      const res = await HistoryPrice.upsert(history)
      return res
    } catch (error) {}
  }
}
const historyPriceService = new HistoryPriceService()

export default historyPriceService
