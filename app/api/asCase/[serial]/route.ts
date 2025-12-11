import { AsCaseProcedures } from "@/public/procedures/asCase";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(request: NextRequest, { params }: { params: Promise<{ serial: string }> }) {
    try {
        const { serial } = await params;

        const result = await AsCaseProcedures.getAsCaseView(serial);

        if (result.success) {
            const rawData = result.data as any[];

            if (!rawData || rawData.length === 0) {
                return NextResponse.json({
                    result: false,
                    data: null,
                    errMsg: "데이터를 찾을 수 없습니다.",
                });
            }

            const item = rawData[0];
            const transformedData = {
                serial: item.serial || "",
                prgCode: item.prgcode || "",
                prgName: item.prgname || "",
                asCode: item.ascode || "",
                asName: item.asname || "",
                writer: item.writer || "",
                subject: item.subject || "",
                question: item.question || "",
                answer: item.answer || "",
                visited: parseInt(item.visited?.toString() || "0"),
                fileName1: item.filename1 || "",
                fileSize1: item.fileSize1 || null,
                wdate: item.wdate || "",
            };

            return NextResponse.json({
                result: true,
                data: transformedData,
                errMsg: null,
            });
        } else {
            console.error("❌ 프로시저 실행 실패:", result.error);
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: result.error || "데이터 조회에 실패했습니다.",
            });
        }
    } catch (error) {
        console.error("💥 API 오류:", error);
        return NextResponse.json(
            {
                result: false,
                data: null,
                errMsg: "서버 오류가 발생했습니다.",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ serial: string }> }) {
    try {
        const { serial } = await params;

        // 파일 정보 조회
        const fileInfoResult = await AsCaseProcedures.getFileInfo(serial);
        let fileName = null;

        if (fileInfoResult.success && fileInfoResult.data) {
            const fileData = fileInfoResult.data as any[];
            fileName = fileData.length > 0 ? fileData[0].filename1 : null;
        }

        // 데이터베이스 레코드 삭제
        const result = await AsCaseProcedures.deleteAsCase(serial);

        if (result.success) {
            // 서버의 첨부 파일도 삭제
            if (fileName) {
                const filePath = path.join(process.cwd(), "public", "uploads", "Data", fileName);
                try {
                    await fs.unlink(filePath);
                } catch (error) {
                    console.error("파일 삭제 실패:", error);
                }
            }

            return NextResponse.json({
                result: true,
                data: result.data,
                errMsg: null,
            });
        } else {
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: result.error || "삭제에 실패했습니다.",
            });
        }
    } catch (error) {
        console.error("💥 API 오류:", error);
        return NextResponse.json(
            {
                result: false,
                data: null,
                errMsg: "서버 오류가 발생했습니다.",
            },
            { status: 500 }
        );
    }
}
