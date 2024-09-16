import mongoose, { Schema } from "mongoose"
import { ObjectId } from "@type/database"

const cartSchema = new Schema({
  totalQuantity: {
    type: Number,
    default: 0
  },
  items: [
    {
      product: { type: ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      size: String,
      color: String
    }
  ]
})

const CartModel = mongoose.model("Cart", cartSchema)

export default CartModel
