import { Schema, model } from "mongoose";
import { PlanModel } from "../../types/Database/types";

const planSchema = new Schema<PlanModel>(
  {
    title: { type: String },
    description: { type: String },
    distancePlan: { type: Number },
    image: { type: String },
    footStepsSounds: [{ type: String }],
    roarSounds: [{ type: String }],
    breathingSounds: [{ type: String }],
    attackSounds: [{ type: String }],
    easyStagesForMale: [{ type: Schema.Types.ObjectId, ref: "PlanStages" }],
    normalStagesForMale: [{ type: Schema.Types.ObjectId, ref: "PlanStages" }],
    hardStagesForMale: [{ type: Schema.Types.ObjectId, ref: "PlanStages" }],
    easyStagesForFemale: [{ type: Schema.Types.ObjectId, ref: "PlanStages" }],
    normalStagesForFemale: [{ type: Schema.Types.ObjectId, ref: "PlanStages" }],
    hardStagesForFemale: [{ type: Schema.Types.ObjectId, ref: "PlanStages" }],
    isPremium: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Plans = model("Plans", planSchema);
export default Plans;