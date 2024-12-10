import express from "express";
import { authenticationMiddleware } from "../middleware/auth.middleware";
import badgeController from "../controller/badge.controller";
import upload from "../middleware/multer.middleware";
import validateFiles from "../middleware/validateFiles.middleware";
import validate from "../middleware/validate.middleware";
import badgeSchema from "../schema/badge.schema";

const badgeRoutes = express.Router();

badgeRoutes.post(
  "/addBadge",
  authenticationMiddleware,
  upload.fields([{ name: "badgeImage", maxCount: 1 }]),
  validateFiles(["badgeImage"]),
  validate(badgeSchema.addBadgeSchema),
  badgeController.addBadge
);

badgeRoutes.get(
  "/getAllBadges",
  authenticationMiddleware,
  badgeController.getAllBadges
);

export default badgeRoutes;
