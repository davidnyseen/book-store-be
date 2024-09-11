import { Controller } from "@server/decorator"
import RequestError, { unwrapResult } from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"
import { validateId } from "@/core/utils"
import Collection from "@/core/collection"

@Controller()
class CollectionController {
  async findOne(req, res) {
    const id = req.params["id"]
    if (!validateId(id)) {
      throw new RequestError("Invalid Collection Id", HttpStatus.BadRequest)
    }
    const collection = await Collection.getOne(id)
    unwrapResult(collection)
    res.JSON(HttpStatus.Ok, collection.result)
  }

  async findAll(_, res) {
    const collections = await Collection.getAll()
    unwrapResult(collections)
    res.JSON(HttpStatus.Ok, collections.result)
  }
}

export default new CollectionController()
