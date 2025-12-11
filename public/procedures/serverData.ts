import { CompanyServerDataResponse } from "@/app/api/serverData/types";
import { BaseProcedures } from "./index";

export class ServerDataProcedures extends BaseProcedures {
  /**
   * 업체 사용 솔루션 서버 데이터 조회
   * @param comCode 업체 코드
   * @param prgCode 프로그램 코드
   * @returns 서버 데이터 정보 또는 null
   */
  static async getCompanyServerData(
    comCode: string,
    prgCode: string
  ): Promise<{ success: boolean; data?: CompanyServerDataResponse | null; error?: string }> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    const result = await this.executeProc<any>("USP_CORE_SERVER_DATA_CNT_S", [
      { name: "comcode", type: sql.default.VarChar(50), value: comCode },
      { name: "prgcode", type: sql.default.VarChar(50), value: prgCode },
    ]);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "데이터 조회 실패",
      };
    }

    // 데이터가 없는 경우
    if (!result.data || result.data.length === 0) {
      return {
        success: true,
        data: null,
      };
    }

    const item = result.data[0];

    const serverData: CompanyServerDataResponse = {
      customSdate: item.sdate_c || "",
      customEdate: item.edate_c || "",
      customCnt: item.cnt_c !== null && item.cnt_c !== undefined ? Number(item.cnt_c) : null,
      historySdate: item.sdate_m || "",
      historyEdate: item.edate_m || "",
      historyCnt: item.cnt_m !== null && item.cnt_m !== undefined ? Number(item.cnt_m) : null,
    };

    return {
      success: true,
      data: serverData,
    };
  }
}
