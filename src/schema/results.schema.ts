import Joi from "joi";
import { resultStatus, resultType } from "../utils/enum";

const saveResultsSchema = {
  body: Joi.object({
    planId: Joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.base": `Plan Id should be a type of text`,
        "string.empty": `Plan Id cannot be empty`,
        "string.pattern.base": `Plan Id must be a valid ObjectId`,
        "any.required": `Plan Id is required.`,
      }),
    stageId: Joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.base": `Stage Id should be a type of text`,
        "string.empty": `Stage Id cannot be empty`,
        "string.pattern.base": `Stage Id must be a valid ObjectId`,
        "any.required": `Stage Id is required.`,
      }),
    distance: Joi.number().required().messages({
      "number.base": "Distance must be a number.",
      "any.required": "Distance is a mandatory field.",
    }),
    duration: Joi.number().required().messages({
      "number.base": "Duration must be a number.",
      "any.required": "Duration is a mandatory field.",
    }),
    averageSpeed: Joi.number().required().messages({
      "number.base": "Speed must be a number.",
      "any.required": "Speed is a mandatory field.",
    }),
    score: Joi.number().required().messages({
      "number.base": "Score must be a number.",
      "any.required": "Score is a mandatory field.",
    }),
    resultType: Joi.number()
      .valid(...Object.values(resultType))
      .required()
      .messages({
        "number.base": "Result type must be a number.",
        "any.required": "Result type is a mandatory field.",
        "any.only": "Invalid value for Result type.",
      }),
    badgeId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .when("resultType", {
        is: resultType.FREE_RUN,
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        "string.base": `Badge Id should be a type of text.`,
        "string.empty": `Badge Id cannot be empty.`,
        "string.pattern.base": `Badge Id must be a valid ObjectId.`,
        "any.required": `Badge Id is required when resultType is 2.`,
      }),
    resultStatus: Joi.number()
      .valid(...Object.values(resultStatus))
      .required()
      .messages({
        "number.base": "Result status must be a number.",
        "any.required": "Result status is a mandatory field.",
        "any.only": "Invalid value for Result status.",
      }),
  }),
};

export default {
  saveResultsSchema,
};
