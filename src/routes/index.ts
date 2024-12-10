import express from "express";
import userRoutes from "./user.route";
import planRoutes from "./plan.route";
import stageRoutes from "./stage.route";
import resultRoutes from "./result.route";
import badgeRoutes from "./badge.route";
const router = express.Router();

router.use("/user", userRoutes);
router.use("/plan", planRoutes);
router.use("/stage", stageRoutes);
router.use("/result", resultRoutes);
router.use("/badge", badgeRoutes);

export default router;
