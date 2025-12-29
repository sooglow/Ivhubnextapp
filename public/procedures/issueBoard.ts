import { BaseProcedures, ProcedureResult } from "./index";
import { IvIssueItem } from "@/app/homePage/ivIssue/types/List";
import { IvIssueViewItem } from "@/app/homePage/ivIssue/types/View";

export class IssueBoardProcedures extends BaseProcedures {
  // 업계 이슈 목록 조회
  static async getIssueBoardList(
    keyword: string | null,
    pageNumber: number,
    pageSize: number
  ): Promise<ProcedureResult<IvIssueItem>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<IvIssueItem>("USP_CORE_IV_LINK", [
      { name: "kind", type: sql.default.NVarChar(10), value: "news" },
      { name: "keyword", type: sql.default.NVarChar(100), value: keyword },
      { name: "pageNumber", type: sql.default.Int, value: pageNumber },
      { name: "pageSize", type: sql.default.Int, value: pageSize },
    ]);
  }

  // 업계 이슈 상세 조회
  static async getIssueBoardView(serial: string): Promise<ProcedureResult<IvIssueViewItem>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<IvIssueViewItem>("USP_CORE_IV_LINK", [
      { name: "serial", type: sql.default.NVarChar(50), value: serial },
    ]);
  }

  // 업계 이슈 작성/수정
  static async createOrUpdateIssueBoard(
    serial: string | null,
    title: string,
    writer: string,
    link: string
  ): Promise<ProcedureResult<any>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProcWithOutput<any>("USP_CORE_IV_LINK_C", [
      { name: "serial", type: sql.default.NVarChar(50), value: serial },
      { name: "kind", type: sql.default.NVarChar(10), value: "news" },
      { name: "title", type: sql.default.NVarChar(200), value: title },
      { name: "prgname", type: sql.default.NVarChar(100), value: null },
      { name: "preview", type: sql.default.NVarChar(sql.default.MAX), value: null },
      { name: "link", type: sql.default.NVarChar(500), value: link },
      { name: "writer", type: sql.default.NVarChar(50), value: writer },
    ]);
  }

  // 업계 이슈 삭제
  static async deleteIssueBoard(serial: string): Promise<ProcedureResult<any>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProcWithOutput<any>("USP_CORE_IV_LINK_D", [
      { name: "serial", type: sql.default.NVarChar(50), value: serial },
    ]);
  }
}
