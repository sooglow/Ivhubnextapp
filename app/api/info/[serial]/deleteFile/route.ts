// app/api/info/[serial]/deleteFile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { InfoProcedures } from "@/public/procedures/info";
import { deleteFile } from "@/public/utils/fileUtils";

interface Props {
    params: Promise<{ serial: string }>;
}

export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const { serial } = await params;
        const { searchParams } = new URL(request.url);
        const fileNumber = parseInt(searchParams.get("fileNumber") || "0");

        const fileInfoResult = await InfoProcedures.getInfoView(serial);

        if (!fileInfoResult.success || !fileInfoResult.data || fileInfoResult.data.length === 0) {
            return NextResponse.json(
                {
                    result: false,
                    errMsg: "파일 정보를 찾을 수 없습니다.",
                },
                { status: 404 }
            );
        }

        const fileInfo = fileInfoResult.data[0];

        // 2. 삭제할 파일명 확인 (C#의 filePath 로직과 동일)
        const fileName = fileNumber === 0 ? fileInfo.filename1 : fileInfo.filename2;

        if (!fileName) {
            return NextResponse.json({
                result: false,
                errMsg: "삭제할 파일이 없습니다.",
            });
        }

        // 3. 물리적 파일 삭제 (C#의 File.Delete와 동일)
        try {
            await deleteFile(fileName);
        } catch (fileDeleteError) {
            console.warn("물리적 파일 삭제 실패:", fileDeleteError);
            // 파일이 없어도 데이터베이스는 업데이트
        }

        // 4. 데이터베이스 파일 정보 업데이트 (C#의 UpdateFileInfo와 동일)
        const updateResult = await InfoProcedures.updateFileInfo(serial, fileNumber, null, null);

        if (updateResult.success) {
            return NextResponse.json({
                result: true,
                errMsg: null,
            });
        } else {
            return NextResponse.json({
                result: false,
                errMsg: updateResult.error || "데이터베이스 업데이트 실패",
            });
        }
    } catch (error) {
        console.error("파일 삭제 API 에러:", error);
        return NextResponse.json(
            {
                result: false,
                errMsg: "파일 삭제 중 오류가 발생했습니다.",
            },
            { status: 500 }
        );
    }
}
