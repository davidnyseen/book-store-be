import { getAllCategories, getCategoryForUser } from "@/core/category"
import { stringToGender } from "@/core/gender"
import { Controller } from "@server/decorator"
import { unwrapResult } from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"

@Controller()
class CategoryController {
  async getOne(req, res) {
    const { id } = req.params
    const category = await getCategoryForUser(id)
    unwrapResult(category)
    res.JSON(HttpStatus.Ok, category.result)
  }

  async getList(req, res) {
    const genderQ = req.query["gender"]?.toString()
    let gender = stringToGender(genderQ)

    const category = await getAllCategories(gender)
    unwrapResult(category)
    res.JSON(HttpStatus.Ok, category.result)
  }
}

export default new CategoryController()
