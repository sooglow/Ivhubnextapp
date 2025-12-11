import { AsCaseProcedures } from "@/public/procedures/asCase";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { serial } = body;

        if (!serial) {
            return NextResponse.json(
                {
                    result: false,
                    data: null,
                    errMsg: "Serial이 필요합니다.",
                },
                { status: 400 }
            );
        }

        const result = await AsCaseProcedures.deleteAsCase(serial);

        if (result.success) {
            return NextResponse.json({
                result: true,
                data: result.data,
                errMsg: null,
            });
        } else {
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
