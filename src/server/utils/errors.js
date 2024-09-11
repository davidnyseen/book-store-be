import { HttpStatus } from "./status"
import { AppError, ErrorType } from "@/core/errors"

class RequestError extends Error {
  code = HttpStatus.InternalServerError
  constructor(message, code) {
    super(message.toString())
    if (code) this.code = code
  }
  static _500() {
    return new RequestError(
      "We encountered an unexpected error while processing your request.",
      HttpStatus.InternalServerError
    )
  }
}

export default RequestError

export function unwrapResult(result, ...customError) {
  if (!result.error) {
    return result.result
  }
  handleResultError(result.error, ...customError)
}

export function handleResultError(error, ...customError) {
  if (error) {
    if (!(error instanceof AppError)) {
      console.log(error)
      throw RequestError._500()
    }
    if (customError) {
      const customErrorIndex = customError.findIndex(e => e[0] === error.type)
      if (customErrorIndex !== -1) {
        throw new RequestError(error, customError[customErrorIndex][1])
      }
    }
    switch (error.type) {
      case ErrorType.Duplicate:
      case ErrorType.InvalidData:
        throw new RequestError(error, HttpStatus.BadRequest)
      case ErrorType.InvalidCredentials:
      case ErrorType.InvalidToken:
      case ErrorType.ManagerExist:
      case ErrorType.Permission:
      case ErrorType.Unauthorized:
      case ErrorType.UnauthorizedGoogle:
        throw new RequestError(error, HttpStatus.Unauthorized)
      case ErrorType.NotFound:
        throw new RequestError(error, HttpStatus.NotFound)
      default:
        throw RequestError._500()
    }
  }
  throw RequestError._500()
}
