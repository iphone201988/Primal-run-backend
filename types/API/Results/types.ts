export type SaveResultsRequest = {
  planId: string;
  planStageId: string;
  distance: number;
  duration: number;
  averageSpeed: number;
  score: number;
  resultStatus: number;
  resultType: number;
};
