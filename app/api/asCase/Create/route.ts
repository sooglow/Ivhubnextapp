import { AsCaseProcedures } from "@/public/procedures/asCase";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const prgCode = formData.get("PrgCode") as string;
        const asCode = formData.get("AsCode") as string;
        const writer = formData.get("Writer") as string;
        const subject = formData.get("Subject") as string;
        const question = formData.get("Question") as string;
        const answer = formData.get("Answer") as string;
        const uploadedFile1 = formData.get("uploadedFile1") as File | null;

        let fileName1: string | null = null;

        // 파일 업로드 처리
        if (uploadedFile1 && uploadedFile1.size > 0) {
            const buffer = Buffer.from(await uploadedFile1.arrayBuffer());
            const fileExtension = path.extname(uploadedFile1.name);
            const fileNameWithoutExt = path.basename(uploadedFile1.name, fileExtension);

            const uploadDir = path.join(process.cwd(), "public", "uploads", "Data");
            await fs.mkdir(uploadDir, { recursive: true });

            // 중복 파일명 체크 및 번호 붙이기
            let finalFileName = uploadedFile1.name;
            let counter = 1;

            while (
                await fs
                    .access(path.join(uploadDir, finalFileName))
                    .then(() => true)
                    .catch(() => false)
            ) {
                finalFileName = `${fileNameWithoutExt} (${counter})${fileExtension}`;
                counter++;
            }

            fileName1 = finalFileName;
            const filePath = path.join(uploadDir, fileName1);
            await fs.writeFile(filePath, buffer);
        }

        const result = await AsCaseProcedures.createOrUpdateAsCase(
            null,
            prgCode,
            asCode,
            writer,
            subject,
            question,
            answer,
            fileName1
        );

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
