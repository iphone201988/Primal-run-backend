import { PlanModel } from "../../types/Database/types";
import Plans from "../model/plan.model";
import Results from "../model/results.model";
import ErrorHandler from "../utils/ErrorHandler";

export const getPlanById = async (planId: string): Promise<PlanModel> => {
  const plan = await Plans.findById(planId);

  if (!plan) throw new ErrorHandler("Plan not found", 400);

  return plan;
};

export const unlockStages = async (stages: any, unlockedStages: any) => {
  // return stages.map((stage: any) => ({
  //   ...stage,
  //   isUnlocked: unlockedStages.some(
  //     (unlockedStageId: string) =>
  //       stage._id.toString() == unlockedStageId.toString()
  //   ),
  // }));

  for (const stage of stages) {
    const isUnlocked = unlockedStages.some(
      (unlockedStageId: string) =>
        stage._id.toString() == unlockedStageId.toString()
    );

    if (isUnlocked) {
      const result = await Results.findOne({
        stageId: stage._id,
        isBestScore: true,
      });
      if (result) stage.score = result.score;
    }
    stage.isUnlocked = isUnlocked;
  }

  return stages;
};
