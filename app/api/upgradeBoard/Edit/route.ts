import { UpgradeBoardProcedures } from "@/public/procedures/upgradeBoard";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { serial, title, prgName, preView, link, writer } = body;

        // 유효성 검사
        if (!serial) {
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: "Serial is required",
            });
        }

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

        if (preView.length > 200) {
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: "내용은 200자 이내로 입력해 주세요.",
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
            serial,
            title,
            prgName,
            preView,
            link || "",
            writer
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
