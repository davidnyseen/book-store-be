import Config from "@/config"
import nodemailer from "nodemailer"

class EmailServices {
  constructor(senderName, email, pass) {
    this.senderName = senderName
    this.email = email
    this.transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: this.email,
        pass: pass
      }
    })
  }
  async sendMail(content) {
    await this.transporter.sendMail({
      from: `"${this.senderName}" ${this.email}`,
      ...content
    })
  }
  async sendOTPEmail(otp, user) {
    try {
      await this.sendMail({
        to: user.email,
        subject: "OTP Verification",
        html: `<p>Hello ${user.fullName},</p><p>Here is the verification code. Please copy it and verify yor Email.</p><div style="text-align: center; background-color: #e2ebff; font-weight: bold; padding: 20px;">code: ${otp}</div>`
      })
      return true
    } catch {
      return false
    }
  }
  async sendOTPPassword(otp, user) {
    try {
      await this.sendMail({
        to: user.email,
        subject: "OTP Verification",
        html: `<p>Hello ${user.fullName},</p><p>Here is the verification code. Please copy to reset your password.</p><div style="text-align: center; background-color: #e2ebff; font-weight: bold; padding: 20px;">code: ${otp}</div>`
      })
      return true
    } catch {
      return false
    }
  }
}

export default new EmailServices(
  "David",
  Config.EMAIL_SENDER,
  Config.EMAIL_SENDER_PASSWORD
)
