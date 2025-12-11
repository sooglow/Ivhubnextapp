export interface ShopItem {
  rowNumber: number;
  comCode: string;
  area: string;
  comName: string;
  boss: string;
  idno: string;
  tel: string;
  hp: string;
  areaName: string;
  address: string;
  regDate: string;
  useYn: string;
  totalCount: number;
}

export interface ShopListRequest {
  keyword?: string;
  pageNumber: number;
  pageSize: number;
}

export interface ShopListResponse {
  result: boolean;
  data: {
    items: ShopItem[];
    totalCount: number;
  } | null;
  errMsg: string | null;
  errCode: string | null;
}
