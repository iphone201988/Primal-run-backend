import express from "express";
import userController from "../controller/user.controller";
import upload from "../middleware/multer.middleware";
import { authenticationMiddleware } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import userSchema from "../schema/user.schema";
const userRoutes = express.Router();

userRoutes.post(
  "/socialLogin",
  validate(userSchema.socialLoginSchema),
  userController.socialLogin
);

userRoutes.put(
  "/updateUserData",
  authenticationMiddleware,
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
  validate(userSchema.updateProfileSchema),
  userController.updateUserData
);

userRoutes.get(
  "/logoutUser",
  authenticationMiddleware,
  userController.logoutUser
);
export default userRoutes;
