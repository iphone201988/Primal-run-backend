import express from "express";
import { authenticationMiddleware } from "../middleware/auth.middleware";
import resultController from "../controller/result.controller";
import upload from "../middleware/multer.middleware";
import validate from "../middleware/validate.middleware";
import resultsSchema from "../schema/results.schema";
import validateFiles from "../middleware/validateFiles.middleware";

const resultRoutes = express.Router();

resultRoutes.post(
  "/saveResults",
  authenticationMiddleware,
  upload.fields([{ name: "videoLink", maxCount: 1 }]),
  validateFiles(["videoLink"]),
  validate(resultsSchema.saveResultsSchema),
  resultController.saveResults
);

export default resultRoutes;
