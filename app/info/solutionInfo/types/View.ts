// app/info/solutionInfo/types/View.ts
export interface SolutionInfoViewItem {
  serial: string;
  subject: string;
  writer: string;
  wdate: string;
  content: string;
  sday: string;
  eday: string;
  statename: string;
  memo: string;
  solution: string;
  preViewUrl: string;
}

export interface SolutionInfoViewResponse {
  result: boolean;
  data: SolutionInfoViewItem | null;
  errMsg: string | null;
  errCode: string | null;
}
