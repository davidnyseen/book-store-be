import express from "express"
import { join } from "node:path"

export function staticFileMiddleware(app) {
  app.use(
    "/api/u",
    express.static(join(__dirname, "..", "..", "..", "uploads"))
  )
}
