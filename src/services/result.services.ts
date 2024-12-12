import { UserProgressModel } from "../../types/Database/types";
import Stage from "../model/stage.model";
import ErrorHandler from "../utils/ErrorHandler";

export const unlockNextLevelOfStages = async (
  gameType: number,
  gender: number,
  key: string,
  userProgress: UserProgressModel
) => {
  const nextLevelStage = await Stage.findOne({
    level: 1,
    type: gameType,
    gender: gender,
  });

  if (!nextLevelStage) throw new ErrorHandler("Stage not found", 400);

  userProgress.unlockedStages[key].push(nextLevelStage._id);

  await userProgress.save();
};
