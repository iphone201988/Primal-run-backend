import { NextFunction, Request, Response } from "express";
import { SUCCESS, TryCatch, convertKmToMiles, getFiles } from "../utils/helper";
import { AddStageRequest, GetStageRequest } from "../../types/API/Stage/types";
import Stage from "../model/stage.model";
import ErrorHandler from "../utils/ErrorHandler";
import { getPlanById } from "../services/plan.services";
import {
  gameTypeEnums,
  genderEnums,
  measurementUnitEnums,
} from "../utils/enum";
import Results from "../model/results.model";

export const addStage = TryCatch(
  async (
    req: Request<{}, {}, AddStageRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      planId,
      badgeId,
      title,
      description,
      distance,
      duration,
      speed,
      isSprint,
      sprintCount,
      sprintDistanceInMeter,
      isPremium,
      type,
      gender,
      level,
      unlockedByDefault,
    } = req.body;

    const plan = await getPlanById(planId);

    const files = getFiles(req, ["image"]);

    const stage = await Stage.findOne({
      planId,
      badgeId,
      title,
      distance,
      duration,
      speed,
      level,
    });

    if (stage) return next(new ErrorHandler("Plan stage already exists", 400));

    const newStage = await Stage.create({
      planId,
      badgeId,
      title,
      description,
      distance,
      duration,
      speed,
      isSprint,
      sprintCount,
      sprintDistanceInMeter,
      isPremium,
      type,
      gender,
      level,
      unlockedByDefault,
      image: files.image[0],
    });

    if (gender == genderEnums.MALE) {
      if (type == gameTypeEnums.EASY) {
        plan.easyStagesForMale.push(newStage._id);
      }
      if (type == gameTypeEnums.NORMAL) {
        plan.normalStagesForMale.push(newStage._id);
      }
      if (type == gameTypeEnums.HARD) {
        plan.hardStagesForMale.push(newStage._id);
      }
    }

    if (gender == genderEnums.FEMALE) {
      if (type == gameTypeEnums.EASY) {
        plan.easyStagesForFemale.push(newStage._id);
      }
      if (type == gameTypeEnums.NORMAL) {
        plan.normalStagesForFemale.push(newStage._id);
      }
      if (type == gameTypeEnums.HARD) {
        plan.hardStagesForFemale.push(newStage._id);
      }
    }

    await plan.save();

    return SUCCESS(res, 201, "Plan stage added successfully");
  }
);

const getStageById = TryCatch(
  async (req: Request<GetStageRequest>, res: Response, next: NextFunction) => {
    const { user } = req;
    const { stageId } = req.params;

    const stage = await Stage.findOne({ _id: stageId })
      .select("-createdAt -updatedAt -__v")
      .lean();

    if (!stage) return next(new ErrorHandler("Stage not found", 400));

    const previousResults = await Results.find({ stageId })
      .select("score createdAt distance duration speed")
      .lean();

    let finalData = {
      ...stage,
      image: process.env.BACKEND_URL + stage.image,
      previousResults: previousResults ? previousResults : [],
    };

    if (user.unitOfMeasure == measurementUnitEnums.MILES) {
      finalData = {
        ...finalData,
        distance: parseFloat((finalData.distance * 0.621371).toFixed(2)),
        previousResults: convertKmToMiles(finalData.previousResults, [
          "distance",
        ]),
      };
    }

    return SUCCESS(res, 200, undefined, { data: finalData });
  }
);

export default {
  addStage,
  getStageById,
};
