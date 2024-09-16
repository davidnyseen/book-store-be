import mongoose, { Schema } from "mongoose"

const paymentSchema = new Schema(
  {
    method: {
      type: String,
      enum: ["VISA", "MASTERCARD"],
      required: true
    },
    cardName: String,
    cardNumber: String,
    exMonth: Number,
    exYear: Number,
    cvv: Number,
    provider: String
  },
  {
    timestamps: true
  }
)

const PaymentModel = mongoose.model("Payment", paymentSchema)
export default PaymentModel
