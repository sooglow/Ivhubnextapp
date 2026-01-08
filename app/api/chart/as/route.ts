import { AsAnalyticsProcedures } from "@/public/procedures/asAnalytics";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const sday = searchParams.get("Sday") || "";
        const eday = searchParams.get("Eday") || "";

        if (!sday || !eday) {
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: "시작일과 종료일을 입력해 주세요.",
            });
        }

        const result = await AsAnalyticsProcedures.getAsChartData(sday, eday);

        if (result.success) {
            return NextResponse.json({
                result: true,
                data: result.data,
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
