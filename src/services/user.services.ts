import { UserModel } from "../../types/Database/types";
import User from "../model/user.model";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Plans from "../model/plan.model";
import { genderEnums } from "../utils/enum";
import UserProgress from "../model/userProgress.model";
import Stage from "../model/stage.model";

export const getUserById = (userId: string): Promise<UserModel> => {
  const user = User.findById(userId);
  if (!user) throw new Error("User not found");

  return user;
};

export const generateJsonWebToken = (payload: { id: any; jti: string }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

export const generateRandomJti = (length = 16) => {
  return crypto.randomBytes(length).toString("hex");
};

export const addPlansForUser = async (user: UserModel) => {
  const allPlans = await Plans.find({});

  for (const plan of allPlans) {
    const userProgress = new UserProgress({
      userId: user._id,
      planId: plan._id,
    });

    userProgress.unlockedStages.easyStagesForMale = await getStages(
      plan.easyStagesForMale
    );
    userProgress.unlockedStages.normalStagesForMale = await getStages(
      plan.normalStagesForMale
    );
    userProgress.unlockedStages.hardStagesForMale = await getStages(
      plan.hardStagesForMale
    );
    userProgress.unlockedStages.easyStagesForFemale = await getStages(
      plan.easyStagesForFemale
    );
    userProgress.unlockedStages.normalStagesForFemale = await getStages(
      plan.normalStagesForFemale
    );
    userProgress.unlockedStages.hardStagesForFemale = await getStages(
      plan.hardStagesForFemale
    );
    await userProgress.save();
  }
};

const getStages = async (stages: any) => {
  const ids = [];
  for (const id of stages) {
    const stage = await Stage.findById(id);
    if (stage.unlockedByDefault) ids.push(stage._id);
  }
  return ids;
};
