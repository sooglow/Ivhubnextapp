import { InfoProcedures } from "@/public/procedures/info";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // 파라미터 받기 및 처리
        const keywordParam = searchParams.get("keyword");
        const keyword =
            keywordParam === null || keywordParam.trim() === "" ? null : keywordParam.trim();

        const useridParam = searchParams.get("userid");
        const userid =
            useridParam === null || useridParam.trim() === "" ? "GUEST" : useridParam.trim();

        const areacodeParam = searchParams.get("areacode");
        const areacode =
            areacodeParam === null || areacodeParam.trim() === "" ? null : areacodeParam.trim();

        const pageNumber = parseInt(searchParams.get("pageNumber") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "10");

        const result = await InfoProcedures.getInfoList(
            null,
            userid,
            areacode,
            keyword,
            pageNumber,
            pageSize
        );

        if (result.success) {
            const rawData = (result.data as any[]) || [];

            const transformedData = rawData.map((item: any) => ({
                RowNumber: item.RowNumber,
                checkBoard: item.checkBoard || true,
                serial: item.serial || "",
                writer: item.writer || "",
                subject: item.subject || "",
                visited: parseInt(item.visited?.toString() || "0"),
                fileName1: item.fileName1 || "",
                fileName2: item.fileName2 || "",
                fileSize1: item.fileSize1 || null,
                fileSize2: item.fileSize2 || null,
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
