import orderServices from "@/core/order"
import { Controller, Validate } from "@server/decorator"
import RequestError, { unwrapResult } from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"
import { orderSchema } from "./order.valid"
import { validateId } from "@/core/utils"

@Controller()
class OrderController {
  @Validate(orderSchema)
  async createCashOrder(req, res) {
    const body = req.body
    const type = req.query.type?.toString().toLowerCase()
    let os = orderServices.orderPayment(type, {
      userId: req.userId,
      ...body
    })
    const order = await os.cash()
    unwrapResult(order)
    res.JSON(HttpStatus.Created, order.result)
  }

  async getAll(req, res) {
    const orders = await orderServices.getAllOrder(req.userId)
    unwrapResult(orders)
    res.JSON(HttpStatus.Ok, orders.result)
  }

  async getOne(req, res) {
    const id = req.body["id"]
    if (!validateId(id))
      throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest)
    const order = await orderServices.getOrderByID(req.userId, id)
    unwrapResult(order)
    res.JSON(HttpStatus.Ok, order.result)
  }

  async getItems(req, res) {
    const id = req.body["id"]
    if (!validateId(id))
      throw new RequestError(`id '${id}' is not valid`, HttpStatus.BadRequest)
    const items = await orderServices.getOrderItems(req.userId, id)
    unwrapResult(items)
    res.JSON(HttpStatus.Ok, items.result)
  }

  @Validate(orderSchema)
  async paymentIntent(req, res) {
    const body = req.body
    const type = req.query.type?.toString().toLowerCase()
    let os = orderServices.orderPayment(type, {
      userId: req.userId,
      ...body
    })
    const payment = await os.getClientSecret()
    unwrapResult(payment)
    res.JSON(HttpStatus.Created, payment.result)
  }
}

export default new OrderController()
