import { NextFunction, Request, Response } from "express";
import { SUCCESS, TryCatch, getFiles } from "../utils/helper";
import { AddPlanRequest, GetPlanRequest } from "../../types/API/Plan/types";
import Plans from "../model/plan.model";
import ErrorHandler from "../utils/ErrorHandler";
import { getUserById } from "../services/user.services";
import { genderEnums } from "../utils/enum";

export const addPlan = TryCatch(
  async (
    req: Request<{}, {}, AddPlanRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const { title, description, distancePlan, isPremium } = req.body;
    const files = getFiles(req, [
      "image",
      "footStepsSounds",
      "roarSounds",
      "breathingSounds",
      "attackSounds",
    ]);

    const animal = await Plans.findOne({ title, isPremium, distancePlan });
    if (animal) return next(new ErrorHandler("Plan already exists", 400));

    await Plans.create({
      title,
      description,
      distancePlan,
      isPremium,
      image: files.image[0],
      footStepsSounds: files.footStepsSounds,
      roarSounds: files.roarSounds,
      breathingSounds: files.breathingSounds,
      attackSounds: files.attackSounds,
    });

    return SUCCESS(res, 201, "New plan created successfully");
  }
);

export const getAllPlans = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const plans = await Plans.find({})
      .select("_id title description distancePlan image isPremium")
      .lean();

    const finalData = plans.map((plan) => ({
      ...plan,
      progress: 0,
    }));

    return SUCCESS(res, 200, undefined, { data: finalData });
  }
);

const getPlanById = TryCatch(
  async (req: Request<GetPlanRequest>, res: Response, next: NextFunction) => {
    const { userId } = req;
    const { planId } = req.params;

    const user = await getUserById(userId);
    let easyStages: string, normalStages: string, hardStages: string;

    if (user.gender == genderEnums.MALE) {
      easyStages = "easyStagesForMale";
      normalStages = "normalStagesForMale";
      hardStages = "hardStagesForMale";
    } else {
      easyStages = "easyStagesForFemale";
      normalStages = "normalStagesForFemale";
      hardStages = "hardStagesForFemale";
    }

    const plan = await Plans.findOne({
      _id: planId,
    })
      .select(
        `_id title description distancePlan image isPremium ${easyStages} ${normalStages} ${hardStages}`
      )
      .populate(
        easyStages,
        "title distance duration speed isPremium isSprint sprintCount sprintDistanceInMeter"
      )
      .populate(
        normalStages,
        "title distance duration speed isPremium isSprint sprintCount sprintDistanceInMeter"
      )
      .populate(
        hardStages,
        "title distance duration speed isPremium isSprint sprintCount sprintDistanceInMeter"
      );

    if (!plan) return next(new ErrorHandler("Plan not found", 400));

    return SUCCESS(res, 200, undefined, { data: plan });
  }
);

export default {
  addPlan,
  getAllPlans,
  getPlanById,
};
