import { wrapResponse } from "./../../server/utils/response"
import { Response, Express } from "express"

export function JSONMiddleware(app) {
  app.use((_, res, next) => {
    res.JSON = (statusCode, data) => {
      res.status(statusCode).json(wrapResponse(data, statusCode))
    }
    next()
  })
}
