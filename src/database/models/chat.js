import mongoose from "mongoose"
import { ObjectId } from "@type/database"

export let ChatStatus

;(function(ChatStatus) {
  ChatStatus["ACTIVE"] = "active"
  ChatStatus["WAITING"] = "waiting"
  ChatStatus["CLOSED"] = "closed"
})(ChatStatus || (ChatStatus = {}))

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true
    },
    admin: {
      type: ObjectId,
      ref: "Admin"
    },
    messages: [
      {
        sender: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, required: true, default: Date.now }
      }
    ],
    status: {
      type: String,
      enum: [ChatStatus.ACTIVE, ChatStatus.WAITING, ChatStatus.CLOSED],
      required: true
    }
  },
  { timestamps: true }
)

const ChatModel = mongoose.model("Chat", chatSchema)
export default ChatModel
