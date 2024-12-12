import Joi from "joi";
import { planCategoryEnums } from "../utils/enum";

const addPlanSchema = {
  body: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title is required.",
      "any.required": "Title is a mandatory field.",
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description is required.",
      "any.required": "Description is a mandatory field.",
    }),
    distancePlan: Joi.number().required().messages({
      "number.base": "Distance Plan must be a number.",
      "any.required": "Distance Plan is a mandatory field.",
    }),
    isPremium: Joi.boolean().required().messages({
      "boolean.base": "Premium must be a boolean value.",
      "any.required": "Premium is a mandatory field.",
    }),
    categoryType: Joi.number()
      .valid(...Object.values(planCategoryEnums))
      .required()
      .messages({
        "number.base": "Category Type must be a number.",
        "any.required": "Category Type is a mandatory field.",
        "any.only": "Invalid value for Category Type.",
      }),
    to: Joi.number().required().messages({
      "number.base": "Category Distance must be a number.",
      "any.required": "Category Distance is a mandatory field.",
    }),
    from: Joi.number().required().messages({
      "number.base": "Category Distance must be a number.",
      "any.required": "Category Distance is a mandatory field.",
    }),
  }),
};

const getPlanByIdSchema = {
  params: Joi.object({
    planId: Joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.base": `Plan Id should be a type of text`,
        "string.empty": `Plan Id cannot be empty`,
        "string.pattern.base": `Plan Id must be a valid ObjectId`,
        "any.required": `Plan Id is required.`,
      }),
  }),
};

export default {
  addPlanSchema,
  getPlanByIdSchema,
};
