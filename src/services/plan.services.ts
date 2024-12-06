import { PlanModel } from "../../types/Database/types";
import Plans from "../model/plan.model";
import ErrorHandler from "../utils/ErrorHandler";

export const getPlanById = async (planId: string): Promise<PlanModel> => {
  const plan = await Plans.findById(planId);

  if (!plan) throw new ErrorHandler("Plan not found", 400);

  return plan;
};
