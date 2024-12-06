export type AddPlanRequest = {
  title: string;
  description: string;
  distancePlan: number;
  isPremium: string;
};

export type GetPlanRequest = {
  planId: string;
};
