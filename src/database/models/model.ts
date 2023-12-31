import { Sequelize } from "sequelize"
import Symbol, { initSymbol } from "./symbol.model"
import VolumeProfile, { initVolumeProfile } from "./volume-profile.model"
import Transaction, { initTransaction } from "./transaction.model"
import Address, { initAddress } from "./address.model"
import HistoryPrice, { initHistoryPrice } from "./history-price"

export const syncDatabase = async (sequelize: Sequelize) => {
  initSymbol(sequelize)
  initTransaction(sequelize)
  initVolumeProfile(sequelize)
  initAddress(sequelize)
  initHistoryPrice(sequelize)

  Symbol.hasMany(VolumeProfile, { foreignKey: "symbol_id" })
  VolumeProfile.belongsTo(Symbol, { foreignKey: "symbol_id" })

  Symbol.hasMany(Transaction, { foreignKey: "symbol_id" })
  Transaction.belongsTo(Symbol, { foreignKey: "symbol_id" })

  Symbol.hasMany(Address, { foreignKey: "symbol_id" })
  Address.belongsTo(Symbol, { foreignKey: "symbol_id" })

  Symbol.hasMany(HistoryPrice, { foreignKey: "symbol_id" })
  HistoryPrice.belongsTo(Symbol, { foreignKey: "symbol_id" })
}
