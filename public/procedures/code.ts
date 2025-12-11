import { CodeItem } from "@/app/shop/types/Code";
import { BaseProcedures, ProcedureResult } from "./index";

export class CodeProcedures extends BaseProcedures {
  // Code 목록 조회 프로시저
  static async getCodeList(kind: string, subCode: string | null = null): Promise<ProcedureResult<CodeItem>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<CodeItem>("USP_CORE_CODE", [
      { name: "Kind", type: sql.default.VarChar(50), value: kind },
      { name: "SubCode", type: sql.default.VarChar(50), value: subCode },
    ]);
  }
}
