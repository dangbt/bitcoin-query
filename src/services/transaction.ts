import Transaction, {
  TransactionCreationAttributes,
} from "../database/models/transaction.model"

export class TransactionService {
  createTransaction = async (transaction: TransactionCreationAttributes) => {
    try {
      const res = await Transaction.create(transaction)
      return res
    } catch (error) {}
  }
}
const transactionService = new TransactionService()

export default transactionService
