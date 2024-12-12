export type SaveResultsRequest = {
  planId: string;
  stageId: string;
  badgeId?: string;
  distance: number;
  duration: number;
  averageSpeed: number;
  score: number;
  resultStatus: number;
  resultType: number;
};
