import { Schema, model } from "mongoose";
import {
  deviceTypeEnums,
  genderEnums,
  measurementUnitEnums,
  rolesEnums,
  socialTypeEnums,
} from "../utils/enum";
import { UserModel } from "../../types/Database/types";

const userSchema = new Schema<UserModel>(
  {
    name: { type: String },
    profileImage: { type: String },
    dob: { type: String },
    socialId: { type: String },
    socialType: {
      type: Number,
      enum: Object.values(socialTypeEnums), // 1 google
    },
    gender: { type: Number, enum: Object.values(genderEnums) }, //1 mem  2 women 3 other
    deviceToken: { type: String },
    deviceType: { type: Number, enum: Object.values(deviceTypeEnums) },
    jti: {
      type: String,
    },
    role: {
      type: Number,
      enum: Object.values(rolesEnums),
      default: rolesEnums.USER,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isFreeTrail: {
      type: Boolean,
      default: false,
    },
    startDateOfPrimium: {
      type: Date,
    },
    endDateOfPrimium: {
      type: Date,
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
    unitOfMeasure: {
      type: Number,
      enum: [measurementUnitEnums.KILOMETERS, measurementUnitEnums.MILES],
      default: measurementUnitEnums.KILOMETERS,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);
userSchema.index({ location: "2dsphere" });

const User = model("User", userSchema);
export default User;
