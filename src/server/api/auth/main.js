import router from "./auth.router"

const initAuth = app => {
  app.use("/auth", router)
}

export default initAuth
