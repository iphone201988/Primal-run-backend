import { NextFunction, Request, Response } from "express";
import { SUCCESS, TryCatch, getFiles } from "../utils/helper";
import { SaveResultsRequest } from "../../types/API/Results/types";
import Results from "../model/results.model";
import { getPlanById } from "../services/plan.services";
import { getPlanStageById } from "../services/stage.services";
import Stage from "../model/stage.model";
import { getUserById } from "../services/user.services";
import UserProgress from "../model/userProgress.model";
import { gameTypeEnums, genderEnums } from "../utils/enum";

export const saveResults = TryCatch(
  async (
    req: Request<{}, {}, SaveResultsRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const { userId } = req;
    const user = await getUserById(userId);

    const {
      planId,
      stageId,
      distance,
      duration,
      averageSpeed,
      score,
      resultStatus,
      resultType,
    } = req.body;

    const plan = await getPlanById(planId);
    const stage = await getPlanStageById(stageId);

    const files = getFiles(req, ["videoLink"]);

    await Results.create({
      userId,
      planId,
      stageId,
      distance,
      duration,
      averageSpeed,
      score,
      resultStatus,
      resultType,
      videoLink: files.videoLink[0],
    });

    if (resultStatus == 1) {
      let key: string = "";
      if (user.gender == genderEnums.MALE) {
        if (stage.type == gameTypeEnums.EASY) key = "easyStagesForMale";
        if (stage.type == gameTypeEnums.NORMAL) key = "normalStagesForMale";
        if (stage.type == gameTypeEnums.HARD) key = "hardStagesForMale";
      } else {
        if (stage.type == gameTypeEnums.EASY) key = "easyStagesForFemale";
        if (stage.type == gameTypeEnums.NORMAL) key = "normalStagesForFemale";
        if (stage.type == gameTypeEnums.HARD) key = "hardStagesForFemale";
      }

      const nextStage = await Stage.findOne({
        level: stage.level + 1,
        type: stage.type,
        gender: user.gender,
      });

      if (nextStage) {
        const userProgress = await UserProgress.findOne({ userId });
        const isExists = userProgress.unlockedStages[key].find(
          (id: any) => id.toString() == nextStage._id.toString()
        );
        if (!isExists) {
          userProgress.unlockedStages[key].push(nextStage._id);
          await userProgress.save();
        }
      }
    }

    return SUCCESS(res, 201, "Result saved successfully");
  }
);

export default {
  saveResults,
};
