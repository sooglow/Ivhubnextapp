import { BaseProcedures } from "./index";

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

export interface ChartInnoResponseModel {
    itemsA: ChartModel[]; // 업체별 총 주문액 Top 10
    itemsB: ChartModel[]; // 담당지사별 주문 현황
    itemsC: ChartModel[]; // 요일별 주문 추이
    itemsD: ChartModel[]; // 상품명별 판매 현황
    itemsE: ChartInnoEvent[]; // 이벤트 진행 현황
    itemsF: ChartInnoTotalSum; // 주문 총건/총액
}

export class InnoAnalyticsProcedures extends BaseProcedures {
    /**
     * 이노몰 차트 데이터 조회
     */
    static async getInnoChartData(
        sday: string,
        eday: string
    ): Promise<{ success: boolean; data?: ChartInnoResponseModel; error?: string }> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        try {
            const result = await this.executeProcMultipleResultSets("USP_CORE_INNO_CHART_DATA", [
                { name: "sday", type: sql.default.VarChar(10), value: sday },
                { name: "eday", type: sql.default.VarChar(10), value: eday },
            ]);

            if (!result.success) {
                return {
                    success: false,
                    error: result.error || "데이터 조회에 실패했습니다.",
                };
            }

            const chartData: ChartInnoResponseModel = {
                itemsA: [],
                itemsB: [],
                itemsC: [],
                itemsD: [],
                itemsE: [],
                itemsF: { orderCount: 0, orderPrice: 0 },
            };

            // 첫번째 결과 집합 - 업체별 총 주문액 Top 10
            if (result.recordsets[0]) {
                chartData.itemsA = result.recordsets[0].map((row: any) => ({
                    x: row.X || "",
                    y: row.Y ? parseInt(row.Y) : 0,
                }));
            }

            // 두번째 결과 집합 - 담당지사별 주문 현황
            if (result.recordsets[1]) {
                chartData.itemsB = result.recordsets[1].map((row: any) => ({
                    x: row.X || "",
                    y: row.Y ? parseInt(row.Y) : 0,
                }));
            }

            // 세번째 결과 집합 - 요일별 주문 추이
            if (result.recordsets[2]) {
                chartData.itemsC = result.recordsets[2].map((row: any) => ({
                    x: row.X || "",
                    y: row.Y ? parseInt(row.Y) : 0,
                }));
            }

            // 네번째 결과 집합 - 상품명별 판매 현황
            if (result.recordsets[3]) {
                chartData.itemsD = result.recordsets[3].map((row: any) => ({
                    x: row.X || "",
                    y: row.Y ? parseInt(row.Y) : 0,
                }));
            }

            // 다섯번째 결과 집합 - 이벤트 진행 현황
            if (result.recordsets[4]) {
                chartData.itemsE = result.recordsets[4].map((row: any) => ({
                    serial: row.SERIAL ? parseInt(row.SERIAL) : 0,
                    subject: row.SUBJECT || "",
                    eventStart: row.Event_Start || "",
                    eventEnd: row.Event_End || "",
                    orderCount: row.Order_Count ? parseInt(row.Order_Count) : 0,
                    orderPrice: row.Order_Price ? parseInt(row.Order_Price) : 0,
                }));
            }

            // 여섯번째 결과 집합 - 주문 총건/총액
            if (result.recordsets[5] && result.recordsets[5][0]) {
                const row = result.recordsets[5][0];
                chartData.itemsF = {
                    orderCount: row.Order_Count ? parseInt(row.Order_Count) : 0,
                    orderPrice: row.Order_Price ? parseInt(row.Order_Price) : 0,
                };
            }

            return {
                success: true,
                data: chartData,
            };
        } catch (error: any) {
            console.error("❌ 프로시저 실행 실패:", error);
            return {
                success: false,
                error: error.message || "데이터 조회에 실패했습니다.",
            };
        }
    }
}
