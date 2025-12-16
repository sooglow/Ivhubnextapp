import { BaseProcedures } from "./index";

export class MaintenanceProcedures extends BaseProcedures {
    /**
     * 유지보수 계약업체 목록 조회
     */
    static async getMaintenanceList(
        comCode: string = "",
        keyword: string = "",
        pageNumber: number = 1,
        pageSize: number = 10
    ) {
        const sql = await import("mssql");

        return this.executeProc<any>("USP_CORE_MAINTENANCE", [
            { name: "comcode", type: sql.default.VarChar(10), value: comCode || null },
            { name: "keyword", type: sql.default.VarChar(50), value: keyword || null },
            { name: "pageNumber", type: sql.default.Int, value: pageNumber },
            { name: "pageSize", type: sql.default.Int, value: pageSize },
        ]);
    }

    /**
     * 유지보수 계약업체 상세 조회
     */
    static async getMaintenanceDetail(serial: string) {
        const sql = await import("mssql");

        return this.executeProc<any>("USP_CORE_MAINTENANCE", [
            { name: "serial", type: sql.default.VarChar(10), value: serial },
        ]);
    }

    /**
     * 유지보수 계약업체 생성/수정
     */
    static async createOrUpdateMaintenance(data: {
        serial?: string;
        asDay: string;
        userId: string;
        comCode: string;
        subject: string;
        asMemo: string;
        asResult: string;
        bigo: string;
        result: string;
    }) {
        const { serial, asDay, userId, comCode, subject, asMemo, asResult, bigo, result } = data;

        const sql = await import("mssql");

        const cleanValue = (val: any) =>
            val === "" || val === null || val === undefined ? null : val;

        return this.executeProc<any>("USP_CORE_MAINTENANCE_C", [
            { name: "serial", type: sql.default.VarChar(10), value: cleanValue(serial) },
            { name: "asday", type: sql.default.VarChar(10), value: cleanValue(asDay) },
            { name: "userid", type: sql.default.VarChar(20), value: cleanValue(userId) },
            { name: "comcode", type: sql.default.VarChar(10), value: cleanValue(comCode) },
            { name: "subject", type: sql.default.VarChar(100), value: cleanValue(subject) },
            { name: "asmemo", type: sql.default.VarChar(2000), value: cleanValue(asMemo) },
            { name: "asresult", type: sql.default.VarChar(2000), value: cleanValue(asResult) },
            { name: "bigo", type: sql.default.VarChar(2000), value: cleanValue(bigo) },
            { name: "result", type: sql.default.VarChar(10), value: cleanValue(result) },
        ]);
    }

    /**
     * 유지보수 계약업체 삭제
     */
    static async deleteMaintenance(serial: string) {
        const sql = await import("mssql");

        return this.executeProc<any>("USP_CORE_MAINTENANCE_D", [
            { name: "serial", type: sql.default.VarChar(10), value: serial },
        ]);
    }
}
