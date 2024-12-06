import Joi from "joi";
import { gameTypeEnums, genderEnums } from "../utils/enum";

const addStageSchema = {
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
    title: Joi.string().required().messages({
      "string.empty": "Title is required.",
      "any.required": "Title is a mandatory field.",
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description is required.",
      "any.required": "Description is a mandatory field.",
    }),
    distance: Joi.number().required().messages({
      "number.base": "Distance must be a number.",
      "any.required": "Distance is a mandatory field.",
    }),
    duration: Joi.number().required().messages({
      "number.base": "Duration must be a number.",
      "any.required": "Duration is a mandatory field.",
    }),
    speed: Joi.number().required().messages({
      "number.base": "Speed must be a number.",
      "any.required": "Speed is a mandatory field.",
    }),
    gender: Joi.number()
      .valid(...Object.values(genderEnums))
      .required()
      .messages({
        "number.base": "Gender must be a number.",
        "any.required": "Gender is a mandatory field.",
        "any.only": "Invalid value for Gender.",
      }),
    type: Joi.number()
      .valid(...Object.values(gameTypeEnums))
      .required()
      .messages({
        "number.base": "Stage type must be a number.",
        "any.required": "Stage type is a mandatory field.",
        "any.only": "Invalid value for Stage type.",
      }),
    isSprint: Joi.boolean().required().messages({
      "boolean.base": "Sprint must be a boolean value.",
      "any.required": "Sprint is a mandatory field.",
    }),
    sprintCount: Joi.number()
      .when("isSprint", {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        "number.base": "Sprint Count must be a number.",
        "any.required":
          "Sprint Count is a mandatory field when Sprint is true.",
      }),
    sprintDistanceInMeter: Joi.number()
      .when("isSprint", {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        "number.base": "Sprint Distance must be a number.",
        "any.required":
          "Sprint Distance is a mandatory field when Sprint is true.",
      }),

    isPremium: Joi.boolean().required().messages({
      "boolean.base": "Premium must be a boolean value.",
      "any.required": "Premium is a mandatory field.",
    }),
  }),
};

const getStageByIdSchema = {
  params: Joi.object({
    stageId: Joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.base": `Stage Id should be a type of text`,
        "string.empty": `Stage Id cannot be empty`,
        "string.pattern.base": `Stage Id must be a valid ObjectId`,
        "any.required": `Stage Id is required.`,
      }),
  }),
};

export default {
  addStageSchema,
  getStageByIdSchema,
};
