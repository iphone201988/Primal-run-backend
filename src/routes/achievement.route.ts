import express from "express";
import { authenticationMiddleware } from "../middleware/auth.middleware";
import achievementController from "../controller/achievement.controller";

const achievementRoutes = express.Router();

achievementRoutes.get(
  "/getMyAchievements",
  authenticationMiddleware,
  achievementController.getMyAchievements
);

export default achievementRoutes;
