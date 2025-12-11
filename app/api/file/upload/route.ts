// app/api/file/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { saveFile, validateFile } from "@/public/utils/fileUtils";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file || file.size === 0) {
            return NextResponse.json(
                {
                    result: false,
                    errMsg: "파일이 선택되지 않았습니다.",
                },
                { status: 400 }
            );
        }

        // 파일 검증
        const validation = validateFile(file);
        if (!validation.isValid) {
            return NextResponse.json(
                {
                    result: false,
                    errMsg: validation.error,
                },
                { status: 400 }
            );
        }

        // 파일 저장
        const result = await saveFile(file);

        // 다운로드 URL 생성
        const fileUrl = `${request.nextUrl.protocol}//${
            request.nextUrl.host
        }/api/file/download/${encodeURIComponent(result.savedName)}`;

        return NextResponse.json({
            result: true,
            fileUrl: fileUrl,
            fileName: result.savedName,
            originalName: result.originalName,
            size: result.size,
        });
    } catch (error) {
        console.error("파일 업로드 에러:", error);
        return NextResponse.json(
            {
                result: false,
                errMsg: "파일 업로드 중 오류가 발생했습니다.",
            },
            { status: 500 }
        );
    }
}
