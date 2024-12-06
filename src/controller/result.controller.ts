import { NextFunction, Request, Response } from "express";
import { SUCCESS, TryCatch, getFiles } from "../utils/helper";
import { SaveResultsRequest } from "../../types/API/Results/types";
import Results from "../model/results.model";

export const saveResults = TryCatch(
  async (
    req: Request<{}, {}, SaveResultsRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const { userId } = req;
    const {
      planId,
      planStageId,
      distance,
      duration,
      averageSpeed,
      score,
      resultStatus,
      resultType,
    } = req.body;

    const files = getFiles(req, ["videoLink"]);

    await Results.create({
      userId,
      planId,
      planStageId,
      distance,
      duration,
      averageSpeed,
      score,
      resultStatus,
      resultType,
      videoLink: files.videoLink[0],
    });

    return SUCCESS(res, 201, "Result is saved successfully");
  }
);

export default {
  saveResults,
};
