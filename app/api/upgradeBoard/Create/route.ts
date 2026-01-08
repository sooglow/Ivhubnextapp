import { UpgradeBoardProcedures } from "@/public/procedures/upgradeBoard";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { title, prgName, preView, link, writer } = body;

        // 유효성 검사
        if (!title || title.length < 5) {
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: "제목은 5자 이상 입력해 주세요.",
            });
        }

        if (!preView || preView.length < 10) {
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: "내용은 10자 이상 입력해 주세요.",
            });
        }

        if (!prgName || !writer) {
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: "필수 항목을 입력해 주세요.",
            });
        }

        const result = await UpgradeBoardProcedures.createOrUpdateUpgradeBoard(
            null, // serial이 null이면 신규 생성
            title,
            prgName,
            preView,
            link || "",
            writer
        );

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
