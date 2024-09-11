import { Controller, Validate } from "@server/decorator"
import { loginSchema } from "../valid"
import { unwrapResult } from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"
import { login } from "@/core/admin"

@Controller()
class AuthController {
  @Validate(loginSchema)
  async login(req, res) {
    const body = req.body
    const response = await login(body)
    const result = unwrapResult(response)
    res.JSON(HttpStatus.Ok, result)
  }
}

export default new AuthController()
