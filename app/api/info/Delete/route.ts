import { NextRequest, NextResponse } from "next/server";
import { InfoProcedures } from "@/public/procedures/info";

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const serial = searchParams.get("serial");
        const userid = searchParams.get("userid");
        const userPower = searchParams.get("userPower");

        // 필수 필드 검증
        if (!serial || !userid || !userPower) {
            return NextResponse.json(
                {
                    result: false,
                    errMsg: "필수 필드가 누락되었습니다.",
                    errCode: "MISSING_REQUIRED_FIELDS",
                },
                { status: 400 }
            );
        }

        // 프로시저 호출
        const result = await InfoProcedures.deleteInfo(serial, userid, userPower);

        if (result.success) {
            return NextResponse.json({
                result: true,
                errMsg: null,
                errCode: null,
            });
        } else {
            return NextResponse.json({
                result: false,
                errMsg: result.error || "삭제에 실패했습니다.",
                errCode: "DELETE_FAILED",
            });
        }
    } catch (error) {
        return NextResponse.json(
            {
                result: false,
                errMsg: "서버 오류가 발생했습니다.",
                errCode: "SERVER_ERROR",
            },
            { status: 500 }
        );
    }
}
