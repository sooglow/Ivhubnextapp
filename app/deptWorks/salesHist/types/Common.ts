// 검색 파라미터
export interface SearchParams {
    areaCode: string;
    userId: string;
    saleDay1: string;
    saleDay2: string;
    keyword: string;
}

// 영업 상태
export type SalesState = "문의" | "상담" | "전환" | "계약" | "납품" | "포기";

// 영업 유형
export type SalesType =
    | "신규-업글"
    | "신규-전환"
    | "재구매"
    | "고객지원"
    | "리뉴얼"
    | "청약"
    | "AS"
    | "교육"
    | "상담"
    | "차계부"
    | "대수추가"
    | "기타";

// StateName (영업활동 구분)
export type StateName = "납품" | "영업활동" | "삭제";
