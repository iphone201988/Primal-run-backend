import express from "express";
import { authenticationMiddleware } from "../middleware/auth.middleware";
import stageController from "../controller/stage.controller";
import upload from "../middleware/multer.middleware";
import validateFiles from "../middleware/validateFiles.middleware";
import validate from "../middleware/validate.middleware";
import stageSchema from "../schema/stage.schema";
const stageRoutes = express.Router();

stageRoutes.post(
  "/addStage",
  authenticationMiddleware,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  validateFiles(["image"]),
  validate(stageSchema.addStageSchema),
  stageController.addStage
);

stageRoutes.get(
  "/getStageById/:stageId",
  authenticationMiddleware,
  validate(stageSchema.getStageByIdSchema),
  stageController.getStageById
);

export default stageRoutes;
