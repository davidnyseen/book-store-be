import { AdminRole } from "@/core/admin"
import { Controller, Guard, Validate } from "@server/decorator"
import { createCategorySchema, updateCategorySchema } from "../valid"
import RequestError, {
  handleResultError,
  unwrapResult
} from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"
import { validateId } from "@/core/utils"

@Controller()
class CategoryController {
  @Validate(createCategorySchema)
  @Guard(AdminRole.ADMIN)
  async create(req, res) {
    const admin = req.admin
    const body = req.body
    const category = await admin.addCategory(body)
    const result = unwrapResult(category)
    res.JSON(HttpStatus.Created, result)
  }

  @Validate(updateCategorySchema)
  @Guard(AdminRole.ADMIN)
  async editCategory(req, res) {
    const admin = req.admin
    const { id } = req.params
    const body = req.body
    const productData = {
      name: body.name,
      description: body.description,
      image: body.image,
      gender: body.gender
    }
    const product = await admin.editCategory(productData, id)
    const result = unwrapResult(product)
    res.JSON(HttpStatus.Ok, result)
  }

  @Guard(AdminRole.ADMIN)
  async remove(req, res) {
    const admin = req.admin
    const { id } = req.params
    const error = await admin.removeCategory(id)
    if (error) {
      handleResultError(error)
    }
    res.JSON(HttpStatus.Ok)
  }
  @Guard(AdminRole.ADMIN)
  async addProducts(req, res) {
    const admin = req.admin
    const ids = req.body["productsId"]
    for (const id of ids) {
      if (!validateId)
        throw new RequestError("Invalid id" + id, HttpStatus.BadRequest)
    }
    const cat = await admin.addProductsToCategory(req.params["id"], ids)
    const result = unwrapResult(cat)
    res.JSON(HttpStatus.Accepted, result)
  }

  @Guard(AdminRole.ADMIN)
  async removeProducts(req, res) {
    const admin = req.admin
    const ids = req.body["productsId"]
    for (const id of ids) {
      if (!validateId)
        throw new RequestError("Invalid id" + id, HttpStatus.BadRequest)
    }
    const error = await admin.removeProductsFromCategory(req.params["id"], ids)
    if (error) {
      handleResultError(error)
    }
    res.JSON(HttpStatus.Ok)
  }
}

export default new CategoryController()
