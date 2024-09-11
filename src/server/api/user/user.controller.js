import { User } from "@/core/user"
import { validateId } from "@/core/utils"
import { Controller, Validate } from "@server/decorator"
import RequestError, {
  handleResultError,
  unwrapResult
} from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"
import { addressSchema, editUserSchema } from "./user.valid"
import { Favorites } from "@/core/favorites"

@Controller()
class UserController {
  async getMe(req, res) {
    const user = new User(req.userId)
    const userResult = await user.me()
    unwrapResult(userResult)
    res.JSON(HttpStatus.Ok, userResult.result)
  }

  @Validate(editUserSchema)
  async editMe(req, res) {
    const user = new User(req.userId)
    const body = req.body
    const userResult = await user.editMe(body)
    unwrapResult(userResult)
    res.JSON(HttpStatus.Ok, userResult.result)
  }

  async getMyFav(req, res) {
    const fav = new Favorites(req.userId)
    const myFav = await fav.getAll(req.query["data"] !== "id")
    unwrapResult(myFav)
    res.JSON(HttpStatus.Ok, myFav.result)
  }

  async addToFav(req, res) {
    const id = req.body["id"]
    if (!validateId(id))
      throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest)
    const user = new Favorites(req.userId)
    const favList = await user.add(id, req.query["data"] !== "id")
    unwrapResult(favList)
    res.JSON(HttpStatus.Ok, favList.result)
  }

  async removeFav(req, res) {
    const id = req.body["id"]
    if (!validateId(id))
      throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest)
    const user = new Favorites(req.userId)
    const error = await user.remove(id)
    if (error) {
      handleResultError(error)
    }
    res.JSON(HttpStatus.Ok)
  }

  async updateProfile(req, res) {
    const user = new User(req.userId)
    const image = await user.updateProfileImage(req.file)
    unwrapResult(image)
    res.JSON(HttpStatus.Accepted, image.result)
  }

  async getAddress(req, res) {
    const user = new User(req.userId)
    const address = await user.getAddress()
    unwrapResult(address)
    res.JSON(HttpStatus.Ok, address.result)
  }

  @Validate(addressSchema)
  async addAddress(req, res) {
    const user = new User(req.userId)
    const body = req.body
    const userAddress = await user.addNewAddress(body)
    unwrapResult(userAddress)
    res.JSON(HttpStatus.Created, userAddress.result)
  }

  async removeAddress(req, res) {
    const id = req.params["id"]
    if (!validateId(id))
      throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest)
    const user = new User(req.userId)
    const error = await user.removeAddress(id)
    if (error) {
      handleResultError(error)
    }
    res.JSON(HttpStatus.Ok)
  }
}

export default new UserController()
