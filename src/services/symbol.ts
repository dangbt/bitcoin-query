import Symbol, {
  SymbolCreationAttributes,
} from "../database/models/symbol.model"

export class SymbolService {
  findByName = async (symbol: Omit<SymbolCreationAttributes, "tick_price">) => {
    try {
      const res = await Symbol.findOne({
        where: { name: symbol.name },
      })
      return res
    } catch (error) {}
  }
  create = async (symbol: SymbolCreationAttributes) => {
    try {
      const res = await Symbol.create(symbol)
      return res
    } catch (error) {}
  }
}
const symbolService = new SymbolService()

export default symbolService
