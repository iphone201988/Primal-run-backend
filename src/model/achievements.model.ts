import { Schema, model } from "mongoose";
import { AchievementsModel } from "../../types/Database/types";

const achievementSchema = new Schema<AchievementsModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    badgeId: { type: Schema.Types.ObjectId, ref: "Badge" },
    score: { type: Number },
  },
  { timestamps: true }
);

const Achievements = model("achievements", achievementSchema);
export default Achievements;
