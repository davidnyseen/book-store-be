import { JWTAuthService } from "@/core/auth"
import { ErrorType } from "@/core/errors"
import RequestError, { unwrapResult } from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"

export async function isAuth(req, _, next) {
  try {
    const authHeader = req.get("Authorization")
    if (!authHeader) {
      throw new RequestError("not authorized", HttpStatus.Unauthorized)
    }
    const splitHeader = authHeader.split(" ")
    if (splitHeader.length !== 2 && splitHeader[0] !== "Bearer") {
      throw new RequestError("Invalid token format", HttpStatus.BadRequest)
    }
    const userId = JWTAuthService.verifyAccessToken(splitHeader[1])
    unwrapResult(userId, [ErrorType.InvalidToken, HttpStatus.Unauthorized])
    req.userId = userId.result
    next()
  } catch (err) {
    if (err.code) {
      next(err)
      return
    }
    next(RequestError._500())
  }
}
