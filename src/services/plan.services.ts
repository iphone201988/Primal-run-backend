import { PlanModel } from "../../types/Database/types";
import Plans from "../model/plan.model";
import ErrorHandler from "../utils/ErrorHandler";

export const getPlanById = async (planId: string): Promise<PlanModel> => {
  const plan = await Plans.findById(planId);

  if (!plan) throw new ErrorHandler("Plan not found", 400);

  return plan;
};

export const unlockStages = (stages: any, unlockedStages: any) => {
  return stages.map((stage: any) => ({
    ...stage,
    isUnlocked: unlockedStages.some(
      (unlockedStageId: string) =>
        stage._id.toString() == unlockedStageId.toString()
    ),
  }));
};
