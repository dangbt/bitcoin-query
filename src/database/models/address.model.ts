import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize"

export type AddressCreationAttributes = InferCreationAttributes<
  Address,
  { omit: "id" | "created_at" | "updated_at" }
>
// Valid
class Address extends Model<
  InferAttributes<Address>,
  AddressCreationAttributes
> {
  declare id: number
  declare address: string
  declare value: number
  declare avg_price: number
  declare symbol_id: number
  declare created_at: Date
  declare updated_at: Date
}

export const initAddress = (sequelize: Sequelize) => {
  Address.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      symbol_id: {
        type: DataTypes.INTEGER,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      value: {
        type: DataTypes.FLOAT,
      },
      avg_price: {
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
      modelName: "Address",
      freezeTableName: true,
      underscored: true,
    },
  )
}

export default Address
