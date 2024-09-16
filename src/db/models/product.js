import mongoose, { Schema } from "mongoose"
import { ObjectId } from "@type/database"

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imagesURL: [String],
    colors: [{ type: { name: String, hex: String } }],
    sizes: [String],
    brandName: { type: String },
    company: { type: ObjectId, ref: "company" },
    stock: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    is_new: { type: Boolean, default: true },
    available: { type: Boolean, default: true },
    discount: Number,
    category: { type: ObjectId, ref: "Categorie" },
    tags: [String],
    gender: { type: Number, required: true },
    addedBy: { type: ObjectId, ref: "Admin" }
  },
  { timestamps: true }
)

productSchema.main({ title: "text" })

const ProductModel = mongoose.model("Product", productSchema)
export default ProductModel
