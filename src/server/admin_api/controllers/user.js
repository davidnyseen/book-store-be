import { Controller, Guard } from "@server/decorator"
import { handleResultError, unwrapResult } from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"
import { AdminRole, getAdminServices } from "@/core/admin"

@Controller()
class AdminController {
  @Guard(AdminRole.ADMIN)
  async getAllUsers(req, res) {
    const admin = req.admin
    const users = await admin.getAllUsers()
    unwrapResult(users)
    res.JSON(HttpStatus.Ok, users.result)
  }

  async getOneUser(req, res) {
    const { id } = req.params
    const { result: admin, error } = await getAdminServices(
      req.userId,
      AdminRole.ADMIN
    )
    if (error) {
      handleResultError(error)
    }
    const user = await admin.getOneUser(id)
    unwrapResult(user)
    res.JSON(HttpStatus.Ok, user.result)
  }
}

export default new AdminController()
