import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize"

export type HistoryPriceCreationAttributes = InferCreationAttributes<
  HistoryPrice,
  { omit: "id" | "created_at" | "updated_at" }
>
// Valid
class HistoryPrice extends Model<
  InferAttributes<HistoryPrice>,
  HistoryPriceCreationAttributes
> {
  declare id: number
  declare symbol_id: number
  declare open: number
  declare close: number
  declare high: number
  declare low: number
  declare volume: number
  declare market_cap: number
  declare time: number
  declare created_at: Date
  declare updated_at: Date
}

export const initHistoryPrice = (sequelize: Sequelize) => {
  HistoryPrice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      symbol_id: {
        type: DataTypes.INTEGER,
      },
      open: {
        type: DataTypes.FLOAT,
      },
      close: {
        type: DataTypes.FLOAT,
      },
      high: {
        type: DataTypes.FLOAT,
      },
      low: {
        type: DataTypes.FLOAT,
      },
      volume: {
        type: DataTypes.FLOAT,
      },
      market_cap: {
        type: DataTypes.FLOAT,
      },
      time: {
        type: DataTypes.FLOAT,
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
      modelName: "HistoryPrice",
      freezeTableName: true,
      underscored: true,
    },
  )
}

export default HistoryPrice
