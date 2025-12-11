import { SolutionInfoItem } from "@/app/info/solutionInfo/types/List";
import {
    SolutionInfoUpdateRequest,
    SolutionInfoEditItem,
} from "@/app/info/solutionInfo/types/Edit";
import { SolutionInfoCreateRequest } from "@/app/info/solutionInfo/types/Create";
import { BaseProcedures, ProcedureResult } from "./index";
import { getConnection } from "@/public/server/database";

export class SolutionProcedures extends BaseProcedures {
    static async getSolutionInfoList(
        keyword: string | null,
        pageNumber: number,
        pageSize: number
    ): Promise<ProcedureResult<SolutionInfoItem>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        return this.executeProc<SolutionInfoItem>("USP_CORE_SOLUTION_INFO", [
            { name: "keyword", type: sql.default.VarChar(100), value: keyword },
            { name: "pageNumber", type: sql.default.Int, value: pageNumber },
            { name: "pageSize", type: sql.default.Int, value: pageSize },
        ]);
    }

    static async getSolutionInfoDetail(
        num: string
    ): Promise<ProcedureResult<SolutionInfoEditItem>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        return this.executeProc<SolutionInfoEditItem>("USP_CORE_SOLUTION_INFO", [
            { name: "num", type: sql.default.VarChar(50), value: num },
        ]);
    }

    //솔루션 공지사항 수정 프로시저
    static async updateSolutionInfo(
        data: SolutionInfoUpdateRequest
    ): Promise<ProcedureResult<any>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        return this.executeProc<any>("USP_CORE_SOLUTION_INFO_U", [
            { name: "num", type: sql.default.Int, value: data.num },
            { name: "sday", type: sql.default.SmallDateTime, value: data.sday },
            { name: "eday", type: sql.default.SmallDateTime, value: data.eday },
            { name: "subject", type: sql.default.NVarChar(200), value: data.subject },
            { name: "memo", type: sql.default.NVarChar(500), value: data.memo },
            { name: "solution", type: sql.default.VarChar(50), value: data.solution },
        ]);
    }

    //솔루션 공지사항 삭제 프로시저
    static async deleteSolutionInfo(num: string): Promise<ProcedureResult<any>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        return this.executeProc<any>("USP_CORE_SOLUTION_INFO_D", [
            { name: "num", type: sql.default.VarChar(50), value: num },
        ]);
    }

    //솔루션 공지사항 작성 프로시저
    static async createSolutionInfo(
        data: SolutionInfoCreateRequest
    ): Promise<ProcedureResult<any>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");
        const pool = await getConnection();

        try {
            let filename = data.filename || null;

            // 파일 저장 처리 (files 배열) - solutionInfo 폴더에 저장
            if (data.files && data.files.length > 0) {
                const { saveFiles } = await import("@/public/utils/fileUtils");
                const savedFiles = await saveFiles(data.files, "solutionInfo");
                // 여러 파일명을 쉼표로 구분하여 저장
                filename = savedFiles.map((f) => f.savedName).join(",");
            }

            // xlsFile 저장 처리 - solutionInfo 폴더에 저장
            if (data.xlsFile) {
                const { saveFile } = await import("@/public/utils/fileUtils");
                const savedXlsFile = await saveFile(data.xlsFile, "solutionInfo");
                // filename이 이미 있으면 추가, 없으면 설정
                filename = filename
                    ? `${filename},${savedXlsFile.savedName}`
                    : savedXlsFile.savedName;
            }

            // 트랜잭션 시작
            const transaction = pool.transaction();
            await transaction.begin();

            try {
                // 1. 공지사항 생성
                const request = transaction.request();
                request.input("sday", sql.default.SmallDateTime, data.sday);
                request.input("eday", sql.default.SmallDateTime, data.eday);
                request.input("filename", sql.default.VarChar(500), filename);
                request.input("solutions", sql.default.VarChar(100), data.solutions);
                request.input("subject", sql.default.VarChar(100), data.subject);

                const result = await request.execute("USP_CORE_SOLUTION_INFO_C");

                // 생성된 num(ID) 가져오기
                const nums: number[] = [];
                if (result.recordset && result.recordset.length > 0) {
                    result.recordset.forEach((record: any) => {
                        nums.push(record.num || record[Object.keys(record)[0]]);
                    });
                }

                // 2. xlsFile이 있으면 업체코드 등록
                if (data.xlsFile && nums.length > 0) {
                    await this.insertSolutionInfoComcode(
                        transaction,
                        data.xlsFile,
                        nums,
                        data.memo || ""
                    );
                }

                await transaction.commit();

                return {
                    success: true,
                    data: { nums },
                    error: undefined,
                };
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        } catch (error) {
            console.error("createSolutionInfo 프로시저 오류:", error);
            return {
                success: false,
                data: undefined,
                error: error instanceof Error ? error.message : "알 수 없는 오류",
            };
        }
    }

    // 엑셀 파일에서 업체코드 추출 후 int_solution_info_comcode 테이블에 삽입
    static async insertSolutionInfoComcode(
        transaction: any,
        xlsFile: File,
        nums: number[],
        memo: string
    ): Promise<void> {
        try {
            // 엑셀 파일 읽기
            const xlsx = await import("xlsx");
            const buffer = await xlsFile.arrayBuffer();
            const workbook = xlsx.read(buffer, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

            // 업체코드 추출 (첫 번째 컬럼)
            const comcodes: string[] = [];
            for (const row of jsonData) {
                const comcode = row[0]?.toString().trim();
                if (comcode) {
                    comcodes.push(comcode);
                }
            }

            // int_solution_info_comcode 테이블에 삽입
            for (const num of nums) {
                for (const comcode of comcodes) {
                    const request = transaction.request();
                    await request.query(`
            INSERT INTO int_solution_info_comcode (INFO_NUM, COMCODE, MEMO)
            VALUES (${num}, '${comcode}', N'${memo}')
          `);
                }
            }
        } catch (error) {
            console.error("insertSolutionInfoComcode 오류:", error);
            throw error;
        }
    }
}
