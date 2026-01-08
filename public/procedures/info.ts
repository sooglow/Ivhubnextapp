import { InfoViewItem } from "@/app/info/info/types/View";
import { FileInfo, InfoEditRequest, InfoEditResponse } from "@/app/info/info/types/Edit";
import { BaseProcedures, ProcedureResult } from "./index";
import { InfoItem } from "@/app/info/info/types/List";
import { saveFile, validateFile } from "@/public/utils/fileUtils";

export class InfoProcedures extends BaseProcedures {
    //게시판 LIST에 사용되는 프로시저
    static async getInfoList(
        serial: string | null,
        userid: string,
        areacode: string | null,
        keyword: string | null,
        pageNumber: number,
        pageSize: number
    ): Promise<ProcedureResult<InfoItem>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        return this.executeProc<InfoItem>("USP_CORE_INFO", [
            { name: "serial", type: sql.default.VarChar(10), value: serial },
            { name: "userid", type: sql.default.VarChar(20), value: userid },
            { name: "areacode", type: sql.default.VarChar(5), value: areacode },
            { name: "keyword", type: sql.default.VarChar(100), value: keyword },
            { name: "pageNumber", type: sql.default.Int, value: pageNumber },
            { name: "pageSize", type: sql.default.Int, value: pageSize },
        ]);
    }
    //게시판 SELECT에 사용되는 프로시저
    static async getInfoView(
        serial: string,
        userid: string = "GUEST"
    ): Promise<ProcedureResult<InfoViewItem[]>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        try {
            const params = [
                { name: "serial", type: sql.default.VarChar(10), value: serial },
                { name: "userid", type: sql.default.VarChar(20), value: userid },
            ];

            const result = await this.executeProc<InfoViewItem[]>("USP_CORE_INFO", params);

            return result;
        } catch (error) {
            console.error("getInfoView 오류:", error);
            return {
                success: false,
                data: undefined,
                error: error instanceof Error ? error.message : "알 수 없는 오류",
            };
        }
    }

    //게시판 UPDATE에 사용되는 프로시저
    static async updateInfo(data: InfoEditRequest): Promise<ProcedureResult<InfoEditResponse>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        try {
            let filename1: string | null = null;
            let filesize1: number | null = null;
            let filename2: string | null = null;
            let filesize2: number | null = null;

            if (data.uploadedFile1 && data.uploadedFile1.size > 0) {
                // 파일 검증
                const validation1 = validateFile(data.uploadedFile1);
                if (!validation1.isValid) {
                    throw new Error(validation1.error);
                }

                // 파일 저장 (_fileService.SaveFile과 동일)
                const result1 = await saveFile(data.uploadedFile1);
                filename1 = result1.savedName;
                filesize1 = data.uploadedFile1.size;
            }

            if (data.uploadedFile2 && data.uploadedFile2.size > 0) {
                // 파일 검증
                const validation2 = validateFile(data.uploadedFile2);
                if (!validation2.isValid) {
                    throw new Error(validation2.error);
                }

                // 파일 저장
                const result2 = await saveFile(data.uploadedFile2);
                filename2 = result2.savedName;
                filesize2 = data.uploadedFile2.size;
            }

            // 프로시저 파라미터 구성
            const params = [
                { name: "serial", type: sql.default.VarChar(10), value: data.serial || "" },
                { name: "subject", type: sql.default.VarChar(80), value: data.subject || "" },
                { name: "writer", type: sql.default.VarChar(20), value: data.writer || "" },
                { name: "content", type: sql.default.Text, value: data.content || "" },
                { name: "ip", type: sql.default.VarChar(15), value: data.ip || "" },
                {
                    name: "filename1",
                    type: sql.default.VarChar(80),
                    value: filename1 || "",
                },
                {
                    name: "filesize1",
                    type: sql.default.VarChar(10),
                    value: filesize1?.toString() || "0",
                },
                {
                    name: "filename2",
                    type: sql.default.VarChar(80),
                    value: filename2 || "",
                },
                {
                    name: "filesize2",
                    type: sql.default.VarChar(10),
                    value: filesize2?.toString() || "0",
                },
                { name: "auth", type: sql.default.VarChar(1), value: data.auth || "" },
            ];

            // 프로시저 실행
            const result = await this.executeProc<InfoEditResponse>("USP_CORE_INFO_C", params);

            return result;
        } catch (error) {
            console.error("updateInfo 프로시저 오류:", error);
            return {
                success: false,
                data: undefined,
                error: error instanceof Error ? error.message : "알 수 없는 오류",
            };
        }
    }

    //게시판 INSERT에 사용되는 프로시저
    static async createInfo(data: InfoEditRequest): Promise<ProcedureResult<InfoEditResponse>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        return this.executeProc<InfoEditResponse>("USP_CORE_INFO_C", [
            { name: "serial", type: sql.default.VarChar(10), value: data.serial || "" },
            { name: "subject", type: sql.default.VarChar(80), value: data.subject },
            { name: "writer", type: sql.default.VarChar(20), value: data.writer },
            { name: "content", type: sql.default.Text, value: data.content },
            { name: "ip", type: sql.default.VarChar(15), value: data.ip || "" },
            { name: "filename1", type: sql.default.VarChar(80), value: data.filename1 || "" },
            {
                name: "filesize1",
                type: sql.default.VarChar(10),
                value: data.filesize1?.toString() || "",
            },
            { name: "filename2", type: sql.default.VarChar(80), value: data.filename2 || "" },
            {
                name: "filesize2",
                type: sql.default.VarChar(10),
                value: data.filesize2?.toString() || "",
            },
            { name: "auth", type: sql.default.VarChar(1), value: data.auth || "" },
        ]);
    }

    //첨부파일 SELECT에 사용되는 프로시저
    static async getFileInfo(serial: string): Promise<ProcedureResult<FileInfo>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        try {
            const params = [{ name: "serial", type: sql.default.VarChar(10), value: serial }];

            const result = await this.executeProc<FileInfo>("USP_CORE_INFO_FILE", params);

            return result;
        } catch (error) {
            console.error("getFileInfo 오류:", error);
            return {
                success: false,
                data: undefined,
                error: error instanceof Error ? error.message : "알 수 없는 오류",
            };
        }
    }

    //첨부파일 UPDATE에 사용되는 프로시저
    static async updateFileInfo(
        serial: string,
        fileNumber: number,
        filename: string | null,
        filesize: number | null
    ): Promise<ProcedureResult<void>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        try {
            const params = [
                { name: "serial", type: sql.default.VarChar(10), value: serial },
                { name: "fileNumber", type: sql.default.Int, value: fileNumber },
                {
                    name: "filename",
                    type: sql.default.VarChar(80),
                    value: filename ?? null,
                },
                {
                    name: "filesize",
                    type: sql.default.Int,
                    value: filesize ?? null,
                },
            ];

            const result = await this.executeProc<void>("USP_CORE_INFO_FILE_U", params);

            return result;
        } catch (error) {
            console.error("updateFileInfo 오류:", error);
            return {
                success: false,
                data: undefined,
                error: error instanceof Error ? error.message : "알 수 없는 오류",
            };
        }
    }

    //게시판 DELETE에 사용되는 프로시저
    static async deleteInfo(
        serial: string,
        userid: string,
        userPower: string
    ): Promise<ProcedureResult<void>> {
        if (typeof window !== "undefined") {
            throw new Error("This function can only be called on the server side");
        }

        const sql = await import("mssql");

        try {
            const params = [
                { name: "serial", type: sql.default.VarChar(10), value: serial },
                { name: "userid", type: sql.default.VarChar(20), value: userid },
                { name: "userPower", type: sql.default.VarChar(1), value: userPower },
            ];

            const result = await this.executeProc<void>("USP_CORE_INFO_D", params);

            return result;
        } catch (error) {
            console.error("deleteInfo 오류:", error);
            return {
                success: false,
                data: undefined,
                error: error instanceof Error ? error.message : "알 수 없는 오류",
            };
        }
    }
}
