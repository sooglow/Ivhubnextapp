import { AsCaseProcedures } from "@/public/procedures/asCase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const prgcodeParam = searchParams.get("prgcode");
        const prgcode = prgcodeParam === null || prgcodeParam.trim() === "" ? null : prgcodeParam.trim();

        const keywordParam = searchParams.get("keyword");
        const keyword = keywordParam === null || keywordParam.trim() === "" ? null : keywordParam.trim();

        const pageNumber = parseInt(searchParams.get("pageNumber") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "10");

        const result = await AsCaseProcedures.getAsCaseList(
            prgcode,
            keyword,
            pageNumber,
            pageSize
        );

        if (result.success) {
            const rawData = (result.data as any[]) || [];

            const transformedData = rawData.map((item: any) => ({
                RowNumber: item.RowNumber,
                serial: item.serial || "",
                prgCode: item.prgcode || "",
                prgName: item.prgname || "",
                asCode: item.ascode || "",
                asName: item.asname || "",
                writer: item.writer || "",
                subject: item.subject || "",
                visited: parseInt(item.visited?.toString() || "0"),
                fileName1: item.filename1 || "",
                fileSize1: item.fileSize1 || null,
                wdate: item.wdate || "",
            }));

            const totalCount = rawData.length > 0 ? rawData[0].TotalCount : 0;

            return NextResponse.json({
                result: true,
                data: {
                    items: transformedData,
                    totalCount: totalCount,
                },
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
