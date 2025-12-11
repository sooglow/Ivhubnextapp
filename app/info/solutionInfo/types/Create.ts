export interface SolutionInfoCreateRequest {
  sday: string;
  eday: string;
  subject: string;
  filename?: string | null;
  solutions: string;
  memo?: string;
  files?: File[];
  xlsFile?: File | null;
}

export interface SolutionInfoCreateResponse {
  result: boolean;
  errMsg: string | null;
  errCode: string | null;
}
