import ProductModel from "@/database/models/product"
import { AppError } from "../errors"
import UserModel from "@/database/models/user"

export class Favorites {
  constructor(userId) {
    this.userId = userId
  }

  async add(productId, populate) {
    try {
      const product = await ProductModel.findById(productId)
      if (!product)
        return {
          error: AppError.notFound(
            "Product with id " + productId + " not found"
          ),
          result: null
        }
      let user = await UserModel.findByIdAndUpdate(
        this.userId,
        {
          $addToSet: { favorites: product._id }
        },
        { new: true }
      )
      if (!user) throw AppError.unauthorized()
      if (!populate) {
        return { result: user.favorites, error: null }
      }
      await user.populate("favorites")
      const result = this._format(user.favorites)
      return { result: result, error: null }
    } catch (err) {
      return { error: err, result: null }
    }
  }

  async remove(id) {
    try {
      await UserModel.findByIdAndUpdate(this.userId, {
        $pull: { favorites: id }
      })
      return null
    } catch (err) {
      return err
    }
  }

  async getAll(populate) {
    try {
      const user = await UserModel.findById(this.userId).exec()
      if (!user) throw AppError.unauthorized()
      if (!populate) {
        return { result: user.favorites, error: null }
      }
      await user.populate("favorites")
      const result = this._format(user.favorites)
      return { result: result, error: null }
    } catch (err) {
      return { error: err, result: null }
    }
  }

  _format(favorites) {
    return favorites.map(f => ({
      id: f._id,
      title: f.title,
      price: f.price,
      imageUrl: f.imagesURL[0]
    }))
  }
}
