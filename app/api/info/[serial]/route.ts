import { NextRequest, NextResponse } from "next/server";
import { InfoProcedures } from "@/public/procedures/info";
import { InfoViewItem } from "@/app/info/info/types/View";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ serial: string }> }
) {
    try {
        const { searchParams } = new URL(request.url);

        const resolvedParams = await params;
        const serial = resolvedParams.serial;

        const userid = searchParams.get("userid") || "GUEST";

        if (!serial) {
            return NextResponse.json(
                {
                    result: false,
                    data: null,
                    errMsg: "Serial 파라미터가 필요합니다.",
                },
                { status: 400 }
            );
        }

        const result = await InfoProcedures.getInfoView(serial, userid);

        if (result.success) {
            const rawData = (result.data as InfoViewItem[]) || [];

            if (rawData.length === 0) {
                return NextResponse.json({
                    result: false,
                    data: null,
                    errMsg: "해당 정보를 찾을 수 없습니다.",
                });
            }

            const item = rawData[0];

            const transformedData = {
                serial: item.serial?.toString() || "",
                subject: item.subject?.toString() || "",
                writer: item.writer?.toString() || "",
                visited: parseInt(item.visited?.toString() || "0"),
                wdate:
                    item.wdate instanceof Date
                        ? item.wdate.toISOString().slice(0, 19).replace("T", " ")
                        : item.wdate?.toString() || "",
                filename1: item.filename1?.toString() || "",
                filename2: item.filename2?.toString() || "",
                filesize1: item.filesize1 ? parseInt(item.filesize1.toString()) : 0,
                filesize2: item.filesize2 ? parseInt(item.filesize2.toString()) : 0,
                content: item.content?.toString() || "",
                auth: item.auth?.toString() || "",
            };

            return NextResponse.json({
                result: true,
                data: transformedData,
                errMsg: null,
            });
        } else {
            return NextResponse.json({
                result: false,
                data: null,
                errMsg: result.error || "데이터 조회에 실패했습니다.",
            });
        }
    } catch (error) {
        console.error("Info View API Error:", error);
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
