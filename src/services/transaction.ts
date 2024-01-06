import Transaction, {
  TransactionCreationAttributes,
} from "../database/models/transaction.model"

export class TransactionService {
  findByTx = async (tx: TransactionCreationAttributes["tx"]) => {
    try {
      const res = await Transaction.findOne({
        where: { tx: tx },
      })
      return res
    } catch (error) {}
  }
  create = async (transaction: TransactionCreationAttributes) => {
    try {
      const res = await Transaction.create(transaction)
      return res
    } catch (error) {}
  }
}
const transactionService = new TransactionService()

export default transactionService
