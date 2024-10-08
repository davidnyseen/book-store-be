import RequestError from "../../server/utils/errors"
import { codeToString } from "./../../server/utils/status"

function errorMiddleware(app) {
  const errorHandler = async (err, _, res, __) => {
    let code = err.code
    if (!err.code || !(err instanceof RequestError)) {
      code = 500
    }
    const responseError = {
      status: "error",
      message: codeToString(code),
      error: {
        code: code,
        message: err.message
      }
    }
    res.status(code).json(responseError)
  }
  app.use(errorHandler)
}

export default errorMiddleware
