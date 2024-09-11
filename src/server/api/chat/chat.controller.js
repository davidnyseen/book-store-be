import { Controller, Validate } from "@server/decorator"
import RequestError, { unwrapResult } from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"
import {
  createChat,
  getChatMessages,
  getUserChat,
  saveMessageToChat
} from "@/core/chat"
import { newMessageSchema } from "./chat.valid"
import { validateId } from "@/core/utils"
import {
  SocketEvent,
  emitUserEvent,
  inWebSocket
} from "@server/websocket/sockets"
import Notification, { NotificationType } from "@/core/notification"

@Controller()
class UserController {
  async newChat(req, res) {
    const userId = req.userId
    const chat = await createChat(userId)
    unwrapResult(chat)
    res.JSON(HttpStatus.Created, chat.result)
  }

  async getChat(req, res) {
    const userId = req.userId
    const chat = await getUserChat(userId)

    unwrapResult(chat)
    res.JSON(HttpStatus.Ok, chat.result)
  }

  @Validate(newMessageSchema)
  async sendMessage(req, res) {
    const body = req.body
    const chatId = req.params["id"]
    if (!validateId(chatId))
      throw new RequestError("Invalid Chat id", HttpStatus.BadRequest)

    const messageResult = await saveMessageToChat(
      chatId,
      req.userId,
      body.content
    )
    const message = unwrapResult(messageResult)
    if (inWebSocket(message.to)) {
      emitUserEvent(req.app.get("io"), message.to, SocketEvent.NEW_MESSAGE, {
        ...message.message,
        me: false
      })
    } else {
      const notification = new Notification(
        NotificationType.NEW_MESSAGE,
        message.to
      )
      await notification.push({
        title: "New Message",
        body: message.message.content
      })
    }
    res.JSON(HttpStatus.Created, message.message)
  }
  async getMessages(req, res) {
    const messages = await getChatMessages(req.params["id"], req.userId)
    unwrapResult(messages)
    res.JSON(HttpStatus.Ok, messages.result)
  }
}

export default new UserController()
