import { SalesState } from "./Common";

// 영업문의 목록 아이템 (최근 50개)
export interface SalesInquiryItem {
    salesSerial: string; // 영업 시리얼
    callDay: string; // 접수일자
    prgName: string; // 솔루션명
    comName: string; // 업체명
    comCode: string; // 업체코드
    comTel: string; // 연락처
    area: string; // 지역
    areaName: string; // 지사명
    salesMan: string; // 담당자
    salesType: string; // 유형
    salesState: SalesState; // 상태
    salesDescr: string; // 영업문의 내용
    headOpin: string; // 본사문의 내용
    salesArea: string; // 담당지사 코드
}

// 영업문의 목록 응답
export interface SalesInquiryListResponse {
    result: boolean;
    data: {
        items: SalesInquiryItem[];
    };
    errMsg?: string;
}

// 영업문의 상태 수정 요청
export interface UpdateSalesStateRequest {
    salesSerial: string;
    salesMan: string;
    salesArea: string;
    salesState: SalesState;
}

// 영업문의 상태 수정 응답
export interface UpdateSalesStateResponse {
    result: boolean;
    errMsg?: string;
}
