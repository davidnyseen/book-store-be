import * as ProductServices from "@/core/product"
import { validateId } from "@/core/utils"
import { Controller, Validate } from "@server/decorator"
import RequestError, {
  handleResultError,
  unwrapResult
} from "@server/utils/errors"
import { HttpStatus } from "@server/utils/status"
import { reviewSchema } from "./product.valid"

function queryToNumber(q) {
  if (!q) return null
  const num = Number(q)
  if (isNaN(num)) return null
  return num
}
function queryToListId(q) {
  if (!q) return null
  const list = q.split(",")
  const listId = []
  for (const b of list) {
    validateId(b) && listId.push(b)
  }
  return listId
}

function queryToSort(q) {
  if (!q) return null
  q = q.toString().toLowerCase()
  if (q === "asc" || q === "1") {
    return 1
  } else if (q === "desc" || q === "-1") {
    return -1
  } else {
    return null
  }
}

@Controller()
class ProductController {
  async getList(req, res) {
    const limit = req.query["limit"] ? Number(req.query["limit"]) : 20
    const page = req.query["page"] ? Number(req.query["page"]) : 1
    const options = {
      limit,
      page,
      filter: {},
      sort: {}
    }
    const _maxPrice = queryToNumber(req.query["max-price"])
    if (_maxPrice) options.filter.maxPrice = _maxPrice
    const _minPrice = queryToNumber(req.query["min-price"])
    if (_minPrice) options.filter.minPrice = _minPrice
    const _gender = queryToNumber(req.query["gender"])
    if (_gender) options.filter.gender = _gender
    const _categories = queryToListId(req.query["categories"])
    if (_categories && _categories.length > 0)
      options.filter.category = _categories
    const _brands = queryToListId(req.query["brands"])
    if (_brands && _brands.length > 0) options.filter.brands = _brands
    options.filter.discount =
      req.query["discount"]?.toString().toLowerCase() === "true" ? true : false
    const _search = req.query["search"]
    if (_search) options.filter.search = _search

    const _sortWithPrice = queryToSort(req.query["sort-price"])
    if (_sortWithPrice) options.sort.price = _sortWithPrice
    const _sortWithNew = queryToSort(req.query["sort-new"])
    if (_sortWithNew) options.sort.newness = _sortWithNew
    const _sortWithRate = queryToSort(req.query["sort-popularity"])
    if (_sortWithRate) options.sort.popularity = _sortWithRate

    const products = await ProductServices.getProductsList(options)
    unwrapResult(products)
    res.JSON(HttpStatus.Ok, products.result)
  }

  async getOne(req, res) {
    const productId = req.params.id
    const product = await ProductServices.getProductForUser(productId)
    unwrapResult(product)
    res.JSON(HttpStatus.Ok, product.result)
  }

  async listInfo(_, res) {
    const info = await ProductServices.productsInfo()
    unwrapResult(info)
    res.JSON(HttpStatus.Ok, info.result)
  }

  @Validate(reviewSchema)
  async addReview(req, res) {
    const productId = req.params.id
    if (!validateId(productId))
      throw new RequestError("invalid product id", HttpStatus.BadRequest)
    const body = req.body
    const reviewData = {
      userId: req.userId,
      productId: productId,
      rate: body.rate,
      comment: body.comment
    }
    const review = await ProductServices.addReviewToProduct(reviewData)
    unwrapResult(review)
    res.JSON(HttpStatus.Created, review.result)
  }

  async removeReview(req, res) {
    const reviewId = req.params["id"]
    if (!validateId(reviewId))
      throw new RequestError("invalid review id", HttpStatus.BadRequest)
    const error = await ProductServices.removeReview(reviewId, req.userId)
    // if (error) {
    //   if (error instanceof NotFoundError) {
    //     throw new RequestError(error.message, HttpStatus.BadRequest);
    //   }
    //   throw RequestError._500();
    // }
    if (error) {
      handleResultError(error)
    }
    res.JSON(HttpStatus.Ok)
  }

  async listReviews(req, res) {
    const productId = req.params.id
    if (!validateId(productId))
      throw new RequestError("invalid product id", HttpStatus.BadRequest)
    const reviews = await ProductServices.listReviews(productId)
    // if (reviews.error) {
    //   if (reviews.error instanceof NotFoundError) {
    //     throw new RequestError(reviews.error.message, HttpStatus.NotFound);
    //   }
    //   throw RequestError._500();
    // }
    unwrapResult(reviews)
    res.JSON(HttpStatus.Ok, reviews.result)
  }

  async myRate(req, res) {
    const productId = req.params.id
    if (!validateId(productId))
      throw new RequestError("invalid product id", HttpStatus.BadRequest)
    const review = await ProductServices.userRateOnProduct(
      req.userId,
      productId
    )
    unwrapResult(review)
    res.JSON(HttpStatus.Ok, review.result)
  }
}

export default new ProductController()
