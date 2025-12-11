import { BaseProcedures, ProcedureResult } from "./index";
import { AsCaseItem } from "@/app/deptWorks/asCase/types/List";
import { AsCaseViewItem } from "@/app/deptWorks/asCase/types/View";

export class AsCaseProcedures extends BaseProcedures {
  // AS상담사례 목록 조회
  static async getAsCaseList(
    prgcode: string | null,
    keyword: string | null,
    pageNumber: number,
    pageSize: number
  ): Promise<ProcedureResult<AsCaseItem>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<AsCaseItem>("USP_CORE_EX_AS", [
      { name: "prgcode", type: sql.default.NVarChar(10), value: prgcode },
      { name: "keyword", type: sql.default.NVarChar(100), value: keyword },
      { name: "pageNumber", type: sql.default.Int, value: pageNumber },
      { name: "pageSize", type: sql.default.Int, value: pageSize },
    ]);
  }

  // AS상담사례 상세 조회
  static async getAsCaseView(serial: string): Promise<ProcedureResult<AsCaseViewItem>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<AsCaseViewItem>("USP_CORE_EX_AS", [
      { name: "serial", type: sql.default.Int, value: parseInt(serial) },
    ]);
  }

  // AS상담사례 작성/수정 (C# 처럼 하나의 프로시저 사용)
  static async createOrUpdateAsCase(
    serial: string | null,
    prgcode: string,
    ascode: string,
    writer: string,
    subject: string,
    question: string,
    answer: string,
    filename1: string | null
  ): Promise<ProcedureResult<any>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<any>("USP_CORE_EX_AS_C", [
      { name: "serial", type: sql.default.NVarChar(50), value: serial },
      { name: "prgcode", type: sql.default.NVarChar(10), value: prgcode },
      { name: "ascode", type: sql.default.NVarChar(10), value: ascode },
      { name: "writer", type: sql.default.NVarChar(50), value: writer },
      { name: "subject", type: sql.default.NVarChar(200), value: subject },
      { name: "question", type: sql.default.NVarChar(sql.default.MAX), value: question },
      { name: "answer", type: sql.default.NVarChar(sql.default.MAX), value: answer },
      { name: "filename1", type: sql.default.NVarChar(255), value: filename1 },
    ]);
  }

  // AS상담사례 삭제
  static async deleteAsCase(serial: string): Promise<ProcedureResult<any>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<any>("USP_CORE_EX_AS_D", [
      { name: "serial", type: sql.default.Int, value: parseInt(serial) },
    ]);
  }

  // 파일 정보 조회
  static async getFileInfo(serial: string): Promise<ProcedureResult<any>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<any>("USP_CORE_EX_AS_FILE", [
      { name: "serial", type: sql.default.Int, value: parseInt(serial) },
    ]);
  }

  // 파일 정보 업데이트 (삭제에 사용)
  static async updateFileInfo(serial: string, filename: string | null): Promise<ProcedureResult<any>> {
    if (typeof window !== "undefined") {
      throw new Error("This function can only be called on the server side");
    }

    const sql = await import("mssql");

    return this.executeProc<any>("USP_CORE_EX_AS_FILE_U", [
      { name: "serial", type: sql.default.Int, value: parseInt(serial) },
      { name: "filename", type: sql.default.NVarChar(255), value: filename },
    ]);
  }
}
