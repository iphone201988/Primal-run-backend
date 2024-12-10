import { Schema, model } from "mongoose";
import { UserProgressModel } from "../../types/Database/types";

const userProgressSchema = new Schema<UserProgressModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plans", required: true },
    unlockedStages: {
      easyStagesForMale: [{ type: Schema.Types.ObjectId, ref: "PlanStages" }],
      normalStagesForMale: [{ type: Schema.Types.ObjectId, ref: "PlanStages" }],
      hardStagesForMale: [{ type: Schema.Types.ObjectId, ref: "PlanStages" }],
      easyStagesForFemale: [{ type: Schema.Types.ObjectId, ref: "PlanStages" }],
      normalStagesForFemale: [
        { type: Schema.Types.ObjectId, ref: "PlanStages" },
      ],
      hardStagesForFemale: [{ type: Schema.Types.ObjectId, ref: "PlanStages" }],
    },
  },
  { timestamps: true }
);

const UserProgress = model("UserProgress", userProgressSchema);
export default UserProgress;
