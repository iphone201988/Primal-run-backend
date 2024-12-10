import { Schema, model } from "mongoose";
import { resultStatus, resultType } from "../utils/enum";
import { ResultsModel } from "../../types/Database/types";

const resultsSchema = new Schema<ResultsModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    planId: { type: Schema.Types.ObjectId, ref: "Plans" },
    stageId: { type: Schema.Types.ObjectId, ref: "PlanStages" },
    videoLink: { type: String },
    distance: { type: Number },
    duration: { type: Number },
    averageSpeed: { type: Number },
    score: { type: Number },
    resultStatus: {
      type: Number,
      enum: [resultStatus.COMPLETED, resultStatus.FAILED],
    },
    resultType: {
      type: Number,
      enum: [resultType.STAGED, resultType.FREE_RUN],
      default: resultType.STAGED,
    },
  },
  { timestamps: true }
);

const Results = model("Results", resultsSchema);
export default Results;
