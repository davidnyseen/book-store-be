import { User } from "@/core/user"
import { validateId } from "@/core/utils"
import { Controller, Validate } from "@server/decorator"
import RequestError, {
  handleResultError,
  unwrapResult
} from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"
import { editItemCartSchema, itemCartSchema } from "./user.valid"

async function getUserCart(userId) {
  const user = new User(userId)
  const { result: cart, error } = await user.getMyCart()
  if (error) {
    handleResultError(error)
  }
  return cart
}

@Controller()
class UserController {
  @Validate(itemCartSchema)
  async addToCart(req, res) {
    const item = req.body
    if (!validateId(item.id))
      throw new RequestError(
        `id '${item.id}' is not valid`,
        HttpStatus.BadRequest
      )
    const cart = await getUserCart(req.userId)
    const cartResult = await cart.addItem(item)
    unwrapResult(cartResult)
    res.JSON(HttpStatus.Created, cartResult.result)
  }

  async removeItem(req, res) {
    const id = req.body["id"]
    if (!validateId(id))
      throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest)
    const cart = await getUserCart(req.userId)
    const { result, error } = await cart.removeItem(id)
    if (error) {
      handleResultError(error)
      // throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, result)
  }
  async getMyCart(req, res) {
    const cart = await getUserCart(req.userId)
    const result = await cart.getCart()
    res.JSON(HttpStatus.Ok, result)
  }

  @Validate(editItemCartSchema)
  async editItemQ(req, res) {
    const item = req.body
    if (!validateId(item.id))
      throw new RequestError(
        `id '${item.id}' is not valid`,
        HttpStatus.BadRequest
      )
    const cart = await getUserCart(req.userId)
    const cartResult = await cart.editItemQuantity(item.id, item.quantity)
    unwrapResult(cartResult)
    res.JSON(HttpStatus.Created, cartResult.result)
  }
}

export default new UserController()
