import mongoose, { Schema } from "mongoose"
import { ObjectId } from "@type/database"

const reviewSchema = new Schema(
  {
    user: { type: ObjectId, ref: "User", required: true },
    product: { type: ObjectId, ref: "Product" },
    comment: { type: String, default: "" },
    rate: { type: Number, required: true, min: 1, max: 5 }
  },
  { timestamps: true }
)

const ReviewModel = mongoose.model("Review", reviewSchema)
export default ReviewModel
