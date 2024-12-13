import { NextFunction, Request, Response } from "express";
import { SUCCESS, TryCatch } from "../utils/helper";
import Achievements from "../model/achievements.model";

const getMyAchievements = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req;
    const achievements = await Achievements.find({ userId }).select(
      "-createdAt -updatedAt -__v"
    );
    return SUCCESS(res, 200, undefined, { data: achievements });
  }
);

export default {
  getMyAchievements,
};
