import Joi from "joi"

export const itemCartSchema = Joi.object({
  id: Joi.string().required(),
  size: Joi.string(),
  color: Joi.string(),
  quantity: Joi.number()
    .min(1)
    .required()
})

export const editUserSchema = Joi.object({
  email: Joi.string().email(),
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(55),
  phoneNumber: Joi.string()
})

export const editItemCartSchema = Joi.object({
  id: Joi.string().required(),
  quantity: Joi.number()
    .min(1)
    .required()
})

export const addressSchema = Joi.object({
  isPrimary: Joi.boolean().default(false),
  latitude: Joi.number()
    .min(-90)
    .max(90)
    .required(),
  longitude: Joi.number()
    .min(-180)
    .max(180)
    .required()
})
