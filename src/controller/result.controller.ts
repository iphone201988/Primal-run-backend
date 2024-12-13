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
import ErrorHandler from "../utils/ErrorHandler";
import { unlockNextLevelOfStages } from "../services/result.services";
import Achievements from "../model/achievements.model";

export const saveResults = TryCatch(
  async (
    req: Request<{}, {}, SaveResultsRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const { userId, user } = req;

    const {
      planId,
      stageId,
      badgeId,
      distance,
      duration,
      averageSpeed,
      score,
      resultStatus,
      resultType,
    } = req.body;

    const files = getFiles(req, ["videoLink"]);

    // FREE RUN
    if (resultType == 2) {
      await Results.create({
        userId,
        badgeId,
        distance,
        duration,
        averageSpeed,
        score,
        resultStatus,
        resultType,
        videoLink: files.videoLink[0],
      });

      return SUCCESS(res, 201, "Result saved successfully");
    }

    // const results = await Results.find({
    //   userId,
    //   planId,
    //   isBestScore: true,
    // });
    // // TODO: Based on the max score per stage
    // console.log("results:::::", results);

    const plan = await getPlanById(planId);
    const stage = await getPlanStageById(stageId);

    const previousResult = await Results.findOne({
      userId,
      planId,
      stageId,
      badgeId,
      isBestScore: true,
      resultStatus: 1,
      resultType: 1,
    });

    let isBestScore = true;

    if (previousResult) {
      // New Best Score
      if (previousResult.score < score || previousResult.score == score) {
        previousResult.isBestScore = false;
        await previousResult.save();
      } else {
        isBestScore = false;
      }
    }

    await Results.create({
      userId,
      planId,
      stageId,
      badgeId,
      distance,
      duration,
      averageSpeed,
      score,
      resultStatus,
      resultType,
      isBestScore,
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

      const userProgress = await UserProgress.findOne({ userId });

      // Unlocking next stage
      if (nextStage) {
        const isExists = userProgress.unlockedStages[key].find(
          (id: any) => id.toString() == nextStage._id.toString()
        );
        if (!isExists) {
          userProgress.unlockedStages[key].push(nextStage._id);
          await userProgress.save();
        }
      }

      if (stage.isBossStage && stage.type == gameTypeEnums.EASY) {
        if (user.gender == genderEnums.MALE) {
          key = "normalStagesForMale";
        } else {
          key = "normalStagesForFemale";
        }
        await unlockNextLevelOfStages(
          gameTypeEnums.NORMAL,
          user.gender,
          key,
          userProgress
        );
      }
      if (stage.isBossStage && stage.type == gameTypeEnums.NORMAL) {
        if (user.gender == genderEnums.MALE) {
          key = "hardStagesForMale";
        } else {
          key = "hardStagesForFemale";
        }
        await unlockNextLevelOfStages(
          gameTypeEnums.HARD,
          user.gender,
          key,
          userProgress
        );
      }

      // If Boss stage of hard stage is completed
      if (stage.isBossStage && stage.type == gameTypeEnums.HARD) {
        const achievements = await Achievements.findOne({ userId, badgeId });
        if (!achievements) {
          const results = await Results.find({
            userId,
            planId,
            isBestScore: true,
          });
          // TODO: Based on the max score per stage
          console.log("results:::::", results);
        }
      }
    }

    return SUCCESS(res, 201, "Result saved successfully");
  }
);

export default {
  saveResults,
};
