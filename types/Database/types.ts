import { Document, Schema } from "mongoose";
import { IsSchemaTypeFromBuiltinClass } from "mongoose/types/inferschematype";

type LocationType = {
  type: "Point";
  coordinates: [number, number];
};
export interface UserModel extends Document {
  name: string;
  profileImage: string;
  dob: string;
  socialId: string;
  gender: number;
  deviceToken: string;
  isPremium: boolean;
  isDeleted: boolean;
  jti: string | null;
  deviceType: number | null;
  isFreeTrail: boolean;
  startDateOfPrimium: Date | null;
  endDateOfPrimium: Date | null;
  lastActive: Date | null;
  socialType: number;
  unitOfMeasure: number;
  lat: number;
  lng: number;
  location: LocationType;
  role: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanModel extends Document {
  title: string;
  description: string;
  distancePlan: number;
  image: string;
  footStepsSounds: string[];
  roarSounds: string[];
  breathingSounds: string[];
  attackSounds: string[];
  easyStagesForMale: Array<any>;
  normalStagesForMale: Array<any>;
  hardStagesForMale: Array<any>;
  easyStagesForFemale: Array<any>;
  normalStagesForFemale: Array<any>;
  hardStagesForFemale: Array<any>;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StageModel extends Document {
  planId: Schema.Types.ObjectId;
  title: string;
  description: string;
  image: string;
  distance: number;
  duration: number;
  speed: number;
  isSprint: boolean;
  sprintCount: number;
  sprintDistanceInMeter: number;
  level: number;
  isPremium: boolean;
  unlockedByDefault: boolean;
  type: number;
  gender: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResultsModel extends Document {
  userId: Schema.Types.ObjectId;
  planId: Schema.Types.ObjectId;
  stageId: Schema.Types.ObjectId;
  videoLink: string;
  distance: number;
  duration: number;
  averageSpeed: number;
  score: number;
  resultStatus: number;
  resultType: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BadgeModel extends Document {
  badgeImage: string;
  badgeType: number;
}

export interface UserProgressModel extends Document {
  userId: Schema.Types.ObjectId;
  planId: Schema.Types.ObjectId;
  unlockedStages: {
    easyStagesForMale: Array<any>;
    normalStagesForMale: Array<any>;
    hardStagesForMale: Array<any>;
    easyStagesForFemale: Array<any>;
    normalStagesForFemale: Array<any>;
    hardStagesForFemale: Array<any>;
  };
  createdAt: Date;
  updatedAt: Date;
}
