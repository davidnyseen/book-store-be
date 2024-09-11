import Joi from 'joi';

export const orderSchema = Joi.object({
  collectionId: Joi.string(),
});
