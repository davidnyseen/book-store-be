import mongoose, { Schema } from "mongoose"
import { ObjectId } from "@type/database"

const discountSchema = new Schema({
  products: [{ type: ObjectId, ref: "Product" }],
  categories: [{ type: ObjectId, ref: "Category" }],
  brands: [{ type: ObjectId, ref: "company" }],
  percentage: { type: Number, required: true },
  startDate: { type: Number, required: true, default: Date.now },
  endDate: { type: Number, required: true }
})

const DiscountModel = mongoose.model("Discount", discountSchema)
export default DiscountModel
