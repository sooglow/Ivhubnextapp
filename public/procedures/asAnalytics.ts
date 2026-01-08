import { BaseProcedures } from "./index";

export interface ChartModel {
    x: string;
    y: number;
    label?: string;
}

export interface ChartASResponseModel {
    itemsA: ChartModel[]; // 지사별 A/S 접수 현황
    itemsB: ChartModel[]; // 지사별 A/S 분류 분포
    itemsC: ChartModel[]; // 처리자별 A/S 성과
    itemsD: ChartModel[]; // 업체별 A/S 이력 분석
    itemsE: ChartModel[]; // 시간대별 A/S 접수 추이
    itemsF: ChartModel[]; // 문의 프로그램별 A/S 발생 빈도
}

export class AsAnalyticsProcedures extends BaseProcedures {
    /**
     * A/S 차트 데이터 조회
     */
    static async getAsChartData(
        sday: string,
        eday: string
    ): Promise<{ success: boolean; data?: ChartASResponseModel; error?: string }> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        try {
            const result = await this.executeProcMultipleResultSets("USP_CORE_AS_CHART_DATA", [
                { name: "sday", type: sql.default.VarChar(10), value: sday },
                { name: "eday", type: sql.default.VarChar(10), value: eday },
            ]);

            if (!result.success) {
                return {
                    success: false,
                    error: result.error || "데이터 조회에 실패했습니다.",
                };
            }

            const chartData: ChartASResponseModel = {
                itemsA: [],
                itemsB: [],
                itemsC: [],
                itemsD: [],
                itemsE: [],
                itemsF: [],
            };

            // 첫번째 결과 집합 - 지사별 A/S 접수 현황
            if (result.recordsets[0]) {
                chartData.itemsA = result.recordsets[0].map((row: any) => ({
                    x: row.X || "",
                    y: row.Y ? parseInt(row.Y) : 0,
                }));
            }

            // 두번째 결과 집합 - 지사별 A/S 분류 분포
            if (result.recordsets[1]) {
                chartData.itemsB = result.recordsets[1].map((row: any) => ({
                    x: row.X || "",
                    y: row.Y ? parseInt(row.Y) : 0,
                    label: row.label || row.Label || "",
                }));
            }

            // 세번째 결과 집합 - 처리자별 A/S 성과
            if (result.recordsets[2]) {
                chartData.itemsC = result.recordsets[2].map((row: any) => ({
                    x: row.X || "",
                    y: row.Y ? parseInt(row.Y) : 0,
                }));
            }

            // 네번째 결과 집합 - 업체별 A/S 이력 분석
            if (result.recordsets[3]) {
                chartData.itemsD = result.recordsets[3].map((row: any) => ({
                    x: row.X || "",
                    y: row.Y ? parseInt(row.Y) : 0,
                }));
            }

            // 다섯번째 결과 집합 - 시간대별 A/S 접수 추이
            if (result.recordsets[4]) {
                chartData.itemsE = result.recordsets[4].map((row: any) => ({
                    x: row.X || "",
                    y: row.Y ? parseInt(row.Y) : 0,
                }));
            }

            // 여섯번째 결과 집합 - 문의 프로그램별 A/S 발생 빈도
            if (result.recordsets[5]) {
                chartData.itemsF = result.recordsets[5].map((row: any) => ({
                    x: row.X || "",
                    y: row.Y ? parseInt(row.Y) : 0,
                }));
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
