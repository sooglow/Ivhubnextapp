import { SalesItem } from "@/app/sales/types/List";
import { BaseProcedures, ProcedureResult } from "./index";
import { getSalesStatusName } from "@/public/constants/status";

export class SalesProcedures extends BaseProcedures {
    /**
     * 영업문의 목록 조회
     */
    static async getSalesList(
        prgCode: string | null,
        areaCode: string | null,
        salesMan: string | null,
        state: number | null,
        keyword: string | null,
        pageNumber: number,
        pageSize: number
    ): Promise<ProcedureResult<SalesItem>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        const result = await this.executeProc<any>("USP_CORE_SALES", [
            { name: "sales_serial", type: sql.default.VarChar(12), value: null },
            { name: "prgcode", type: sql.default.VarChar(3), value: prgCode },
            { name: "areacode", type: sql.default.VarChar(5), value: areaCode },
            { name: "salesman", type: sql.default.VarChar(10), value: salesMan },
            {
                name: "state",
                type: sql.default.VarChar(1),
                value: state !== null ? state.toString() : null,
            },
            { name: "keyword", type: sql.default.VarChar(100), value: keyword },
            { name: "pageNumber", type: sql.default.Int, value: pageNumber },
            { name: "pageSize", type: sql.default.Int, value: pageSize },
        ]);

        if (result.success && result.data) {
            const mappedData = result.data.map((item: any) => ({
                RowNumber: item.RowNumber ? Number(item.RowNumber) : 0,
                salesSerial: item.sales_serial || "",
                callDay: item.callday || "",
                area: item.area || "",
                comName: item.comname || "",
                salesMan: item.salesman || "",
                salesType: item.salestype || "",
                salesState: item.salesstate || "",
                salesStateName: getSalesStatusName(item.salesstate || ""),
                comCode: item.comcode || "",
                salesArea: item.areaname || "",
                comMan: item.comman || "",
                comTel: item.comtel || "",
                hp: item.hp || "",
                comAddr: item.comaddr || "",
                salesPath: item.salespath || "",
                prgName: item.prgname || "",
                callMan: item.callman || "",
                salesDescr: item.salesdescr || "",
                salesOutDescr: item.salesoutdescr || "",
                TotalCount: item.TotalCount ? Number(item.TotalCount) : 0,
            }));

            return {
                success: true,
                data: mappedData,
                rowsAffected: result.rowsAffected,
            };
        }

        return result;
    }

    /**
     * 영업문의 상세 조회
     */
    static async getSalesView(salesSerial: string): Promise<ProcedureResult<any>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        const result = await this.executeProcMultipleResultSets("USP_CORE_SALES", [
            { name: "sales_serial", type: sql.default.VarChar(12), value: salesSerial },
        ]);

        if (result.success && result.recordsets) {
            // 첫 번째 recordset: salesInfo
            const salesInfo = result.recordsets[0]?.[0] || null;

            // 두 번째 recordset: salesComPrgItems
            const salesComPrgItems = result.recordsets[1] || [];

            const viewData = {
                salesInfo: salesInfo
                    ? {
                          salesSerial: salesInfo.sales_serial || "",
                          callDay: salesInfo.callday || "",
                          area: salesInfo.area || "",
                          comName: salesInfo.comname || "",
                          salesMan: salesInfo.salesman || "",
                          salesType: salesInfo.salestype || "",
                          salesState: salesInfo.salesstate || 0,
                          salesStateName: getSalesStatusName(salesInfo.salesstate || ""),
                          comCode: salesInfo.comcode || "",
                          salesArea: salesInfo.salesarea || "",
                          comMan: salesInfo.comman || "",
                          comTel: salesInfo.comtel || "",
                          hp: salesInfo.hp || "",
                          comAddr: salesInfo.comaddr || "",
                          salesPath: salesInfo.salespath || "",
                          prgName: salesInfo.prgname || "",
                          callMan: salesInfo.callman || "",
                          salesDescr: salesInfo.salesdescr || "",
                          salesOutDescr: salesInfo.salesoutdescr || "",
                      }
                    : null,
                salesComPrgItems: salesComPrgItems.map((item: any) => ({
                    prgName: item.prgname || "",
                    luseName: item.lusename || "",
                    luseDt: item.lusedt || "",
                    ssoDay: item.ssoday || "",
                })),
            };

            return {
                success: true,
                data: viewData,
                rowsAffected: result.rowsAffected,
            };
        }

        return {
            success: false,
            error: result.error || "데이터 조회 실패",
        };
    }

    /**
     * 영업문의 수정
     */
    static async updateSales(
        salesSerial: string,
        salesMan: string,
        salesArea: string,
        salesState: number
    ): Promise<ProcedureResult<any>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        return this.executeProc<any>("USP_CORE_SALES_U", [
            { name: "sales_serial", type: sql.default.VarChar(12), value: salesSerial },
            { name: "salesman", type: sql.default.VarChar(10), value: salesMan },
            { name: "salesArea", type: sql.default.VarChar(5), value: salesArea },
            { name: "salesstate", type: sql.default.Int, value: salesState },
        ]);
    }

    /**
     * 영업문의 삭제
     */
    static async deleteSales(
        salesSerial: string,
        userId: string,
        areaCode: string
    ): Promise<ProcedureResult<any>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        const result = await this.executeProc<any>("USP_CORE_SALES_D", [
            { name: "sales_serial", type: sql.default.VarChar(12), value: salesSerial },
            { name: "userid", type: sql.default.VarChar(10), value: userId },
            { name: "areacode", type: sql.default.VarChar(5), value: areaCode },
            {
                name: "errmsg",
                type: sql.default.VarChar(500),
                value: null,
                output: true,
            } as any,
        ]);

        // output parameter 처리
        if (result.success) {
            const outputParams = (result as any).output;
            if (outputParams?.errmsg) {
                return {
                    success: false,
                    error: outputParams.errmsg,
                };
            }
        }

        return result;
    }
}
