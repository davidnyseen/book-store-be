import mongoose, { Schema } from "mongoose"
import { ObjectId } from "@type/database"

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false
    },
    description: {
      type: String
    },
    imageURL: {
      type: String
    },

    gender: {
      type: Number,
      required: true
    },

    addedBy: {
      type: ObjectId,
      ref: "Admin"
    }
  },
  { timestamps: true }
)

const CategoryModel = mongoose.model("Category", categorySchema)
export default CategoryModel
