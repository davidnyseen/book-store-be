import { AdminRole } from "@/core/admin"
import { Controller, Guard, Validate } from "@server/decorator"
import RequestError, {
  handleResultError,
  unwrapResult
} from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"
import { createCollectionSchema, editCollectionSchema } from "../valid"
import { validateId } from "@/core/utils"

@Controller()
class CollectionController {
  @Validate(createCollectionSchema)
  @Guard(AdminRole.ADMIN)
  async create(req, res) {
    const admin = req.admin
    const body = req.body
    const collection = await admin.createCollection(body)
    unwrapResult(collection)
    res.JSON(HttpStatus.Created, collection.result)
  }

  @Validate(editCollectionSchema)
  @Guard(AdminRole.ADMIN)
  async edit(req, res) {
    const admin = req.admin
    const body = req.body
    if (!validateId(req.params["id"])) {
      throw new RequestError("Invalid Collection id", HttpStatus.BadRequest)
    }
    const collection = await admin.editCollection(req.params["id"], body)
    unwrapResult(collection)
    res.JSON(HttpStatus.Ok, collection.result)
  }
  @Guard(AdminRole.ADMIN)
  async delete(req, res) {
    const admin = req.admin
    if (!validateId(req.params["id"])) {
      throw new RequestError("Invalid Collection id", HttpStatus.BadRequest)
    }
    const error = await admin.removeCollection(req.params["id"])
    if (error) {
      handleResultError(error)
    }
    res.JSON(HttpStatus.Ok)
  }
}

export default new CollectionController()
