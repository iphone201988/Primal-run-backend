import { Schema, model } from "mongoose";
import { gameTypeEnums, genderEnums } from "../utils/enum";
import { PlanStageModel } from "../../types/Database/types";

const planStagesSchema = new Schema<PlanStageModel>(
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
    isPremium: { type: Boolean, default: true },
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

const PlanStage = model("PlanStages", planStagesSchema);
export default PlanStage;
