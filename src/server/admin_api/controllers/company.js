import { AdminRole } from "@/core/admin"
import { Controller, Guard, Validate } from "@server/decorator"
import { createBrandSchema, updateBrandSchema } from "../valid"
import RequestError, {
  handleResultError,
  unwrapResult
} from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"
import { validateId } from "@/core/utils"

@Controller()
class BrandController {
  @Validate(createBrandSchema)
  @Guard(AdminRole.ADMIN)
  async create(req, res) {
    const admin = req.admin
    const body = req.body
    const brandData = {
      name: body.name,
      description: body.description,
      link: body.link,
      logo: body.logo || ""
    }
    const company = await admin.addBrand(brandData)
    const result = unwrapResult(company)
    res.JSON(HttpStatus.Created, result)
  }

  @Validate(updateBrandSchema)
  @Guard(AdminRole.ADMIN)
  async editBrand(req, res) {
    const admin = req.admin
    const { id } = req.params
    const body = req.body
    const productData = {
      name: body.name,
      description: body.description,
      link: body.link
    }
    const company = await admin.editBrand(productData, id)
    const result = unwrapResult(company)
    res.JSON(HttpStatus.Ok, result)
  }

  @Guard(AdminRole.ADMIN)
  async remove(req, res) {
    const admin = req.admin
    const { id } = req.params
    const error = await admin.removeBrand(id)
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
    const company = await admin.addProductsToBrand(req.params["id"], ids)
    const result = unwrapResult(company)
    res.JSON(HttpStatus.Ok, result)
  }

  @Guard(AdminRole.ADMIN)
  async removeProducts(req, res) {
    const admin = req.admin
    const ids = req.body["productsId"]
    for (const id of ids) {
      if (!validateId)
        throw new RequestError("Invalid id" + id, HttpStatus.BadRequest)
    }
    const error = await admin.removeProductsFromBrand(req.params["id"], ids)
    if (error) {
      handleResultError(error)
    }
    res.JSON(HttpStatus.Ok)
  }
}

export default new BrandController()
