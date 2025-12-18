import { NextRequest, NextResponse } from "next/server";
import { SalesHistProcedures } from "@/public/procedures/salesHist";
import { parseJWT } from "@/public/utils/utils";

// GET: 영업활동 목록 조회 (납품 또는 영업활동)
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
        const searchParams = request.nextUrl.searchParams;

        const areaCode = searchParams.get("AreaCode") || userInfo?.areaCode || "";
        const userId = searchParams.get("UserId") || userInfo?.userId || "";
        const saleDay1 = searchParams.get("SaleDay1") || "";
        const saleDay2 = searchParams.get("SaleDay2") || "";
        const keyword = searchParams.get("Keyword") || "";
        const stateName = searchParams.get("StateName") || "납품";
        const pageNumber = parseInt(searchParams.get("PageNumber") || "1");
        const pageSize = parseInt(searchParams.get("PageSize") || "3");

        const result = await SalesHistProcedures.getSalesActivityList({
            areaCode,
            userId,
            saleDay1,
            saleDay2,
            keyword,
            stateName: stateName as "납품" | "영업활동",
            pageNumber,
            pageSize,
        });

        if (result.success) {
            const items = result.data || [];
            // DB 필드명(소문자 + 언더스코어) → camelCase 변환
            const mappedItems = items.map((item: any) => ({
                actSerial: item.act_serial,
                actSeqNo: item.act_seqno,
                userId: item.userid,
                saleDay: item.saleday,
                salesMan: item.salesman,
                prgCode: item.prgcode,
                prgName: item.prgname,
                comCode: item.comcode,
                comName: item.comname,
                areaName: item.areaname,
                salesType: item.salestype,
                userMax: item.usermax,
                billPrice: item.billprice,
                installPrice: item.install_price,
                installPriceAdd: item.install_price_add,
                upgradePrice: item.upgrade_price,
                saleHour: item.salehour,
                specialMemo: item.special_memo,
            }));

            // totalCount 계산 (첫 번째 아이템의 totalcount 또는 배열 길이)
            const totalCount =
                items.length > 0 && items[0].totalcount ? items[0].totalcount : items.length;

            return NextResponse.json({
                result: true,
                data: {
                    items: mappedItems,
                    totalCount,
                },
            });
        } else {
            return NextResponse.json({ result: false, errMsg: result.error }, { status: 500 });
        }
    } catch (error: any) {
        console.error("Sales activity list error:", error);
        return NextResponse.json({ result: false, errMsg: error.message }, { status: 500 });
    }
}

// POST: 영업활동 생성
export async function POST(request: NextRequest) {
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
        const body = await request.json();

        const data = {
            userId: userInfo?.userId || "",
            comName: body.comName,
            comCode: body.comCode || "",
            comIdno: body.comIdno || "",
            prgCode: body.prgCode,
            billPrice: body.billPrice || 0,
            installPrice: body.installPrice || 0,
            installPriceAdd: body.installPriceAdd || 0,
            upgradePrice: body.upgradePrice || 0,
            userMax: body.userMax || 0,
            saleHour: body.saleHour || 0,
            specialMemo: body.specialMemo || "",
            stateName: body.stateName as "납품" | "영업활동",
            saleDay: body.saleDay,
            salesType: body.salesType,
        };

        const result = await SalesHistProcedures.createSalesActivity(data);

        // OUTPUT 파라미터로 전달된 에러 메시지 체크
        if (result.output?.errmsg) {
            return NextResponse.json(
                { result: false, errMsg: result.output.errmsg },
                { status: 400 }
            );
        }

        return NextResponse.json({ result: true });
    } catch (error: any) {
        console.error("Create sales activity error:", error);
        return NextResponse.json({ result: false, errMsg: error.message }, { status: 500 });
    }
}
