import { Schema, model } from "mongoose";
import { gameTypeEnums, genderEnums } from "../utils/enum";
import { StageModel } from "../../types/Database/types";

const stagesSchema = new Schema<StageModel>(
  {
    planId: { type: Schema.Types.ObjectId, ref: "Plans" },
    title: { type: String },
    description: { type: String },
    image: { type: String },
    distance: { type: Number },
    duration: { type: Number },
    speed: { type: Number },
    isSprint: { type: Boolean },
    sprintCount: { type: Number },
    sprintDistanceInMeter: { type: Number },
    level: { type: Number },
    isPremium: { type: Boolean, default: true },
    unlockedByDefault: { type: Boolean, default: false },
    type: {
      type: Number,
      enum: [gameTypeEnums.EASY, gameTypeEnums.NORMAL, gameTypeEnums.HARD],
    },
    gender: {
      type: Number,
      enum: [genderEnums.MALE, genderEnums.FEMALE],
    },
  },
  { timestamps: true }
);

const Stage = model("PlanStages", stagesSchema);
export default Stage;
