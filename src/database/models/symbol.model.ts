import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize"

export type SymbolCreationAttributes = InferCreationAttributes<
  Symbol,
  { omit: "id" | "created_at" | "updated_at" }
>
// Valid
class Symbol extends Model<InferAttributes<Symbol>, SymbolCreationAttributes> {
  declare id: number
  declare name: string
  declare tick_price: number
  declare created_at: Date
  declare updated_at: Date
}

export const initSymbol = (sequelize: Sequelize) => {
  Symbol.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tick_price: {
        type: DataTypes.INTEGER,
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
      modelName: "Symbol",
      freezeTableName: true,
      underscored: true,
    },
  )
}

export default Symbol
