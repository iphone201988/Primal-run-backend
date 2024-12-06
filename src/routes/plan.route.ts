import express from "express";
import { authenticationMiddleware } from "../middleware/auth.middleware";
import upload from "../middleware/multer.middleware";
import validate from "../middleware/validate.middleware";
import validateFiles from "../middleware/validateFiles.middleware";
import planSchema from "../schema/plan.schema";
import planController from "../controller/plan.controller";

const planRoutes = express.Router();

planRoutes.post(
  "/addPlan",
  authenticationMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "footStepsSounds" },
    { name: "roarSounds" },
    { name: "breathingSounds" },
    { name: "attackSounds" },
  ]),
  validateFiles([
    "image",
    "footStepsSounds",
    "roarSounds",
    "breathingSounds",
    "attackSounds",
  ]),
  validate(planSchema.addPlanSchema),
  planController.addPlan
);

planRoutes.get(
  "/getAllPlans",
  authenticationMiddleware,
  planController.getAllPlans
);

planRoutes.get(
  "/getPlanById/:planId",
  authenticationMiddleware,
  validate(planSchema.getPlanByIdSchema),
  planController.getPlanById
);

export default planRoutes;
