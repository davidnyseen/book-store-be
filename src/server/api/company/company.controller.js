import { getAllBrands } from "@/core/company"
import { Controller } from "@server/decorator"
import { unwrapResult } from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"

@Controller()
class CategoryController {
  async getList(_req, res) {
    const category = await getAllBrands()
    const result = unwrapResult(category)
    res.JSON(HttpStatus.Ok, result)
  }
}

export default new CategoryController()
