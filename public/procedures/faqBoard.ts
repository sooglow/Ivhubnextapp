import { BaseProcedures, ProcedureResult } from "./index";
import { IvFaqItem } from "@/app/homePage/ivFaq/types/List";
import { IvFaqViewItem } from "@/app/homePage/ivFaq/types/View";

export class FaqBoardProcedures extends BaseProcedures {
  // FAQ 목록 조회
  static async getFaqBoardList(
    kind: string | null,
    keyword: string | null,
    pageNumber: number,
    pageSize: number
  ): Promise<ProcedureResult<IvFaqItem>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<IvFaqItem>("USP_CORE_IVFAQ", [
      { name: "kind", type: sql.default.NVarChar(50), value: kind },
      { name: "keyword", type: sql.default.NVarChar(100), value: keyword },
      { name: "pageNumber", type: sql.default.Int, value: pageNumber },
      { name: "pageSize", type: sql.default.Int, value: pageSize },
    ]);
  }

  // FAQ 상세 조회
  static async getFaqBoardView(serial: string): Promise<ProcedureResult<IvFaqViewItem>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<IvFaqViewItem>("USP_CORE_IVFAQ", [
      { name: "serial", type: sql.default.NVarChar(50), value: serial },
    ]);
  }

  // FAQ 작성/수정
  static async createOrUpdateFaqBoard(
    serial: string | null,
    kind: string,
    title: string,
    contents: string
  ): Promise<ProcedureResult<any>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProcWithOutput<any>("USP_CORE_IVFAQ_C", [
      { name: "serial", type: sql.default.NVarChar(50), value: serial },
      { name: "kind", type: sql.default.NVarChar(50), value: kind },
      { name: "title", type: sql.default.NVarChar(200), value: title },
      { name: "contents", type: sql.default.NVarChar(sql.default.MAX), value: contents },
    ]);
  }

  // FAQ 삭제
  static async deleteFaqBoard(serial: string): Promise<ProcedureResult<any>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProcWithOutput<any>("USP_CORE_IVFAQ_D", [
      { name: "serial", type: sql.default.NVarChar(50), value: serial },
    ]);
  }
}
