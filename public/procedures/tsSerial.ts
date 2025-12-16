import { BaseProcedures } from "./index";

export class TsSerialProcedures extends BaseProcedures {
    /**
     * 국토부 시리얼 목록 조회
     */
    static async getTsSerialList(keyword: string = "") {
        const sql = await import("mssql");

        return this.executeProc<any>("USP_CORE_TS_COM_SERIAL", [
            { name: "keyword", type: sql.default.VarChar(50), value: keyword || null },
        ]);
    }

    /**
     * 국토부 시리얼 상세 조회
     */
    static async getTsSerialDetail(comSerial: string) {
        const sql = await import("mssql");

        return this.executeProc<any>("USP_CORE_TS_COM_SERIAL", [
            { name: "keyword", type: sql.default.VarChar(50), value: comSerial },
        ]);
    }

    /**
     * 국토부 시리얼 추가 생성
     */
    static async createTsSerial() {
        return this.executeProc<any>("USP_CORE_TS_EMPTY_SERIAL_C", []);
    }

    /**
     * 국토부 시리얼 수정
     * 주의: @salemancode는 담당자, @mancode는 지사
     */
    static async updateTsSerial(data: {
        comSerial: string;
        name: string;
        idNo: string;
        manCode: string;
        areaCode: string;
    }) {
        const { comSerial, name, idNo, manCode, areaCode } = data;

        const sql = await import("mssql");

        const cleanValue = (val: any) =>
            val === "" || val === null || val === undefined ? null : val;

        return this.executeProc<any>("USP_CORE_TS_COM_SERIAL_U", [
            { name: "comserial", type: sql.default.VarChar(10), value: cleanValue(comSerial) },
            { name: "name", type: sql.default.VarChar(50), value: cleanValue(name) },
            { name: "idno", type: sql.default.VarChar(50), value: cleanValue(idNo) },
            { name: "salemancode", type: sql.default.VarChar(10), value: cleanValue(manCode) },
            { name: "mancode", type: sql.default.VarChar(10), value: cleanValue(areaCode) },
        ]);
    }

    /**
     * 국토부 시리얼 삭제 (삭제 프로시저는 없는 것으로 보임)
     */
    static async deleteTsSerial(comSerial: string) {
        const sql = await import("mssql");

        return this.executeProc<any>("USP_CORE_TS_COM_SERIAL_D", [
            { name: "comserial", type: sql.default.VarChar(10), value: comSerial },
        ]);
    }
}
