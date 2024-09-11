export function securityHeader(app) {
  app.disable("x-powered-by")
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff")
    res.setHeader("Referrer-Policy", "no-referrer")
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=2592000; includeSubDomains"
    )
    next()
  })
}
