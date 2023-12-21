import { DataTypes, Model, Sequelize } from "sequelize"
// Valid
class VolumeProfile extends Model {
  declare id: number
  declare from: Date
  declare to: Date
  declare volume: number
}

export const initVolumeProfile = (sequelize: Sequelize) => {
  VolumeProfile.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      from: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      to: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      volume: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize: sequelize,
      modelName: "VolumeProfile",
      freezeTableName: true,
      underscored: true,
    },
  )
}
export default VolumeProfile
