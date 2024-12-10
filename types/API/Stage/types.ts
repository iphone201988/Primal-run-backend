export type AddStageRequest = {
  planId: string;
  title: string;
  description: string;
  distance: number;
  duration: number;
  speed: number;
  isSprint: boolean;
  sprintCount: number;
  sprintDistanceInMeter: number;
  isPremium: boolean;
  unlockedByDefault: boolean;
  type: number;
  gender: number;
  level: number;
};

export type GetStageRequest = {
  stageId: string;
};
