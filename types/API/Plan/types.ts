export type AddPlanRequest = {
  title: string;
  description: string;
  distancePlan: number;
  isPremium: string;
  categoryType: number;
  to: number;
  from: number;
};

export type GetPlanRequest = {
  planId: string;
};
