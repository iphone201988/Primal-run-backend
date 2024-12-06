import { UserModel } from "../../types/Database/types";
import User from "../model/user.model";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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
