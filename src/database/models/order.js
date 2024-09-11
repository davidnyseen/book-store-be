import mongoose, { Schema } from "mongoose"
import { ObjectId } from "@type/database"

const orderSchema = new Schema(
  {
    items: [
      {
        type: {
          product: { type: ObjectId, ref: "Product" },
          name: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
          size: { type: String },
          color: { type: String }
        },
        required: function() {
          return this.item_type === "cart"
        }
      }
    ],
    user: { type: ObjectId, ref: "User" },
    address: {
      longitude: {
        type: Number,
        required: true
      },
      latitude: {
        type: Number,
        required: true
      }
    },
    phoneNumber: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    price: { type: Number, required: true },
    tax: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["CASH", "STRIPE"] },
    collection_item: {
      type: {
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        collectionId: {
          type: ObjectId,
          ref: "Collection",
          required: true
        }
      },
      required: function() {
        this.item_type === "collection"
      }
    },
    item_type: {
      default: "cart",
      enum: ["cart", "collection"],
      type: String
    },
    status: {
      type: Number,
      default: 1,
      enum: [1, 2, 3]
    }
  },
  { timestamps: true }
)

const OrderModel = mongoose.model("Order", orderSchema)

export default OrderModel
