import Joi from "joi"

const passwordValidate = Joi.string()
  .trim()
  .min(8)
  .max(30)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*-_])"))
  .required()

const confirmPasswordValidate = Joi.string()
  .valid(Joi.ref("password"))
  .required()

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: passwordValidate
})
  .label("body")
  .required()

export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(55)
    .required(),
  phone: Joi.string(),
  password: passwordValidate,
  confirmPassword: confirmPasswordValidate
})

export const changePasswordSchema = Joi.object({
  oldPassword: passwordValidate,
  password: passwordValidate,
  confirmNewPassword: confirmPasswordValidate
})

export const emailSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
})

export const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  newPassword: passwordValidate,
  otp: Joi.string()
    .length(6)
    .required()
})

export const verifyOTPSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  otp: Joi.string()
    .length(6)
    .required()
})
