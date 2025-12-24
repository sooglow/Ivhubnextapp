import { FaqBoardProcedures } from "@/public/procedures/faqBoard";
import { NextRequest, NextResponse } from "next/server";

// 상세 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ serial: string }> }
) {
    try {
        const { serial } = await params;

        const result = await FaqBoardProcedures.getFaqBoardView(serial);

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
                title: item.title || "",
                kind: item.kind || "",
                update_dt: item.update_dt || "",
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

        const result = await FaqBoardProcedures.deleteFaqBoard(serial);

        if (result.success) {
            // OUTPUT 파라미터 체크 (프로시저에서 반환한 @errmsg)
            if (result.output && result.output.errmsg) {
                return NextResponse.json({
                    result: false,
                    data: null,
                    errMsg: result.output.errmsg,
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
