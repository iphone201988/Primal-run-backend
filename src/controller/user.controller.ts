import {
  SUCCESS,
  TryCatch,
  completeUrls,
  convertKmToMiles,
  getFiles,
} from "../utils/helper";
import User from "../model/user.model";
import {
  addPlansForUser,
  generateJsonWebToken,
  generateRandomJti,
  getUserById,
} from "../services/user.services";
import ErrorHandler from "../utils/ErrorHandler";
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../../types/Database/types";
import {
  SocialLoginRequest,
  UpdateUserRequest,
} from "../../types/API/User/types";
import UserProgress from "../model/userProgress.model";
import Results from "../model/results.model";
import mongoose from "mongoose";
import { measurementUnitEnums } from "../utils/enum";

const socialLogin = TryCatch(
  async (
    req: Request<{}, {}, SocialLoginRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      socialId,
      email,
      name,
      lat,
      lng,
      dob,
      socialType,
      deviceToken,
      deviceType,
    } = req.body;

    let user: UserModel = await User.findOne({ socialId, isDeleted: false });
    let isUserExists = true;

    if (!user) {
      isUserExists = false;
      user = await User.create({
        name,
        email,
        socialId,
        socialType,
        dob,
      });
    }
    const jti = generateRandomJti(20);
    user.jti = jti;
    user.deviceToken = deviceToken;
    user.deviceType = deviceType;

    if (lat) user.lat = lat;
    if (lng) user.lng = lng;

    if (lat & lng) {
      user.location = {
        type: "Point",
        coordinates: [lng, lat],
      };
    }

    await user.save();

    const userProgress = await UserProgress.findOne({ userId: user._id });
    if (!userProgress) await addPlansForUser(user);

    user = user.toObject();
    const token = generateJsonWebToken({ id: user._id, jti });

    res.status(200).json({
      success: true,
      user: {
        ...user,
        isUserExists,
        token,
        jti: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        __v: undefined,
        location: undefined,
        isDeleted: undefined,
        socialType: undefined,
        deviceToken: undefined,
        deviceType: undefined,
      },
    });
  }
);

const updateUserData = TryCatch(
  async (
    req: Request<{}, {}, UpdateUserRequest>,
    res: Response,
    next: NextFunction
  ) => {
    let { user: userExists } = req;

    let { gender, lat, lng, name, dob, unitOfMeasure } = req.body;

    if (gender) userExists.gender = gender;
    if (name) userExists.name = name;
    if (dob) userExists.dob = dob;
    if (unitOfMeasure) userExists.unitOfMeasure = unitOfMeasure;

    if (req.files) {
      const image = getFiles(req, ["profileImage"]);
      userExists.profileImage = image.profileImage[0];
    }

    if (lat && lng) {
      userExists.lat = lat;
      userExists.lng = lng;

      userExists.location = {
        type: "Point",
        coordinates: [lng, lat],
      };
    }

    await userExists.save();
    userExists = userExists.toObject();
    return SUCCESS(res, 200, "User data updated successfully", {
      user: {
        ...userExists,
        jti: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        __v: undefined,
        location: undefined,
        isDeleted: undefined,
        socialType: undefined,
        deviceToken: undefined,
        deviceType: undefined,
      },
    });
  }
);

const getUserProfile = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let { user } = req;
    user = user.toObject();
    return SUCCESS(res, 200, undefined, {
      data: {
        ...user,
        location: undefined,
        __v: undefined,
        deviceToken: undefined,
        deviceType: undefined,
        jti: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      },
    });
  }
);

const logoutUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req;
    const user = await getUserById(userId);

    if (!user) return next(new ErrorHandler("User not found", 400));

    user.jti = undefined;
    await user.save();

    return SUCCESS(res, 200, "User logged out successfully");
  }
);

const getMyActivities = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, user } = req;

    const results = await Results.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$userId",
          totalDistance: { $sum: "$distance" },
          totalDuration: { $sum: "$duration" },
          activities: { $sum: 1 },
          previousResults: { $push: "$$ROOT" },
        },
      },
    ]);

    let finalData = {
      ...results[0],
      previousResults: completeUrls(results[0].previousResults, ["videoLink"]),
    };

    if (user.unitOfMeasure == measurementUnitEnums.MILES) {
      finalData = {
        ...finalData,
        totalDistance: parseFloat(
          (finalData.totalDistance * 0.621371).toFixed(2)
        ),
        previousResults: convertKmToMiles(finalData.previousResults, [
          "distance",
        ]),
      };
    }

    return SUCCESS(res, 200, undefined, { data: finalData });
  }
);

export default {
  socialLogin,
  updateUserData,
  logoutUser,
  getMyActivities,
  getUserProfile,
};
