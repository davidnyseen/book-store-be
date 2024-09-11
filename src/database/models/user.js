import mongoose, { Schema } from "mongoose"
import { ObjectId } from "@type/database"

const defaultSetting = {
  language: "en",
  notification: true
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      select: false,
      required: function() {
        return this.provider === "LOCAL"
      }
    },
    fullName: {
      type: String,
      required: true,
      maxlength: 50
    },
    phoneNumber: String,
    provider: {
      type: String,
      enum: ["GOOGLE", "LOCAL"],
      required: true
    },
    banned: {
      type: Boolean,
      default: false
    },
    settings: {
      type: {
        language: {
          type: String,
          enum: ["en", "ar"],
          default: "en"
        },
        notification: {
          type: Boolean
        }
      },
      _id: false,
      default: defaultSetting
    },
    address: { type: ObjectId, ref: "Address" },
    cart: { type: ObjectId, ref: "Cart" },
    payments: [{ type: ObjectId, ref: "Payment" }],
    isVerified: {
      type: Boolean,
      default: false
    },
    favorites: [{ type: ObjectId, ref: "Product", default: [] }],
    profileImage: String,
    devices: [{ type: String }]
  },
  { timestamps: true }
)

const UserModel = mongoose.model("User", userSchema)

export default UserModel
