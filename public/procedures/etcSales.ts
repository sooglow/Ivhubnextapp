import { EtcSalesItem } from "@/app/deptWorks/etcSales/types/List";
import { EtcSalesInfo } from "@/app/deptWorks/etcSales/types/Edit";
import { BaseProcedures, ProcedureResult } from "./index";

export class EtcSalesProcedures extends BaseProcedures {
    /**
     * 기타매출 목록 조회
     */
    static async getEtcSalesList(
        state: string | null,
        keyword: string | null,
        pageNumber: number,
        pageSize: number
    ): Promise<ProcedureResult<EtcSalesItem>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        const result = await this.executeProc<any>("USP_CORE_ETC_SALES", [
            { name: "etcsales_serial", type: sql.default.VarChar(12), value: null },
            { name: "state", type: sql.default.VarChar(1), value: state },
            { name: "keyword", type: sql.default.VarChar(100), value: keyword },
            { name: "pageNumber", type: sql.default.Int, value: pageNumber },
            { name: "pageSize", type: sql.default.Int, value: pageSize },
        ]);

        if (result.success && result.data) {
            const mappedData = result.data.map((item: any) => ({
                rowNumber: item.RowNumber ? Number(item.RowNumber) : 0,
                etcSalesSerial: item.etcsales_serial || "",
                recDay: item.recday || "",
                area: item.area || "",
                comName: item.comname || "",
                comCode: item.comcode || "",
                kind: item.kind || "",
                skind: item.skind || "",
                qty: item.qty ? Number(item.qty) : 0,
                reqSum: item.reqsum ? Number(item.reqsum) : 0,
                inTotal: item.intotal ? Number(item.intotal) : 0,
                misu: item.misu ? Number(item.misu) : 0,
                state: item.state || "",
                stateName: item.statename || "",
                recMan: item.recman || "",
                totalCount: item.TotalCount ? Number(item.TotalCount) : 0,
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
     * 기타매출 상세 조회
     */
    static async getEtcSalesView(etcSalesSerial: string): Promise<ProcedureResult<EtcSalesInfo>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        const result = await this.executeProc<any>("USP_CORE_ETC_SALES", [
            { name: "etcsales_serial", type: sql.default.VarChar(12), value: etcSalesSerial },
        ]);

        if (result.success && result.data && result.data.length > 0) {
            const item = result.data[0];
            const mappedData = {
                etcSalesSerial: item.etcsales_serial || "",
                comName: item.comname || "",
                comCode: item.comcode || "",
                recMan: item.recman || "",
                tel: item.tel || "",
                hp: item.hp || "",
                area: item.area || "",
                addr: item.addr || "",
                receipter: item.receipter || "",
                kind: item.kind || "",
                skind: item.skind || "",
                qty: item.qty ? Number(item.qty) : 0,
                reqSum: item.reqsum ? Number(item.reqsum) : 0,
                inTotal: item.intotal ? Number(item.intotal) : 0,
                misu: item.misu ? Number(item.misu) : 0,
                descr: item.descr || "",
                state: item.state || "",
                sendDay: item.sendday || "",
                recDay: item.recday || "",
            };

            return {
                success: true,
                data: [mappedData],
                rowsAffected: result.rowsAffected,
            };
        }

        return result;
    }

    /**
     * 기타매출 생성/수정
     */
    static async createOrUpdateEtcSales(
        etcSalesSerial: string | null,
        comName: string,
        comCode: string,
        recMan: string,
        tel: string,
        hp: string,
        area: string,
        addr: string,
        receipter: string,
        kind: string,
        skind: string,
        qty: number,
        reqSum: number,
        inTotal: number,
        misu: number,
        descr: string,
        state: string,
        sendDay: string
    ): Promise<ProcedureResult<any>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        return this.executeProc<any>("USP_CORE_ETC_SALES_C", [
            { name: "etcsales_serial", type: sql.default.VarChar(12), value: etcSalesSerial },
            { name: "comname", type: sql.default.VarChar(50), value: comName },
            { name: "comcode", type: sql.default.VarChar(10), value: comCode },
            { name: "recman", type: sql.default.VarChar(10), value: recMan },
            { name: "tel", type: sql.default.VarChar(50), value: tel },
            { name: "hp", type: sql.default.VarChar(50), value: hp },
            { name: "area", type: sql.default.VarChar(50), value: area },
            { name: "addr", type: sql.default.VarChar(100), value: addr },
            { name: "receipter", type: sql.default.VarChar(50), value: receipter },
            { name: "kind", type: sql.default.VarChar(2), value: kind },
            { name: "skind", type: sql.default.VarChar(2), value: skind },
            { name: "qty", type: sql.default.Int, value: qty },
            { name: "reqsum", type: sql.default.Int, value: reqSum },
            { name: "intotal", type: sql.default.Int, value: inTotal },
            { name: "misu", type: sql.default.Int, value: misu },
            { name: "descr", type: sql.default.VarChar(5000), value: descr },
            { name: "state", type: sql.default.VarChar(1), value: state },
            { name: "sendday", type: sql.default.VarChar(10), value: sendDay },
        ]);
    }

    /**
     * 기타매출 삭제
     */
    static async deleteEtcSales(etcSalesSerial: string): Promise<ProcedureResult<any>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        return this.executeProc<any>("USP_CORE_ETC_SALES_D", [
            { name: "etcsales_serial", type: sql.default.VarChar(12), value: etcSalesSerial },
        ]);
    }
}
