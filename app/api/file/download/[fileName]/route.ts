// app/api/file/download/[fileName]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readFile, access } from "fs/promises";
import { constants } from "fs";
import path from "path";
import { getMimeType } from "@/public/utils/fileUtils";

interface Props {
    params: Promise<{ fileName: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
    try {
        const { fileName } = await params;
        const decodedFileName = decodeURIComponent(fileName);

        // Next.js 업로드 디렉토리
        const uploadDir = path.join(process.cwd(), "public", "uploads", "Data");
        const filePath = path.join(uploadDir, decodedFileName);

        // 파일 존재 확인
        await access(filePath, constants.F_OK);

        // 파일 읽기
        const fileBuffer = await readFile(filePath);
        const contentType = getMimeType(decodedFileName);

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(decodedFileName)}`,
                "Content-Length": fileBuffer.length.toString(),
                "Cache-Control": "no-cache",
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: "파일을 찾을 수 없습니다",
                fileName: (await params).fileName,
            },
            { status: 404 }
        );
    }
}
