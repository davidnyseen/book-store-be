import { Controller, Guard } from "@server/decorator"
import { handleResultError, unwrapResult } from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"
import { AdminRole } from "@/core/admin"
import { SocketEvent, emitUserEvent } from "@server/websocket/sockets"

@Controller()
class AdminController {
  @Guard(AdminRole.ADMIN)
  async acceptChat(req, res) {
    const { id } = req.params
    const admin = req.admin
    const { result: chat, error } = await admin.acceptChat(id)
    if (error) {
      handleResultError(error)
    }
    emitUserEvent(req.app.get("io"), chat.user, SocketEvent.ACCEPT_CHAT)
    res.JSON(HttpStatus.Accepted)
  }

  @Guard(AdminRole.ADMIN)
  async getChats(req, res) {
    const admin = req.admin
    const chats = await admin.getActiveChats()
    const result = unwrapResult(chats)
    res.JSON(HttpStatus.Ok, result)
  }

  @Guard(AdminRole.ADMIN)
  async getChatByID(req, res) {
    const admin = req.admin
    const { id } = req.params
    const chat = await admin.getChatById(id)
    unwrapResult(chat)
    res.JSON(HttpStatus.Ok, chat.result)
  }

  @Guard(AdminRole.ADMIN)
  async closeChat(req, res) {
    const { id } = req.params
    const admin = req.admin
    const { result: chat, error } = await admin.closeChat(id)
    if (error) {
      handleResultError(error)
    }
    emitUserEvent(req.app.get("io"), chat.user, SocketEvent.CLOSE_CHAT)
    res.JSON(HttpStatus.Accepted, null)
  }
}

export default new AdminController()
