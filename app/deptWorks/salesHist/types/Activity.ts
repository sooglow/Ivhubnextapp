import { SearchParams, SalesType, StateName } from "./Common";

// 영업활동 아이템 (납품 & 영업활동 공통)
export interface SalesActivityItem {
    actSerial: string; // 활동 시리얼
    actSeqNo: string; // 활동 순번
    userId: string; // 사용자 ID
    saleDay: string; // 활동일자
    salesMan: string; // 담당자
    prgCode: string; // 프로그램 코드
    prgName: string; // 프로그램명
    comCode: string; // 업체코드
    comName: string; // 업체명
    areaName: string; // 지역명
    salesType: SalesType; // 유형

    // 납품용 필드
    userMax?: number; // 대수
    billPrice?: number; // 월사용료
    installPrice?: number; // 설치비
    installPriceAdd?: number; // 추가설치비
    upgradePrice?: number; // 업그레이드비

    // 영업활동용 필드
    saleHour?: number; // 시간(분)

    // 공통
    specialMemo?: string; // 메모
}

// 영업활동 목록 요청
export interface SalesActivityListRequest extends SearchParams {
    stateName: StateName; // "납품" | "영업활동"
    pageNumber: number;
    pageSize: number;
}

// 영업활동 목록 응답
export interface SalesActivityListResponse {
    result: boolean;
    data: {
        items: SalesActivityItem[];
        totalCount: number;
    };
    errMsg?: string;
}

// 영업활동 생성 요청
export interface CreateSalesActivityRequest {
    userId: string;
    comName: string;
    comCode: string;
    comIdno: string;
    prgCode: string;
    billPrice: number;
    installPrice: number;
    installPriceAdd: number;
    upgradePrice: number;
    userMax: number;
    saleHour: number;
    specialMemo: string;
    stateName: "납품" | "영업활동";
    saleDay: string;
    salesType: SalesType;
}

// 영업활동 수정/삭제 요청
export interface UpdateSalesActivityRequest {
    userId: string;
    actSerial: string;
    actSeqNo: string;
    comCode: string;
    comName: string;
    comIdno: string;
    prgCode: string;
    billPrice: number;
    installPrice: number;
    installPriceAdd: number;
    upgradePrice: number;
    userMax: number;
    saleHour: number;
    specialMemo: string;
    stateName: "납품" | "영업활동" | "삭제";
    saleDay: string;
    salesType: SalesType;
}

// 영업활동 생성/수정 응답
export interface SalesActivityResponse {
    result: boolean;
    errMsg?: string;
}
