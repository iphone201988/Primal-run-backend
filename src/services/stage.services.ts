import { StageModel } from "../../types/Database/types";
import Stage from "../model/stage.model";
import ErrorHandler from "../utils/ErrorHandler";

export const getPlanStageById = async (
  stageId: string
): Promise<StageModel> => {
  const stage = await Stage.findById(stageId);

  if (!stage) throw new ErrorHandler("Stage not found", 400);

  return stage;
};
