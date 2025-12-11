// lib/procedures/index.ts
import { getConnection } from "@/public/server/database";

export interface ProcedureParam {
    name: string;
    type: any;
    value: any;
}

export interface ProcedureResult<T = any> {
    success: boolean;
    data?: T[];
    rowsAffected?: number[];
    error?: string;
}

export class BaseProcedures {
    static async executeProc<T = any>(
        procName: string,
        params: ProcedureParam[] = []
    ): Promise<ProcedureResult<T>> {
        try {
            const pool = await getConnection();
            const request = pool.request();

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
                recordsets: result.recordsets,
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
}
