import { NextRequest, NextResponse } from "next/server";
import { InfoProcedures } from "@/public/procedures/info";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const serial = formData.get("serial") as string;
        const subject = formData.get("subject") as string;
        const writer = formData.get("writer") as string;
        const content = formData.get("content") as string;
        const auth = formData.get("auth") as string;

        const uploadedFile1 = formData.get("uploadedFile1") as File | null;
        const uploadedFile2 = formData.get("uploadedFile2") as File | null;

        const ip = request.headers.get("x-forwarded-for")
            ? request.headers.get("x-forwarded-for")?.split(",")[0]
            : request.headers.get("x-real-ip") || "127.0.0.1";

        // 필수 필드 검증
        if (!serial) {
            return NextResponse.json(
                {
                    result: false,
                    errMsg: "Serial은 필수 항목입니다.",
                    errCode: "MISSING_SERIAL",
                },
                { status: 400 }
            );
        }

        if (!subject || !writer || !content) {
            return NextResponse.json(
                {
                    result: false,
                    errMsg: "필수 필드가 누락되었습니다.",
                    errCode: "MISSING_REQUIRED_FIELDS",
                },
                { status: 400 }
            );
        }
        const updateData = {
            serial: serial,
            subject: subject,
            writer: writer,
            content: content,
            auth: auth || "",
            ip: ip,

            uploadedFile1: uploadedFile1,
            uploadedFile2: uploadedFile2,
        };

        // 프로시저 호출 (파일 처리 포함)
        const result = await InfoProcedures.updateInfo(updateData);

        if (result.success) {
            return NextResponse.json({
                result: true,
                errMsg: null,
                errCode: null,
            });
        } else {
            return NextResponse.json({
                result: false,
                errMsg: result.error || "수정에 실패했습니다.",
                errCode: "UPDATE_FAILED",
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
