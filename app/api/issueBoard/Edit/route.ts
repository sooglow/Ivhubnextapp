import { IssueBoardProcedures } from "@/public/procedures/issueBoard";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { serial, title, writer, link } = body;

        // 유효성 검사
        if (!serial) {
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: "시리얼 번호가 필요합니다.",
            });
        }

        if (!title || title.length < 5) {
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: "제목은 5자 이상 입력해 주세요.",
            });
        }

        if (!link || link.length < 10) {
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: "링크는 10자 이상 입력해 주세요.",
            });
        }

        const result = await IssueBoardProcedures.createOrUpdateIssueBoard(
            serial, // serial이 있으면 수정
            title,
            writer,
            link
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
                errMsg: result.error || "수정에 실패했습니다.",
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
