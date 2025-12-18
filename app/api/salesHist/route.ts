import { NextRequest, NextResponse } from "next/server";
import { SalesHistProcedures } from "@/public/procedures/salesHist";
import { parseJWT } from "@/public/utils/utils";

// GET: 영업문의 최근 50개 목록 조회
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
            return NextResponse.json(
                { result: false, errMsg: "인증이 필요합니다." },
                { status: 401 }
            );
        }

        const userInfo = parseJWT(token);
        const userId = userInfo?.userId;

        if (!userId) {
            return NextResponse.json(
                { result: false, errMsg: "사용자 정보를 찾을 수 없습니다." },
                { status: 401 }
            );
        }

        const result = await SalesHistProcedures.getSalesInquiryList(userId);

        if (result.success) {
            const items = result.data || [];

            // DB 필드명(소문자) → camelCase 변환
            const mappedItems = items.map((item: any) => ({
                salesSerial: item.salesserial,
                callDay: item.callday,
                prgName: item.prgname,
                comName: item.comname,
                comCode: item.comcode,
                comTel: item.comtel,
                area: item.area,
                areaName: item.areaname,
                salesMan: item.salesman,
                salesType: item.salestype,
                salesState: item.salesstate,
                salesDescr: item.salesdescr,
                headOpin: item.headopin,
                salesArea: item.salesarea,
            }));

            return NextResponse.json({
                result: true,
                data: { items: mappedItems },
            });
        } else {
            return NextResponse.json({ result: false, errMsg: result.error }, { status: 500 });
        }
    } catch (error: any) {
        console.error("SalesHist list error:", error);
        return NextResponse.json({ result: false, errMsg: error.message }, { status: 500 });
    }
}
