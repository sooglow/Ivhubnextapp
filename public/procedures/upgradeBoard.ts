import { BaseProcedures, ProcedureResult } from "./index";

export class UpgradeBoardProcedures extends BaseProcedures {
  // 신규기능소개 목록 조회
  static async getUpgradeBoardList(
    keyword: string | null,
    pageNumber: number,
    pageSize: number
  ): Promise<ProcedureResult<any>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<any>("USP_CORE_IV_LINK", [
      { name: "kind", type: sql.default.NVarChar(10), value: "upgrade" },
      { name: "keyword", type: sql.default.NVarChar(100), value: keyword },
      { name: "pageNumber", type: sql.default.Int, value: pageNumber },
      { name: "pageSize", type: sql.default.Int, value: pageSize },
    ]);
  }

  // 신규기능소개 상세 조회
  static async getUpgradeBoardView(serial: string): Promise<ProcedureResult<any>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<any>("USP_CORE_IV_LINK", [
      { name: "serial", type: sql.default.NVarChar(50), value: serial },
    ]);
  }

  // 신규기능소개 작성/수정
  static async createOrUpdateUpgradeBoard(
    serial: string | null,
    title: string,
    prgName: string,
    preView: string,
    link: string,
    writer: string
  ): Promise<ProcedureResult<any>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProcWithOutput<any>("USP_CORE_IV_LINK_C", [
      { name: "serial", type: sql.default.NVarChar(50), value: serial },
      { name: "kind", type: sql.default.NVarChar(10), value: "upgrade" },
      { name: "title", type: sql.default.NVarChar(200), value: title },
      { name: "prgname", type: sql.default.NVarChar(100), value: prgName },
      { name: "preview", type: sql.default.NVarChar(sql.default.MAX), value: preView },
      { name: "link", type: sql.default.NVarChar(500), value: link },
      { name: "writer", type: sql.default.NVarChar(50), value: writer },
    ]);
  }

  // 신규기능소개 삭제
  static async deleteUpgradeBoard(serial: string): Promise<ProcedureResult<any>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProcWithOutput<any>("USP_CORE_IV_LINK_D", [
      { name: "serial", type: sql.default.NVarChar(50), value: serial },
    ]);
  }
}
