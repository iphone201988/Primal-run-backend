import { Schema, model } from "mongoose";
import { BadgeModel } from "../../types/Database/types";
import { badgeType } from "../utils/enum";

const badgeSchema = new Schema<BadgeModel>(
  {
    badgeImage: { type: String },
    badgeType: { type: Number, enum: [...Object.values(badgeType)] },
  },
  { timestamps: true }
);

const Badge = model("Badge", badgeSchema);
export default Badge;
