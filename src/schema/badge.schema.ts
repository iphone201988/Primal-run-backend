import Joi from "joi";
import { badgeType } from "../utils/enum";

const addBadgeSchema = {
  body: Joi.object({
    badgeType: Joi.number()
      .valid(...Object.values(badgeType))
      .required()
      .messages({
        "number.base": "Badge type must be a number.",
        "any.required": "Badge type is a mandatory field.",
        "any.only": "Badge type for Result status.",
      }),
  }),
};

export default {
  addBadgeSchema,
};
