import { BaseProcedures } from "./index";
import type {
    CreateSalesActivityRequest,
    SalesActivityListRequest,
    UpdateSalesActivityRequest,
} from "@/app/deptWorks/salesHist/types/Activity";

export class SalesHistProcedures extends BaseProcedures {
    /**
     * 영업문의 최근 50개 목록 조회
     * 프로시저: USP_CORE_SALES_LAST_50
     */
    static async getSalesInquiryList(userId: string) {
        const sql = await import("mssql");

        return this.executeProc<any>("USP_CORE_SALES_LAST_50", [
            { name: "userid", type: sql.default.VarChar(10), value: userId },
        ]);
    }

    /**
     * 영업활동 목록 조회 (납품 또는 영업활동)
     * 프로시저: USP_CORE_SALESLOG
     */
    static async getSalesActivityList(params: SalesActivityListRequest) {
        const sql = await import("mssql");

        return this.executeProc<any>("USP_CORE_SALESLOG", [
            { name: "areacode", type: sql.default.VarChar(10), value: params.areaCode },
            { name: "userid", type: sql.default.VarChar(10), value: params.userId },
            { name: "saleday1", type: sql.default.VarChar(10), value: params.saleDay1 },
            { name: "saleday2", type: sql.default.VarChar(10), value: params.saleDay2 },
            { name: "keyword", type: sql.default.VarChar(50), value: params.keyword || null },
            { name: "statename", type: sql.default.VarChar(20), value: params.stateName },
            { name: "pagenumber", type: sql.default.Int, value: params.pageNumber },
            { name: "pagesize", type: sql.default.Int, value: params.pageSize },
        ]);
    }

    /**
     * 영업활동 상세 조회
     * 프로시저: USP_CORE_SALESLOG
     */
    static async getSalesActivityDetail(actSerial: string, actSeqNo: string) {
        const sql = await import("mssql");

        return this.executeProc<any>("USP_CORE_SALESLOG", [
            { name: "act_serial", type: sql.default.VarChar(20), value: actSerial },
            { name: "act_seqno", type: sql.default.VarChar(10), value: actSeqNo },
        ]);
    }

    /**
     * 영업활동 생성
     * 프로시저: USP_CORE_SALESLOG_C (actSerial, actSeqNo null로 전달하면 생성)
     */
    static async createSalesActivity(data: CreateSalesActivityRequest) {
        const sql = await import("mssql");

        return this.executeProcWithOutput<any>("USP_CORE_SALESLOG_C", [
            { name: "userid", type: sql.default.VarChar(10), value: data.userId },
            { name: "act_serial", type: sql.default.VarChar(20), value: null },
            { name: "act_seqno", type: sql.default.VarChar(10), value: null },
            { name: "comcode", type: sql.default.VarChar(10), value: data.comCode || null },
            { name: "comname", type: sql.default.VarChar(50), value: data.comName },
            { name: "comidno", type: sql.default.VarChar(20), value: data.comIdno || null },
            { name: "prgcode", type: sql.default.VarChar(10), value: data.prgCode },
            { name: "billprice", type: sql.default.Int, value: data.billPrice || 0 },
            { name: "install_price", type: sql.default.Int, value: data.installPrice || 0 },
            { name: "install_price_add", type: sql.default.Int, value: data.installPriceAdd || 0 },
            { name: "upgrade_price", type: sql.default.Int, value: data.upgradePrice || 0 },
            { name: "usermax", type: sql.default.Int, value: data.userMax || 0 },
            { name: "salehour", type: sql.default.Int, value: data.saleHour || 0 },
            {
                name: "special_memo",
                type: sql.default.VarChar(500),
                value: data.specialMemo || null,
            },
            { name: "statename", type: sql.default.VarChar(20), value: data.stateName },
            { name: "saleday", type: sql.default.VarChar(10), value: data.saleDay },
            { name: "salestype", type: sql.default.VarChar(20), value: data.salesType },
        ]);
    }

    /**
     * 영업활동 수정
     * 프로시저: USP_CORE_SALESLOG_C (actSerial, actSeqNo 포함하면 수정)
     */
    static async updateSalesActivity(data: UpdateSalesActivityRequest) {
        const sql = await import("mssql");

        return this.executeProcWithOutput<any>("USP_CORE_SALESLOG_C", [
            { name: "userid", type: sql.default.VarChar(10), value: data.userId },
            { name: "act_serial", type: sql.default.VarChar(20), value: data.actSerial },
            { name: "act_seqno", type: sql.default.VarChar(10), value: data.actSeqNo },
            { name: "comcode", type: sql.default.VarChar(10), value: data.comCode || null },
            { name: "comname", type: sql.default.VarChar(50), value: data.comName },
            { name: "comidno", type: sql.default.VarChar(20), value: data.comIdno || null },
            { name: "prgcode", type: sql.default.VarChar(10), value: data.prgCode },
            { name: "billprice", type: sql.default.Int, value: data.billPrice || 0 },
            { name: "install_price", type: sql.default.Int, value: data.installPrice || 0 },
            { name: "install_price_add", type: sql.default.Int, value: data.installPriceAdd || 0 },
            { name: "upgrade_price", type: sql.default.Int, value: data.upgradePrice || 0 },
            { name: "usermax", type: sql.default.Int, value: data.userMax || 0 },
            { name: "salehour", type: sql.default.Int, value: data.saleHour || 0 },
            {
                name: "special_memo",
                type: sql.default.VarChar(500),
                value: data.specialMemo || null,
            },
            { name: "statename", type: sql.default.VarChar(20), value: data.stateName },
            { name: "saleday", type: sql.default.VarChar(10), value: data.saleDay },
            { name: "salestype", type: sql.default.VarChar(20), value: data.salesType },
        ]);
    }
}
