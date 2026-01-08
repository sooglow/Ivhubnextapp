import { BaseProcedures, ProcedureResult } from "./index";
import { IvInfoItem } from "@/app/homePage/ivInfo/types/List";
import { IvInfoViewItem } from "@/app/homePage/ivInfo/types/View";

export class IvBoardProcedures extends BaseProcedures {
  // 공지사항 목록 조회
  static async getIvBoardList(
    keyword: string | null,
    pageNumber: number,
    pageSize: number
  ): Promise<ProcedureResult<IvInfoItem>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<IvInfoItem>("USP_CORE_IVBOARD", [
      { name: "kind", type: sql.default.NVarChar(10), value: "info" },
      { name: "keyword", type: sql.default.NVarChar(100), value: keyword },
      { name: "pageNumber", type: sql.default.Int, value: pageNumber },
      { name: "pageSize", type: sql.default.Int, value: pageSize },
    ]);
  }

  // 공지사항 상세 조회
  static async getIvBoardView(serial: string): Promise<ProcedureResult<IvInfoViewItem>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<IvInfoViewItem>("USP_CORE_IVBOARD", [
      { name: "serial", type: sql.default.NVarChar(50), value: serial },
    ]);
  }

  // 공지사항 작성/수정
  static async createOrUpdateIvBoard(
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
    ]);
  }

  // 공지사항 삭제
  static async deleteIvBoard(serial: string): Promise<ProcedureResult<any>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProcWithOutput<any>("USP_CORE_IVBOARD_D", [
      { name: "serial", type: sql.default.NVarChar(50), value: serial },
    ]);
  }
}
