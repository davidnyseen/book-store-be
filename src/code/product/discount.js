import ProductModel from "@/database/models/product"
import { AppError } from "../errors"
import { _formatProduct } from "./helper"

export async function addDiscount(productId, discount) {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      {
        $set: {
          discount: discount
        }
      },
      { new: true }
    )
    if (!product)
      throw AppError.invalid("Product with id " + productId + " not found.")
    return { result: _formatProduct(product), error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function removeDiscount(productId) {
  try {
    const product = await ProductModel.findByIdAndUpdate(productId, {
      $unset: { discount: 0 }
    })
    if (!product)
      throw AppError.invalid("Product with id " + productId + " not found.")
    return null
  } catch (err) {
    return err
  }
}
