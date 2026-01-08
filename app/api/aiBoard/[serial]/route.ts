import { AiBoardProcedures } from "@/public/procedures/aiBoard";
import { NextRequest, NextResponse } from "next/server";

// 상세 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ serial: string }> }
) {
    try {
        const { serial } = await params;

        const result = await AiBoardProcedures.getAiBoardView(serial);

        if (result.success) {
            const rawData = (result.data as any[]) || [];

            if (rawData.length === 0) {
                return NextResponse.json({
                    result: false,
                    data: null,
                    errMsg: "데이터를 찾을 수 없습니다.",
                });
            }

            const item = rawData[0];

            const transformedData = {
                serial: item.serial || "",
                subject: item.subject || "",
                writer: item.writer || "",
                visited: parseInt(item.visited?.toString() || "0"),
                wdate: item.wdate || "",
                contents: item.contents || "",
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

// 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ serial: string }> }
) {
    try {
        const { serial } = await params;

        const result = await AiBoardProcedures.deleteAiBoard(serial);

        if (result.success) {
            // OUTPUT 파라미터 체크 (프로시저에서 반환한 @errmsg)
            const output = (result as any).output;
            if (output && output.errmsg) {
                return NextResponse.json({
                    result: false,
                    data: null,
                    errMsg: output.errmsg,
                });
            }

            return NextResponse.json({
                result: true,
                data: null,
                errMsg: null,
            });
        } else {
            console.error("❌ 프로시저 실행 실패:", result.error);
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
