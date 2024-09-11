import Joi from 'joi';

export const reviewSchema = Joi.object({
  rate: Joi.number().required().min(1).max(5),
  comment: Joi.string().max(500),
});
