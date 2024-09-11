import { Controller, Guard, Validate } from "@server/decorator"
import RequestError, {
  handleResultError,
  unwrapResult
} from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"
import { adminSchema } from "../valid"
import { AdminRole, getAdminServices } from "@/core/admin"

@Controller()
class AdminController {
  @Validate(adminSchema)
  @Guard(AdminRole.SUPER_ADMIN)
  async createAdmin(req, res) {
    const superAdmin = req.admin
    const body = req.body
    const newAdmin = await superAdmin.createAdmin({
      email: body.email,
      name: body.name,
      password: body.password,
      phone: body.phone,
      address: body.address
    })
    const result = unwrapResult(newAdmin)
    res.JSON(HttpStatus.Created, result)
  }

  async removeAdmin(req, res) {
    const id = req.params["id"].toString()
    if (!id) {
      throw new RequestError(
        "Require admin id to remove",
        HttpStatus.BadRequest
      )
    }
    let { result: superAdmin, error } = await getAdminServices(
      req.userId,
      AdminRole.SUPER_ADMIN
    )
    if (error) {
      handleResultError(error)
    }
    error = await superAdmin.removeAdmin(id)
    if (error) {
      handleResultError(error)
    }
    res.JSON(HttpStatus.Ok)
  }
  async getAllAdmins(req, res) {
    let role = req.query["role"] || "all"
    if (!["super", "admin"].includes(role)) role = "all"
    const { result: superAdmin, error } = await getAdminServices(
      req.userId,
      AdminRole.SUPER_ADMIN
    )
    if (error) {
      handleResultError(error)
    }
    const adminsList = await superAdmin.getAdminsList(role)

    const result = unwrapResult(adminsList)
    res.JSON(HttpStatus.Ok, result)
  }

  async getAllUsers(req, res) {
    const { result: admin, error } = await getAdminServices(
      req.userId,
      AdminRole.ADMIN
    )
    if (error) {
      handleResultError(error)
    }
    const users = await admin.getAllUsers()
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
    res.JSON(HttpStatus.Ok, user.result)
  }

  @Guard(AdminRole.ADMIN)
  async banUser(req, res) {
    const { id } = req.params
    const admin = req.admin
    const error = await admin.banUser(id)
    if (error) {
      handleResultError(error)
    }
    res.JSON(HttpStatus.Ok)
  }

  @Guard(AdminRole.ADMIN)
  async unBanUser(req, res) {
    const { id } = req.params
    const admin = req.admin
    const error = await admin.unBanUser(id)
    if (error) {
      handleResultError(error)
    }
    res.JSON(HttpStatus.Ok, error)
  }
}

export default new AdminController()
