import { NextFunction, Request, Response } from "express";
import { SUCCESS, TryCatch, completeUrls, getFiles } from "../utils/helper";
import { AddBadge } from "../../types/API/Badge/types";
import Badge from "../model/badge.model";
import ErrorHandler from "../utils/ErrorHandler";

export const addBadge = TryCatch(
  async (req: Request<{}, {}, AddBadge>, res: Response, next: NextFunction) => {
    const { badgeType } = req.body;
    const files = getFiles(req, ["badgeImage"]);

    const badge = await Badge.findOne({ badgeType });
    if (badge) return next(new ErrorHandler("Badge already exists", 400));

    await Badge.create({
      badgeType,
      badgeImage: files.badgeImage[0],
    });

    return SUCCESS(res, 201, "Badge added successfully");
  }
);

export const getAllBadges = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const badges = await Badge.find({})
      .select("-createdAt -updatedAt -__v")
      .lean();

    if (!badges) return next(new ErrorHandler("Badges not found", 400));

    return SUCCESS(res, 200, undefined, {
      data: completeUrls(badges, ["badgeImage"]),
    });
  }
);

export default {
  addBadge,
  getAllBadges,
};
