import { AppError } from "../errors"
import OrderModel from "@/database/models/order"
import { CartOrder } from "./cart_order"
import { validateId } from "../utils"
import { CollectionOrder } from "./collection_order"
import * as Helper from "./helper"

export class OrderServices {
  async getAllOrder(userId) {
    try {
      const order = await OrderModel.find({ user: userId })
      return { result: order.map(o => Helper._formatOrder(o)), error: null }
    } catch (error) {
      return { error, result: null }
    }
  }

  async getOrderByID(userId, orderId) {
    try {
      const order = await OrderModel.findById(orderId)
      if (!order) throw AppError.notFound("Order not found")
      if (order.user.toString() !== userId) throw AppError.permission()
      return { result: Helper._formatOrder(order), error: null }
    } catch (error) {
      return { error, result: null }
    }
  }

  async getOrderForAdmin(id) {
    try {
      const order = await OrderModel.findById(id)
      if (!order) throw AppError.notFound("Order not found.")
      return { result: order.toJSON(), error: null }
    } catch (error) {
      return { error, result: null }
    }
  }

  async getOrderItems(userId, orderId) {
    try {
      const order = await OrderModel.findById(orderId).populate("items.product")
      if (!order) throw AppError.notFound("Order not found.")
      if (order.user.toString() !== userId) throw AppError.permission()
      return { result: order.items, error: null }
    } catch (error) {
      return { error, result: null }
    }
  }

  orderPayment(type, o) {
    if (type === "cart") {
      return new CartOrder(o.userId)
    } else if (type === "collection") {
      if (!o.collectionId || !validateId(o.collectionId))
        throw AppError.invalid("Invalid collection id")
      return new CollectionOrder(o.userId, o.collectionId)
    } else {
      throw AppError.invalid("Invalid order type")
    }
  }

  async changeOrderStatus(id, status) {
    try {
      const order = await OrderModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      )
      if (!order) {
        throw AppError.notFound("Order not found.")
      }
      return { error: null, result: order.toJSON() }
    } catch (error) {
      return { error, result: null }
    }
  }
}

export default new OrderServices()

export * from "./cart_order"
export * from "./order"
export * from "./interfaces"
