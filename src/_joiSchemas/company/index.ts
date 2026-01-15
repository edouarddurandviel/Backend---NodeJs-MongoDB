import Joi from "joi";

export const textSchema = Joi.string().required();
export const idSchema = Joi.number().required();

export const fullCompany = Joi.object({
  name: textSchema,
  ref: textSchema,
  isoCode: textSchema
});

export const company = Joi.object({
  name: Joi.string(),
  ref: Joi.string(),
  isoCode: Joi.string()
});
