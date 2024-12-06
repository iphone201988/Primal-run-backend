import { SUCCESS, TryCatch, getFiles } from "../utils/helper";
import User from "../model/user.model";
import {
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
      gender,
      lat,
      lng,
      dob,
      socialType,
      deviceToken,
      deviceType,
    } = req.body;

    let user: UserModel = await User.findOne({ socialId, isDeleted: false });

    if (!user) {
      user = await User.create({
        name,
        email,
        gender,
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
    user = user.toObject();
    const token = generateJsonWebToken({ id: user._id, jti });

    res.status(200).json({
      success: true,
      user: {
        ...user,
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
    const id = req.user._id;

    let userExists = await getUserById(id);

    let { gender, lat, lng, name, dob, unitOfMeasure } = req.body;

    userExists.gender = gender || userExists.gender;
    userExists.lat = lat || userExists.lat;
    userExists.lng = lng || userExists.lng;
    userExists.name = name || userExists.name;
    userExists.dob = dob || userExists.dob;
    userExists.unitOfMeasure = unitOfMeasure || userExists.unitOfMeasure;

    if (req.files) {
      const image = getFiles(req, ["profileImage"]);
      userExists.profileImage = image.profileImage[0];
    }

    if (lat && lng) {
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

export default {
  socialLogin,
  updateUserData,
  logoutUser,
};
