import { Schema, model } from "mongoose";

const achievementSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    badgeId: { type: Schema.Types.ObjectId, ref: "Badge" },
    score: { type: Number },
  },
  { timestamps: true }
);

const Achievements = model("achievements", achievementSchema);
export default Achievements;
