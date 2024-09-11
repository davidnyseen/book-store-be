import router from "./company.router"

const initBrand = app => {
  app.use("/company", router)
}

export default initBrand
