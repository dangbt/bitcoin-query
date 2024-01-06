import { InferAttributes } from "sequelize"
import Address, {
  AddressCreationAttributes,
} from "../database/models/address.model"
import sequelize from "sequelize/types/sequelize"

export class AddressService {
  findByAddress = async (address: Address["address"]) => {
    try {
      const res = await Address.findOne({
        where: { address: address },
      })
      return res
    } catch (error) {}
  }
  create = async (address: AddressCreationAttributes) => {
    try {
      const res = await Address.create(address)
      return res
    } catch (error) {}
  }
  update = async (address: InferAttributes<Address>) => {
    try {
      const res = await Address.update(address, {
        where: {
          id: address.id,
        },
      })
      return res
    } catch (error) {}
  }
}
const addressService = new AddressService()

export default addressService
