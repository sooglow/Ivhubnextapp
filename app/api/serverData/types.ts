// 업체 서버 데이터 조회 타입 정의

export interface CompanyServerDataRequest {
  comCode: string;
  prgCode: string;
}

export interface CompanyServerDataResponse {
  customSdate: string;
  customEdate: string;
  customCnt: number | null;
  historySdate: string;
  historyEdate: string;
  historyCnt: number | null;
}
