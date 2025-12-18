// lib/procedures/index.ts
import { getConnection } from "@/public/server/database";

// 프로시저 파라미터 타입 정의 (이름, 타입, 값)
export interface ProcedureParam {
    name: string;   // 파라미터 이름
    type: any;      // SQL 데이터 타입 (예: sql.VarChar, sql.Int)
    value: any;     // 전달할 값
}

// 프로시저 실행 결과 타입 정의
export interface ProcedureResult<T = any> {
    success: boolean;       // 성공 여부
    data?: T[];            // 조회된 데이터 (recordset)
    rowsAffected?: number[]; // 영향받은 행 수
    error?: string;        // 에러 메시지
}

// 프로시저 실행을 위한 기본 클래스
export class BaseProcedures {
    /**
     * 기본 프로시저 실행 (단일 결과셋, OUTPUT 파라미터 없음)
     * @param procName 프로시저 이름
     * @param params INPUT 파라미터 배열
     * @returns 실행 결과 (data, rowsAffected)
     */
    static async executeProc<T = any>(
        procName: string,
        params: ProcedureParam[] = []
    ): Promise<ProcedureResult<T>> {
        try {
            const pool = await getConnection();
            const request = pool.request();

            // 모든 INPUT 파라미터 추가
            params.forEach((param) => {
                request.input(param.name, param.type, param.value);
            });

            const result = await request.execute(procName);
            return {
                success: true,
                data: result.recordset,
                rowsAffected: result.rowsAffected,
            };
        } catch (error) {
            console.error(`Error executing ${procName}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    /**
     * 다중 결과셋 프로시저 실행 (여러 SELECT 결과 반환)
     * @param procName 프로시저 이름
     * @param params INPUT 파라미터 배열
     * @returns 여러 개의 recordsets 배열
     */
    static async executeProcMultipleResultSets(
        procName: string,
        params: ProcedureParam[] = []
    ): Promise<any> {
        try {
            const pool = await getConnection();
            const request = pool.request();

            params.forEach((param) => {
                request.input(param.name, param.type, param.value);
            });

            const result = await request.execute(procName);
            return {
                success: true,
                recordsets: result.recordsets, // 여러 개의 결과셋
                rowsAffected: result.rowsAffected,
            };
        } catch (error) {
            console.error(`Error executing ${procName}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    /**
     * OUTPUT 파라미터가 있는 프로시저 실행 (생성/수정/삭제 작업)
     * @param procName 프로시저 이름
     * @param params INPUT 파라미터 배열
     * @returns 실행 결과 + OUTPUT 파라미터 (@errmsg)
     */
    static async executeProcWithOutput<T = any>(
        procName: string,
        params: ProcedureParam[] = []
    ): Promise<{ success: boolean; data?: T[]; output?: any; error?: string }> {
        try {
            const pool = await getConnection();
            const request = pool.request();
            const sql = await import("mssql");

            // OUTPUT 파라미터 추가 (프로시저에서 에러 메시지 반환용)
            request.output("errmsg", sql.default.VarChar(100));

            // 모든 INPUT 파라미터 추가
            params.forEach((param) => {
                request.input(param.name, param.type, param.value);
            });

            const result = await request.execute(procName);
            return {
                success: true,
                data: result.recordset,
                output: result.output, // { errmsg: "..." } 형태로 반환
            };
        } catch (error) {
            console.error(`Error executing ${procName}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}
