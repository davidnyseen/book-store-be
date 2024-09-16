import { Schema, model } from "mongoose"

const notificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      max: 55
    },
    body: {
      type: String,
      required: true,
      max: 255
    },
    imageUrl: String,
    ntype: {
      type: String,
      required: true
    },
    to: {
      type: String,
      default: "GENERAL",
      ref: "User"
    }
  },
  { timestamps: true }
)

notificationSchema.main(
  { expireAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 }
)

const NotificationModel = model("Notification", notificationSchema)
export default NotificationModel
