export interface SolutionInfoItem {
  RowNumber: number;
  TotalCount: number;
  num: number;
  subject: string;
  sday: string;
  eday: string;
  solution: string;
  memo: string | null;
  statename: string;
  preViewUrl: string;
}

export interface SolutionInfoListData {
  items: SolutionInfoItem[];
  totalCount: number;
}

export interface SolutionInfoListResponse {
  result: boolean;
  data: SolutionInfoListData | null;
  errMsg: string | null;
  errCode: string | null;
}

// PreViewUrl 컴포넌트 Props
export interface PreViewUrlProps {
  preViewUrl: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}
