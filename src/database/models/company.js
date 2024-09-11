import mongoose, { Schema } from "mongoose"

const brandSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    logo: String,
    description: { type: String, required: true },
    link: String
  },
  { timestamps: true }
)

const BrandModel = mongoose.model("company", brandSchema)

export default BrandModel
