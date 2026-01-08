export interface ChartModel {
    x: string;
    y: number;
    label?: string;
}

export interface AsAnalyticsData {
    itemsA: ChartModel[]; // 지사별 A/S 접수 현황
    itemsB: ChartModel[]; // 지사별 A/S 분류 분포
    itemsC: ChartModel[]; // 처리자별 A/S 성과
    itemsD: ChartModel[]; // 업체별 A/S 이력 분석
    itemsE: ChartModel[]; // 시간대별 A/S 접수 추이
    itemsF: ChartModel[]; // 문의 프로그램별 A/S 발생 빈도
}

export interface AsAnalyticsResponse {
    result: boolean;
    data: AsAnalyticsData | null;
    errMsg: string | null;
}
