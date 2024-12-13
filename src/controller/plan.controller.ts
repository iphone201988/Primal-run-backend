import { NextFunction, Request, Response } from "express";
import {
  SUCCESS,
  TryCatch,
  completeUrls,
  convertKmToMiles,
  getFiles,
} from "../utils/helper";
import { AddPlanRequest, GetPlanRequest } from "../../types/API/Plan/types";
import Plans from "../model/plan.model";
import ErrorHandler from "../utils/ErrorHandler";
import { getUserById } from "../services/user.services";
import {
  genderEnums,
  measurementUnitEnums,
  planCategoryEnums,
} from "../utils/enum";
import UserProgress from "../model/userProgress.model";
import { unlockStages } from "../services/plan.services";

export const addPlan = TryCatch(
  async (
    req: Request<{}, {}, AddPlanRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      title,
      description,
      distancePlan,
      isPremium,
      categoryType,
      to,
      from,
    } = req.body;

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
      category: {
        type: categoryType,
        to,
        from,
      },
    });

    return SUCCESS(res, 201, "New plan created successfully");
  }
);

export const getAllPlans = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const plans = await Plans.find({})
      .select("_id title description distancePlan image isPremium category")
      .lean();

    const finalData = completeUrls(plans, ["image"]).map((plan: any) => ({
      ...plan,
      progress: 0,
    }));

    const groupedPlans = finalData.reduce((acc: any, plan: any) => {
      const categoryKey = Object.keys(planCategoryEnums).find(
        (key) => planCategoryEnums[key] == plan.category.type
      );
      plan.category.name = categoryKey;

      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }

      if (user.unitOfMeasure == measurementUnitEnums.MILES) {
        plan = {
          ...plan,
          category: {
            ...plan.category,
            to: parseFloat((plan.category.to * 0.621371).toFixed(2)),
            from: parseFloat((plan.category.from * 0.621371).toFixed(2)),
          },
        };
      }

      acc[categoryKey].push(plan);
      return acc;
    }, {});

    return SUCCESS(res, 200, undefined, {
      data: { groupedData: groupedPlans },
    });
  }
);

const getPlanById = TryCatch(
  async (req: Request<GetPlanRequest>, res: Response, next: NextFunction) => {
    const { userId, user } = req;
    const { planId } = req.params;

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
        "badgeId title distance duration speed isPremium isSprint sprintCount sprintDistanceInMeter image level state"
      )
      .populate(
        normalStages,
        "badgeId title distance duration speed isPremium isSprint sprintCount sprintDistanceInMeter image level state"
      )
      .populate(
        hardStages,
        "badgeId title distance duration speed isPremium isSprint sprintCount sprintDistanceInMeter image level state"
      )
      .sort("level")
      .lean();

    if (!plan) return next(new ErrorHandler("Plan not found", 400));

    const userProgress = await UserProgress.findOne({ userId });

    // const finalData = completeUrls(plan, ["image"]);
    let finalData = {
      ...plan,
      image: process.env.BACKEND_URL + plan.image,
      [easyStages]: completeUrls(plan[easyStages], ["image"]),
      [normalStages]: completeUrls(plan[normalStages], ["image"]),
      [hardStages]: completeUrls(plan[hardStages], ["image"]),
    };

    finalData = {
      ...finalData,
      [easyStages]: await unlockStages(
        finalData[easyStages],
        userProgress.unlockedStages[easyStages]
      ),
      [normalStages]: await unlockStages(
        finalData[normalStages],
        userProgress.unlockedStages[normalStages]
      ),
      [hardStages]: await unlockStages(
        finalData[hardStages],
        userProgress.unlockedStages[hardStages]
      ),
    };

    console.log("finalData::::", finalData);
    if (user.unitOfMeasure == measurementUnitEnums.MILES) {
      finalData = {
        ...finalData,
        distancePlan: parseFloat(
          (finalData.distancePlan * 0.621371).toFixed(2)
        ),
        [easyStages]: convertKmToMiles(finalData[easyStages], ["distance"]),
        [normalStages]: convertKmToMiles(finalData[normalStages], ["distance"]),
        [hardStages]: convertKmToMiles(finalData[hardStages], ["distance"]),
      };
    }

    return SUCCESS(res, 200, undefined, { data: finalData });
  }
);

export default {
  addPlan,
  getAllPlans,
  getPlanById,
};
