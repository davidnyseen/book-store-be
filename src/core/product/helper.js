import ProductModel from "@/database/models/product"
import { AppError } from "../errors"

export async function _getProduct(id) {
  const product = await ProductModel.findById(id)
  if (!product) throw AppError.notFound("Product with id " + id + " not found.")
  return product
}

export function _formatProduct(prod) {
  return {
    id: prod._id.toString(),
    title: prod.title,
    description: prod.description,
    price: prod.price - (prod.discount || 0 * prod.price),
    available: prod.available,
    company: prod.brandName || "",
    discount: prod.discount || 0,
    imagesUrl: prod.imagesURL,
    isNew: prod.is_new,
    oldPrice: prod.price,
    rate: prod.rate || 0,
    colors: prod.colors || [],
    sizes: prod.sizes || [],
    gender: prod.gender,
    stock: prod.stock || 0
  }
}

export function _formatItemProductList(prod) {
  return {
    id: prod._id.toString(),
    title: prod.title,
    price: prod.price - (prod.discount || 0 * prod.price),
    discount: prod.discount || 0,
    imageUrl: prod.imagesURL[0],
    oldPrice: prod.price
  }
}

export function _sortProduct(q, options) {
  if (!options) return
  if (options.price) q.sort({ price: options.price })
  if (options.newness) q.sort({ createdAt: options.newness })
  if (options.popularity) q.sort({ rate: options.popularity })
}

export function _filterProduct(options) {
  const filter = {}
  if (!options) return filter
  if (options.maxPrice) filter.price = { $lte: options.maxPrice }
  if (options.minPrice)
    filter.price = { ...filter.price, $gte: options.minPrice }
  if (options.category && options.category.length > 0) {
    filter.category = { $in: options.category }
  }
  if (options.gender) filter.gender = options.gender
  if (options.search) {
    filter.$or = [{ title: { $regex: options.search, $options: "i" } }]
  }
  if (options.brands && options.brands.length > 0) {
    filter.company = { $in: options.brands }
  }
  if (options.discount) {
    filter.discount = { $gte: 1 }
  }
  return filter
}

export function _calculateProductRate(reviews) {
  if (reviews.length === 0) return 0
  return (
    reviews.reduce((total, review) => total + review.rate, 0) / reviews.length
  )
}

export function _formatReviewList(reviews) {
  const rateCount = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    total: reviews.length
  }
  const reviewsResponse = []
  reviews.forEach(r => {
    rateCount[Math.floor(r.rate)] += 1
    const user = r.user._id
      ? {
          id: r.user._id.toString(),
          fullName: r.user.fullName,
          profileImage: r.user.profileImage
        }
      : { id: "0", fullName: "Deleted User" }
    reviewsResponse.push({
      id: r._id,
      rate: r.rate,
      comment: r.comment || "",
      user: user,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    })
  })
  return {
    average: _calculateProductRate(reviews),
    rateCount,
    reviews: reviewsResponse
  }
}

export function _formatReview(r) {
  const user = r.user._id
    ? {
        id: r.user._id.toString(),
        fullName: r.user.fullName,
        profileImage: r.user.profileImage
      }
    : { id: "0", fullName: "Deleted User" }
  return {
    id: r._id,
    rate: r.rate,
    comment: r.comment || "",
    user: user,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt
  }
}
