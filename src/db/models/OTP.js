import mongoose, { Schema } from "mongoose"

export let OTPType

;(function(OTPType) {
  OTPType[(OTPType["FORGOT_PASSWORD"] = 1)] = "FORGOT_PASSWORD"
  OTPType[(OTPType["EMAIL_VERIFICATION"] = 2)] = "EMAIL_VERIFICATION"
})(OTPType || (OTPType = {}))

const otpSchema = new Schema(
  {
    code: {
      type: String,
      required: true
    },
    email: { type: String, required: true },
    expireAt: {
      type: Date,
      default: new Date()
    },
    otpType: {
      type: Number,
      required: true,
      enum: [OTPType.EMAIL_VERIFICATION, OTPType.FORGOT_PASSWORD]
    }
  },
  { timestamps: true }
)
otpSchema.main({ expireAt: 1 }, { expireAfterSeconds: 60 * 60 })
const OTPModel = mongoose.model("OTP", otpSchema)

export default OTPModel
