import ReviewModel from "@/database/models/review"
import { AppError } from "../errors"
import * as Helper from "./helper"
import ProductModel from "@/database/models/product"

export async function listReviews(productId) {
  try {
    const reviews = await ReviewModel.find({ product: productId }).populate(
      "user"
    )
    if (!reviews)
      throw AppError.notFound("Product with id " + productId + " not found.")
    return { result: Helper._formatReviewList(reviews), error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function userRateOnProduct(userId, productId) {
  try {
    const review = await ReviewModel.findOne({
      $and: [{ user: userId }, { product: productId }]
    }).populate("user")
    if (!review) throw AppError.notFound("Rate not found.")
    const result = Helper._formatReview(review)
    return { result, error: null }
  } catch (error) {
    return { error, result: null }
  }
}

export async function addReviewToProduct(reviewData) {
  try {
    const product = await ProductModel.findById(reviewData.productId)
    if (!product) {
      throw AppError.notFound(
        "Product with Id " + reviewData.productId + " not found."
      )
    }
    let review = await ReviewModel.findOne({
      $and: [{ user: reviewData.userId }, { product: reviewData.productId }]
    })
    if (review) {
      review.rate = reviewData.rate
      review.comment = reviewData.comment
      review.updatedAt = new Date()
    } else {
      review = new ReviewModel({
        user: reviewData.userId,
        product: reviewData.productId,
        rate: reviewData.rate,
        comment: reviewData.comment
      })
    }
    await review.save()
    await review.populate("user")
    const productReviews = await ReviewModel.find({
      product: reviewData.productId
    })
    const rate = Helper._calculateProductRate(productReviews)

    await ProductModel.findByIdAndUpdate(
      reviewData.productId,
      { $set: { rate: rate } },
      { new: true }
    )
    const userReview = Helper._formatReview(review)
    return { result: userReview, error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function removeReview(reviewId, userId) {
  try {
    const review = await ReviewModel.findById(reviewId)
    if (!review) {
      throw AppError.notFound("Review with id " + reviewId + " not found.")
    }

    const productId = review.product
    const product = await ProductModel.findById(productId)

    if (!product) {
      throw AppError.notFound("Product with id " + productId + " not found.")
    }

    await ProductModel.findByIdAndUpdate(productId, {
      $pull: { reviews: reviewId }
    })

    await ReviewModel.findOneAndRemove({ _id: reviewId, user: userId })

    const remainingReviews = await ReviewModel.find({ product: productId })
    const rate = Helper._calculateProductRate(remainingReviews)

    await ProductModel.findByIdAndUpdate(productId, { $set: { rate: rate } })
    return null
  } catch (err) {
    return err
  }
}
