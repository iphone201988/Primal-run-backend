import Joi from "joi";
import {
  deviceTypeEnums,
  genderEnums,
  measurementUnitEnums,
  socialTypeEnums,
} from "../utils/enum";

const socialLoginSchema = {
  body: Joi.object({
    socialId: Joi.string().required().messages({
      "string.empty": "Social ID is required.",
      "any.required": "Social ID is a mandatory field.",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Email must be a valid email address.",
      "string.empty": "Email is required.",
      "any.required": "Email is a mandatory field.",
    }),
    name: Joi.string().required().messages({
      "string.empty": "Name is required.",
      "any.required": "Name is a mandatory field.",
    }),
    // gender: Joi.number()
    //   .valid(...Object.values(genderEnums))
    //   .required()
    //   .messages({
    //     "any.only": "Invalid value for Gender.",
    //     "string.empty": "Gender is required.",
    //     "any.required": "Gender is a mandatory field.",
    //   }),
    lat: Joi.number().optional().messages({
      "number.base": "Latitude must be a number.",
    }),
    lng: Joi.number().optional().messages({
      "number.base": "Longitude must be a number.",
    }),
    dob: Joi.date().required().messages({
      "date.base": "Date of birth must be a valid date.",
      "any.required": "Date of birth is a mandatory field.",
    }),
    socialType: Joi.string()
      .required()
      .valid(...Object.values(socialTypeEnums))
      .messages({
        "any.only": "Social type must be one of facebook, google, or apple.",
        "string.empty": "Social type must not be empty.",
        "any.required": "Social type is a mandatory field.",
      }),
    deviceToken: Joi.string().required().messages({
      "string.empty": "Device token is required.",
      "any.required": "Device token is a mandatory field.",
    }),
    deviceType: Joi.string()
      .required()
      .valid(...Object.values(deviceTypeEnums))
      .messages({
        "any.only": "Device type must be one of android or ios.",
        "string.empty": "Device type must not be empty.",
        "any.required": "Device type is a mandatory field.",
      }),
  }),
};

const updateProfileSchema = {
  body: Joi.object({
    name: Joi.string().optional().messages({
      "string.empty": "Name is required.",
    }),
    gender: Joi.number()
      .valid(...Object.values(genderEnums))
      .optional()
      .messages({
        "any.only": "Invalid value for Gender.",
        "string.empty": "Gender is required.",
      }),
    lat: Joi.number().optional().messages({
      "number.base": "Latitude must be a number.",
    }),
    lng: Joi.number().optional().messages({
      "number.base": "Longitude must be a number.",
    }),
    dob: Joi.date().optional().messages({
      "date.base": "Date of birth must be a valid date.",
    }),
    unitOfMeasure: Joi.number()
      .optional()
      .valid(...Object.values(measurementUnitEnums))
      .messages({
        "number.base": "Latitude must be a number.",
      }),
  }),
};

export default {
  socialLoginSchema,
  updateProfileSchema,
};
