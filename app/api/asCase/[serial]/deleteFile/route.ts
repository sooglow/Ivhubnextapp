import { AsCaseProcedures } from "@/public/procedures/asCase";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { serial: string } }
) {
    try {
        const { serial } = params;
        const body = await request.json();
        const { fileNumber } = body;

        if (!serial || fileNumber === undefined) {
            return NextResponse.json(
                {
                    result: false,
                    data: null,
                    errMsg: "Serial과 fileNumber가 필요합니다.",
                },
                { status: 400 }
            );
        }

        // 파일 정보 조회
        const fileInfoResult = await AsCaseProcedures.getFileInfo(serial);

        if (!fileInfoResult.success || !fileInfoResult.data) {
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: "파일 정보를 찾을 수 없습니다.",
            });
        }

        const fileData = fileInfoResult.data as any[];
        const fileName = fileData.length > 0 ? fileData[0].filename1 : null;

        if (fileName) {
            // 실제 파일 삭제
            const filePath = path.join(process.cwd(), "public", "uploads", "Data", fileName);
            try {
                await fs.unlink(filePath);
            } catch (error) {
                console.error("파일 삭제 실패:", error);
            }
        }

        // DB에서 파일 정보 업데이트 (null로 설정)
        const result = await AsCaseProcedures.updateFileInfo(serial, null);

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
                errMsg: result.error || "파일 삭제에 실패했습니다.",
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
