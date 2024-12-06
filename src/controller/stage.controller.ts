import { NextFunction, Request, Response } from "express";
import { SUCCESS, TryCatch, getFiles } from "../utils/helper";
import { AddStageRequest, GetStageRequest } from "../../types/API/Stage/types";
import PlanStage from "../model/stage.model";
import ErrorHandler from "../utils/ErrorHandler";
import { getPlanById } from "../services/plan.services";
import { gameTypeEnums, genderEnums } from "../utils/enum";

export const addStage = TryCatch(
  async (
    req: Request<{}, {}, AddStageRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      planId,
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
    } = req.body;

    const plan = await getPlanById(planId);

    const files = getFiles(req, ["image"]);

    const stage = await PlanStage.findOne({
      planId,
      title,
      distance,
      duration,
      speed,
    });

    if (stage)
      return next(new ErrorHandler("Plan stage is already exists", 400));

    const newStage = await PlanStage.create({
      planId,
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
    const { stageId } = req.params;

    const stage = await PlanStage.findOne({ _id: stageId }).select(
      "-createdAt -updatedAt -__v"
    );

    if (!stage) return next(new ErrorHandler("Stage not found", 400));

    return SUCCESS(res, 200, undefined, { data: stage });
  }
);

export default {
  addStage,
  getStageById,
};
