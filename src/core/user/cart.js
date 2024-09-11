import CartModel from "@/database/models/cart"
import ProductModel from "@/database/models/product"
import { AppError } from "../errors"

export class Cart {
  constructor(cart) {
    this.cart = cart
  }

  static async createCart() {
    return await CartModel.create({})
  }

  async addItem(item) {
    try {
      const product = await ProductModel.findById(item.id)
      if (!product) {
        throw AppError.invalid("Product not found.")
      }

      const itemIndex = this.cart.items.findIndex(
        i =>
          i.product.toString() === product._id.toString() &&
          item.color === i.color &&
          item.size === i.size
      )

      if (itemIndex !== -1) {
        this.cart.items[itemIndex].quantity += item.quantity
      } else {
        const cartItem = {
          product: product._id,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        }
        this.cart.items.push(cartItem)
      }

      this.cart.totalQuantity += item.quantity
      await this.cart.save()

      return { result: await this._formatCart(), error: null }
    } catch (err) {
      return { error: err, result: null }
    }
  }

  async removeItem(id) {
    try {
      const item = this.cart.items.find(i => i._id?.toString() === id)
      if (!item) throw AppError.invalid("Product with id " + id + " not found.")
      this.cart.items.pull({ _id: id })
      if (this.cart.items.length === 1) {
        this.cart.totalQuantity = 0
      } else {
        this.cart.totalQuantity -= item.quantity
      }
      await this.cart.save()
      return { result: await this._formatCart(), error: null }
    } catch (err) {
      return { error: err, result: null }
    }
  }

  async editItemQuantity(id, newQ) {
    try {
      const itemIndex = this.cart.items.findIndex(i => i._id?.toString() === id)
      if (itemIndex === -1)
        throw AppError.invalid("Product with id " + id + " not found.")
      const newItem = this.cart.items[itemIndex]
      const qdi = newQ - newItem.quantity
      newItem.quantity = newQ
      this.cart.items.set(itemIndex, newItem)
      this.cart.totalQuantity += qdi
      await this.cart.save()
      return { result: await this._formatCart(), error: null }
    } catch (err) {
      return { error: err, result: null }
    }
  }

  async getCart() {
    return await this._formatCart()
  }

  async _formatCart() {
    await this.cart.populate("items.product")
    const { totalPrice } = getCartItemsInfo(this.cart)
    return {
      items: this.cart.items.map(i => ({
        id: i._id.toString(),
        productId: i.product._id,
        title: i.product.title,
        color: i.color,
        size: i.size,
        imageUrl: i.product.imagesURL[0],
        stock: i.product.stock,

        quantity: i.quantity,
        price: i.product.price - (i.product.discount || 0 * i.product.price),
        totalPrice:
          (i.product.price - (i.product.discount || 0 * i.product.price)) *
          i.quantity,
        oldPrice: i.product.price,
        oldTotalPrice: i.product.price * i.quantity
      })),
      subtotal: totalPrice,
      totalQuantity: this.cart.totalQuantity,
      tax: 0,
      total: totalPrice
    }
  }
}

export function getCartItemsInfo(cart) {
  let result = { totalPrice: 0 }
  for (const i of cart.items) {
    if (typeof i.product === "string") continue
    result.totalPrice +=
      (i.product.price - (i.product.discount || 0)) * i.quantity
  }
  return result
}
