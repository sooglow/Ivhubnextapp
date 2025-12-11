// app/info/solutionInfo/types/Edit.ts

export interface SolutionInfoEditItem {
  num: number;
  subject: string;
  sday: string;
  eday: string;
  solution: string;
  memo: string;
  statename: string;
}

export interface SolutionInfoDetailResponse {
  result: boolean;
  data: SolutionInfoEditItem | null;
  errMsg: string | null;
  errCode: string | null;
}

export interface SolutionInfoUpdateRequest {
  num: number;
  subject: string;
  sday: string;
  eday: string;
  solution: string;
  memo: string;
}

export interface SolutionInfoUpdateResponse {
  result: boolean;
  errMsg: string | null;
  errCode: string | null;
}

export interface SolutionInfoDeleteResponse {
  result: boolean;
  errMsg: string | null;
  errCode: string | null;
}
