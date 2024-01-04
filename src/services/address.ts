import { InferAttributes } from "sequelize"
import Address, {
  AddressCreationAttributes,
} from "../database/models/address.model"
import sequelize from "sequelize/types/sequelize"

export class AddressService {
  findAddressByAddress = async (address: Address["address"]) => {
    try {
      const res = await Address.findOne({
        where: { address: address },
      })
      return res
    } catch (error) {}
  }
  createAddress = async (address: AddressCreationAttributes) => {
    try {
      const res = await Address.create(address)
      return res
    } catch (error) {}
  }
  updateAddress = async (address: InferAttributes<Address>) => {
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
