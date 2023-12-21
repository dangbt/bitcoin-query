import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize"

export type TransactionCreationAttributes = InferCreationAttributes<
  Transaction,
  { omit: "id" | "created_at" | "updated_at" }
>
// Valid
class Transaction extends Model<
  InferAttributes<Transaction>,
  TransactionCreationAttributes
> {
  declare id: number
  declare from: string
  declare to: string
  declare value: number
  declare time: number
  declare symbol_id: number
  declare created_at: Date
  declare updated_at: Date
}

export const initTransaction = (sequelize: Sequelize) => {
  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      symbol_id: {
        type: DataTypes.INTEGER,
      },
      from: {
        type: DataTypes.STRING, // hex
        allowNull: false,
      },
      to: {
        type: DataTypes.STRING, // hex
        allowNull: false,
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize: sequelize,
      modelName: "Transaction",
      freezeTableName: true,
      underscored: true,
    },
  )
}

export default Transaction
