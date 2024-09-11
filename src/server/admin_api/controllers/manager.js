import { Controller, Validate } from "@server/decorator"
import { adminSchema } from "../valid"
import { createManager } from "@/core/admin/manager"
import { handleResultError, unwrapResult } from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"
import { AdminRole, getAdminServices } from "@/core/admin"

@Controller()
class ManagerController {
  @Validate(adminSchema)
  async create(req, res) {
    const body = req.body
    const manager = await createManager({
      email: body.email,
      name: body.name,
      password: body.password,
      phone: body.phone
    })
    unwrapResult(manager)
    res.JSON(HttpStatus.Created, manager.result)
  }

  @Validate(adminSchema)
  async createSuper(req, res) {
    const body = req.body
    const { result: manager, error } = await getAdminServices(
      req.userId,
      AdminRole.MANAGER
    )
    if (error) {
      handleResultError(error)
    }
    const superAdmin = await manager.createSuperAdmin({
      email: body.email,
      name: body.name,
      password: body.password,
      phone: body.phone
    })
    const result = unwrapResult(superAdmin)
    res.JSON(HttpStatus.Created, result)
  }
}

export default new ManagerController()
