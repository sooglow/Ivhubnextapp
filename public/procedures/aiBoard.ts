import { BaseProcedures, ProcedureResult } from "./index";
import { IvAiItem } from "@/app/homePage/ivAi/types/List";
import { IvAiViewItem } from "@/app/homePage/ivAi/types/View";

export class AiBoardProcedures extends BaseProcedures {
  // AI 게시판 목록 조회
  static async getAiBoardList(
    keyword: string | null,
    pageNumber: number,
    pageSize: number
  ): Promise<ProcedureResult<IvAiItem>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<IvAiItem>("USP_CORE_IVBOARD", [
      { name: "kind", type: sql.default.NVarChar(10), value: "ai" },
      { name: "keyword", type: sql.default.NVarChar(100), value: keyword },
      { name: "pageNumber", type: sql.default.Int, value: pageNumber },
      { name: "pageSize", type: sql.default.Int, value: pageSize },
    ]);
  }

  // AI 게시판 상세 조회
  static async getAiBoardView(serial: string): Promise<ProcedureResult<IvAiViewItem>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<IvAiViewItem>("USP_CORE_IVBOARD", [
      { name: "serial", type: sql.default.NVarChar(50), value: serial },
    ]);
  }

  // AI 게시판 작성/수정
  static async createOrUpdateAiBoard(
    serial: string | null,
    subject: string,
    writer: string,
    ip: string,
    contents: string
  ): Promise<ProcedureResult<any>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProcWithOutput<any>("USP_CORE_IVBOARD_C", [
      { name: "serial", type: sql.default.NVarChar(50), value: serial },
      { name: "subject", type: sql.default.NVarChar(200), value: subject },
      { name: "writer", type: sql.default.NVarChar(50), value: writer },
      { name: "ip", type: sql.default.NVarChar(50), value: ip },
      { name: "contents", type: sql.default.NVarChar(sql.default.MAX), value: contents },
      { name: "kind", type: sql.default.NVarChar(10), value: "ai" },
    ]);
  }

  // AI 게시판 삭제
  static async deleteAiBoard(serial: string): Promise<ProcedureResult<any>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProcWithOutput<any>("USP_CORE_IVBOARD_D", [
      { name: "serial", type: sql.default.NVarChar(50), value: serial },
    ]);
  }
}
