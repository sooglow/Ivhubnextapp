import { ShopItem } from "@/app/shop/types/List";
import {
    CompanyInfo,
    SalesItem,
    AsHistItem,
    UsedPrgItem,
    ShopViewDetail,
} from "@/app/shop/types/View";
import { BaseProcedures, ProcedureResult } from "./index";

export class ShopProcedures extends BaseProcedures {
    // Shop 목록 조회 프로시저
    static async getShopList(
        keyword: string | null,
        pageNumber: number,
        pageSize: number,
        prgCode: string | null = null,
        areaCode: string | null = null
    ): Promise<ProcedureResult<ShopItem>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        const result = await this.executeProc<any>("USP_CORE_SHOP", [
            { name: "keyword", type: sql.default.VarChar(100), value: keyword },
            { name: "pageNumber", type: sql.default.Int, value: pageNumber },
            { name: "pageSize", type: sql.default.Int, value: pageSize },
            { name: "PrgCode", type: sql.default.VarChar(50), value: prgCode },
            { name: "AreaCode", type: sql.default.VarChar(50), value: areaCode },
        ]);

        if (result.success && result.data) {
            const mappedData = result.data.map((item: any) => ({
                rowNumber: item.RowNumber ? Number(item.RowNumber) : 0,
                comCode: item.comcode || "",
                area: item.area || "",
                comName: item.comname || "",
                boss: item.boss || "",
                idno: item.idno || "",
                tel: item.tel || "",
                hp: item.hp || "",
                areaName: item.areaname || "",
                address: item.address || "",
                regDate: item.regDate || "",
                useYn: item.useYn || "",
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

    // Shop 상세 조회 프로시저 - 4개의 결과 집합 반환
    static async getShopView(
        comCode: string
    ): Promise<{ success: boolean; data?: ShopViewDetail; error?: string }> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        const result = await this.executeProcMultipleResultSets("USP_CORE_SHOP", [
            { name: "comcode", type: sql.default.VarChar(50), value: comCode },
        ]);

        if (!result.success || !result.recordsets) {
            return {
                success: false,
                error: result.error || "데이터 조회 실패",
            };
        }

        const viewDetail: ShopViewDetail = {
            comInfo: null,
            salesItems: [],
            asHistItems: [],
            usedPrgItems: [],
        };

        // 첫 번째 결과 집합 - 업체 기본 정보
        if (result.recordsets[0] && result.recordsets[0].length > 0) {
            const item = result.recordsets[0][0];
            viewDetail.comInfo = {
                comCode: String(item.comcode || ""),
                comName: String(item.comname || ""),
                idno: String(item.idno || ""),
                boss: String(item.boss || ""),
                hp: String(item.hp || ""),
                tel: String(item.tel || ""),
                address: String(item.address || ""),
                vipComMemo: String(item.vipcom_memo || ""),
                blackComMemo: String(item.blackcom_memo || ""),
                hpSlot01: String(item.hp_slot0 || ""),
                hp01: item.hp01 === "--" ? "" : String(item.hp01 || ""),
                hpSlot02: String(item.hp_slot1 || ""),
                hp02: item.hp02 === "--" ? "" : String(item.hp02 || ""),
                hpSlot03: String(item.hp_slot2 || ""),
                hp03: item.hp03 === "--" ? "" : String(item.hp03 || ""),
                hpSlot04: String(item.hp_slot3 || ""),
                hp04: item.hp04 === "--" ? "" : String(item.hp04 || ""),
                areaCode: String(item.areacode || ""),
                areaName: String(item.areaname || ""),
                registMan: String(item.registman || ""),
                homeCode: String(item.homecode || ""),
                homeName: String(item.homename || ""),
                fax: item.fax === "--" ? "" : String(item.fax || ""),
                lat: item.lat || undefined,
                lon: item.lon || undefined,
            };
        }

        // 두 번째 결과 집합 - 영업문의 이력
        if (result.recordsets[1]) {
            viewDetail.salesItems = result.recordsets[1].map((item: any) => ({
                salesSerial: String(item.sales_serial || ""),
                comName: String(item.comname || ""),
                comCode: String(item.comcode || ""),
                comMan: String(item.comman || ""),
                comTel: String(item.comtel || ""),
                hp: String(item.hp || ""),
                area: String(item.area || ""),
                comAddr: String(item.comaddr || ""),
                salesPath: String(item.salespath || ""),
                salesType: String(item.salestype || ""),
                prgName: String(item.prgname || ""),
                callMan: String(item.callman || ""),
                salesDescr: String(item.salesdescr || ""),
                salesOutDescr: String(item.salesoutdescr || ""),
                salesArea: String(item.salesarea || ""),
                salesMan: String(item.salesman || ""),
                salesState: String(item.salesstate || ""),
                salesStateName: String(item.salesstatename || ""),
            }));
        }

        // 세 번째 결과 집합 - A/S 이력
        if (result.recordsets[2]) {
            viewDetail.asHistItems = result.recordsets[2].map((item: any) => ({
                callDay: String(item.callday || ""),
                callMan: String(item.callman || ""),
                outMan: String(item.outman || ""),
                prgName: String(item.prgname || ""),
                asKind: String(item.as_kind || ""),
                asDescr: String(item.asdescr || ""),
                asOutDescr: String(item.asoutdescr || ""),
            }));
        }

        // 네 번째 결과 집합 - 프로그램 정보
        if (result.recordsets[3]) {
            viewDetail.usedPrgItems = result.recordsets[3].map((item: any) => ({
                comCode: String(item.comcode || ""),
                prgCode: String(item.prgcode || ""),
                prgName: String(item.prgname || ""),
                installDay: String(item.installday || ""),
                userMax: String(item.user_max || ""),
                areaName: String(item.areaname || ""),
                registMan: String(item.registman || ""),
                tsUserInfo: String(item.ts_userinfo || ""),
                memo: String(item.memo || ""),
                billPrice: item.billprice ? Number(item.billprice) : 0,
                stateName: String(item.statename || ""),
            }));
        }

        return {
            success: true,
            data: viewDetail,
        };
    }

    // Shop 프로그램 정보 업데이트 프로시저
    static async updatePrgInfo(
        comCode: string,
        prgCode: string,
        limit: number | null,
        tsUserId: string,
        tsPassword: string
    ): Promise<{ success: boolean; error?: string }> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        try {
            const result = await this.executeProc<any>("USP_CORE_SHOP_U", [
                { name: "comcode", type: sql.default.VarChar(50), value: comCode },
                { name: "prgcode", type: sql.default.VarChar(50), value: prgCode },
                {
                    name: "limit",
                    type: sql.default.Int,
                    value: limit !== null ? limit : null,
                },
                { name: "tsTokenId", type: sql.default.VarChar(50), value: tsUserId || "" },
                { name: "tsTokenPw", type: sql.default.VarChar(50), value: tsPassword || "" },
                {
                    name: "errmsg",
                    type: sql.default.VarChar(500),
                    value: "",
                    output: true,
                },
            ]);

            // output 파라미터에서 에러 메시지 확인
            if (result.output && result.output.errmsg) {
                return {
                    success: false,
                    error: result.output.errmsg,
                };
            }

            return {
                success: true,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || "업데이트 실패",
            };
        }
    }
}
