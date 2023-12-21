import { Sequelize } from "sequelize"
import Symbol, { initSymbol } from "./symbol.model"
import VolumeProfile, { initVolumeProfile } from "./volume-profile.model"
import Transaction, { initTransaction } from "./transaction.model"

export const syncDatabase = async (sequelize: Sequelize) => {
  initSymbol(sequelize)
  initTransaction(sequelize)
  initVolumeProfile(sequelize)

  Symbol.hasMany(VolumeProfile, { foreignKey: "symbol_id" })
  VolumeProfile.belongsTo(Symbol, { foreignKey: "symbol_id" })

  Symbol.hasMany(Transaction, { foreignKey: "symbol_id" })
  Transaction.belongsTo(Symbol, { foreignKey: "symbol_id" })
}
