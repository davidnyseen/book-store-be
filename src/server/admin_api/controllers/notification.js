import { Controller, Guard, Validate } from "@server/decorator"
import { notificationMessageSchema } from "../valid"
import { HttpStatus } from "@server/utils/status"
import { AdminRole } from "@/core/admin"

@Controller()
class NotificationController {
  @Validate(notificationMessageSchema)
  @Guard(AdminRole.ADMIN)
  async push(req, res) {
    const body = req.body
    const admin = req.admin
    admin.pushNotification(body)
    res.JSON(HttpStatus.Ok)
  }
}

export default new NotificationController()
