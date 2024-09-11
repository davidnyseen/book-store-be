import { AppError } from "../errors"
import UserModel from "@/database/models/user"

export class OrderPayment {
  constructor(userId) {
    this.userId = userId
  }

  async getUserWithAddress() {
    const user = await UserModel.findById(this.userId).populate("address")
    if (!user) {
      throw AppError.unauthorized()
    }
    if (!user.phoneNumber) {
      throw AppError.invalid(
        "The phone number is required in the user data before order request. Ensure that user has address and try your request again."
      )
    }
    if (!user.address)
      throw AppError.invalid(
        "The address is required in the user data before order request. Ensure that user has address and try your request again."
      )
    return user
  }
}
