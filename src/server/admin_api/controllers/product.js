import { Controller, Validate, Guard } from "@server/decorator"
import {
  createProductSchema,
  productDiscount,
  updateProductSchema
} from "../valid"
import { handleResultError, unwrapResult } from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"
import { AdminRole } from "@/core/admin"

@Controller()
class ProductController {
  @Validate(createProductSchema)
  @Guard(AdminRole.ADMIN)
  async create(req, res) {
    const admin = req.admin
    const body = req.body
    const product = await admin.addProduct(body)
    // if (product.error) {
    //   if (product.error instanceof InvalidDataError) {
    //     throw new RequestError(product.error.message, HttpStatus.BadRequest);
    //   }
    //   throw RequestError._500();
    // }
    const result = unwrapResult(product)
    res.JSON(HttpStatus.Created, result)
  }
  @Guard(AdminRole.ADMIN)
  async remove(req, res) {
    const admin = req.admin
    const id = req.params["id"]
    const error = await admin.removeProduct(id)
    // if (error) {
    //   if (error instanceof NotFoundError)
    //     throw new RequestError(error.message, HttpStatus.NotFound);
    //   throw RequestError._500();
    // }
    if (error) {
      handleResultError(error)
    }
    res.JSON(HttpStatus.Ok)
  }

  @Validate(updateProductSchema)
  @Guard(AdminRole.ADMIN)
  async editProduct(req, res) {
    const admin = req.admin
    const { id } = req.params
    const body = req.body
    const product = await admin.editProduct(id, body)
    // if (product.error) {
    //   throw RequestError._500();
    // }
    unwrapResult(product)
    res.JSON(HttpStatus.Ok, product.result)
  }

  @Validate(productDiscount)
  @Guard(AdminRole.ADMIN)
  async addDiscount(req, res) {
    const admin = req.admin
    const { id } = req.params
    const { discount } = req.body
    const product = await admin.addDiscount(id, discount)
    unwrapResult(product)
    res.JSON(HttpStatus.Ok, product.result)
  }

  @Guard(AdminRole.ADMIN)
  async removeDiscount(req, res) {
    const admin = req.admin
    const { id } = req.params
    const error = await admin.removeDiscount(id)
    if (error) {
      handleResultError(error)
    }
    res.JSON(HttpStatus.Ok)
  }
}
export default new ProductController()
