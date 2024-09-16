import UserModel from "@/database/models/user"
import { AppError, ErrorType } from "../errors"
import { Cart } from "./cart"
import { addAddress, getUserAddress, removeAddress } from "../address"
import { join } from "node:path"
import Config from "@/config"
import bcrypt from "bcrypt"
import { removeFile } from "../utils"

export class User {
  constructor(_id) {
    this._id = _id
  }
  async getMyCart() {
    try {
      const user = await UserModel.findById(this._id)
        .populate("cart")
        .exec()
      if (!user) throw AppError.unauthorized()
      let cart = user.cart
      if (!cart) {
        cart = await Cart.createCart()
        user.cart = cart._id
        await user.save()
      }
      return { result: new Cart(cart), error: null }
    } catch (err) {
      return { error: err, result: null }
    }
  }

  async me() {
    try {
      const user = await UserModel.findById(this._id)
      if (!user) throw AppError.unauthorized()
      const result = _formatUser(user)
      return { result, error: null }
    } catch (err) {
      return { error: err, result: null }
    }
  }

  async editMe(data) {
    try {
      const user = await UserModel.findByIdAndUpdate(this._id, data, {
        new: true
      })
      if (!user) throw AppError.unauthorized()
      return { result: _formatUser(user), error: null }
    } catch (error) {
      return { error, result: null }
    }
  }

  async updateProfileImage(path) {
    try {
      const user = await UserModel.findByIdAndUpdate(this._id, {
        $set: { profileImage: path }
      })
      if (!user) throw AppError.unauthorized()
      await removeFile(join(Config.ProfileImagesDir + user.profileImage))
      return { error: null, result: { path: path } }
    } catch (err) {
      return { error: err, result: null }
    }
  }

  async changePassword(data) {
    try {
      const user = await UserModel.findById(this._id)
        .select("+password")
        .exec()
      if (!user) {
        throw AppError.unauthorized()
      }

      const validPass = await bcrypt.compare(data.oldPassword, user?.password)
      if (!validPass) {
        throw new AppError(
          ErrorType.InvalidData,
          "The provided old password is not valid."
        )
      }

      const hashedPassword = await bcrypt.hash(data.newPassword, 12)
      user.password = hashedPassword
      await user.save()
      return null
    } catch (error) {
      return error
    }
  }

  async getAddress() {
    return getUserAddress(this._id)
  }

  async addNewAddress(addressData) {
    return addAddress(this._id, addressData)
  }

  async removeAddress(addressId) {
    return await removeAddress(this._id, addressId)
  }
  async addDevice(devId) {
    try {
      const user = await UserModel.findByIdAndUpdate(this._id, {
        $addToSet: { devices: devId }
      })
      if (!user) throw AppError.unauthorized()
      return null
    } catch (err) {
      return err
    }
  }
  async removeDevice(devId) {
    try {
      let u
      if (devId === "all") {
        u = { $unset: { devices: [] } }
      } else {
        u = { $pull: { devices: devId } }
      }
      const user = await UserModel.findByIdAndUpdate(this._id, u)
      if (!user) throw AppError.unauthorized()
      return null
    } catch (err) {
      return err
    }
  }
}

function _formatUser(user) {
  return {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    isVerified: user.isVerified,
    provider: user.provider,
    settings: user.settings,
    profile: user.profileImage,
    address: user.address,
    phoneNumber: user.phoneNumber
  }
}
