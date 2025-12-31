export interface ChartModel {
    x: string;
    y: number;
    label?: string;
}

export interface ChartInnoEvent {
    serial: number;
    subject: string;
    eventStart: string;
    eventEnd: string;
    orderCount: number;
    orderPrice: number;
}

export interface ChartInnoTotalSum {
    orderCount: number;
    orderPrice: number;
}

export interface ChartInnoData {
    itemsA: ChartModel[]; // 업체별 총 주문액 Top 10
    itemsB: ChartModel[]; // 담당지사별 주문 현황
    itemsC: ChartModel[]; // 요일별 주문 추이
    itemsD: ChartModel[]; // 상품명별 판매 현황
    itemsE: ChartInnoEvent[]; // 이벤트 진행 현황
    itemsF: ChartInnoTotalSum; // 주문 총건/총액
}

export interface InnoAnalyticsResponse {
    result: boolean;
    data: ChartInnoData | null;
    errMsg: string | null;
}
