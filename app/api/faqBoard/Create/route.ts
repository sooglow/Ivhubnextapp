import { FaqBoardProcedures } from "@/public/procedures/faqBoard";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { kind, title, contents } = body;

        // 유효성 검사
        if (!kind) {
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: "구분을 선택해 주세요.",
            });
        }

        if (!title || title.length < 5) {
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: "제목은 5자 이상 입력해 주세요.",
            });
        }

        if (!contents || contents.length < 10) {
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: "내용은 10자 이상 입력해 주세요.",
            });
        }

        const result = await FaqBoardProcedures.createOrUpdateFaqBoard(
            null, // serial이 null이면 신규 생성
            kind,
            title,
            contents
        );

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
                errMsg: result.error || "저장에 실패했습니다.",
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
