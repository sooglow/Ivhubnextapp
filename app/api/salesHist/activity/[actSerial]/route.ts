import { NextRequest, NextResponse } from "next/server";
import { SalesHistProcedures } from "@/public/procedures/salesHist";
import { parseJWT } from "@/public/utils/utils";

/**
 * GET /api/salesHist/activity/[actSerial]?actSeqNo=xxx - 영업활동 상세 조회
 */
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ actSerial: string }> }
) {
    try {
        const params = await props.params;
        const { searchParams } = new URL(request.url);
        const actSeqNo = searchParams.get("actSeqNo");

        if (!actSeqNo) {
            return NextResponse.json(
                { result: false, errMsg: "actSeqNo가 필요합니다." },
                { status: 400 }
            );
        }

        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
            return NextResponse.json(
                { result: false, errMsg: "인증 정보가 없습니다." },
                { status: 401 }
            );
        }

        const result = await SalesHistProcedures.getSalesActivityDetail(
            params.actSerial,
            actSeqNo
        );

        const resultData = result.data as any;
        if (!resultData || resultData.length === 0) {
            return NextResponse.json(
                { result: false, errMsg: "데이터를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        const row = resultData[0];

        const data = {
            ivCode: row.ivcode?.trim() || "",
            actSerial: row.act_serial?.trim() || "",
            actSeqNo: row.act_seqno?.trim() || "",
            comCode: row.comcode?.trim() || "",
            comName: row.comname?.trim() || "",
            prgCode: row.prgcode?.trim() || "",
            billPrice: row.billprice ? parseInt(row.billprice) : 0,
            upgradePrice: row.upgrade_price ? parseInt(row.upgrade_price) : 0,
            installPrice: row.install_price ? parseInt(row.install_price) : 0,
            installPriceAdd: row.install_price_add ? parseInt(row.install_price_add) : 0,
            salesSerial: row.sales_serial?.trim() || "",
            saleHour: row.salehour ? parseInt(row.salehour) : 0,
            specialMemo: row.special_memo?.trim() || "",
            stateName: row.statename?.trim() || "",
        };

        return NextResponse.json({ result: true, data });
    } catch (error: any) {
        console.error("Get sales activity detail error:", error);
        return NextResponse.json(
            { result: false, errMsg: error.message || "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

/**
 * POST /api/salesHist/activity/[actSerial] - 영업활동 수정
 */
export async function POST(
    request: NextRequest,
    props: { params: Promise<{ actSerial: string }> }
) {
    try {
        const params = await props.params;
        const body = await request.json();

        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
            return NextResponse.json(
                { result: false, errMsg: "인증 정보가 없습니다." },
                { status: 401 }
            );
        }

        const payload = parseJWT(token);

        const data = {
            userId: payload.userId,
            actSerial: params.actSerial,
            actSeqNo: body.actSeqNo,
            comCode: body.comCode || "",
            comName: body.comName,
            comIdno: body.comIdno || "",
            prgCode: body.prgCode,
            billPrice: body.billPrice || 0,
            installPrice: body.installPrice || 0,
            installPriceAdd: body.installPriceAdd || 0,
            upgradePrice: body.upgradePrice || 0,
            userMax: body.userMax || 0,
            saleHour: body.saleHour || 0,
            specialMemo: body.specialMemo || "",
            stateName: body.stateName,
            saleDay: body.saleDay,
            salesType: body.salesType,
        };

        const result = await SalesHistProcedures.updateSalesActivity(data);

        // OUTPUT 파라미터로 전달된 에러 메시지 체크
        const output = (result as any).output;
        if (output?.errmsg) {
            return NextResponse.json(
                { result: false, errMsg: output.errmsg },
                { status: 400 }
            );
        }

        return NextResponse.json({ result: true });
    } catch (error: any) {
        console.error("Update sales activity error:", error);
        return NextResponse.json(
            { result: false, errMsg: error.message || "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/salesHist/activity/[actSerial]?actSeqNo=xxx - 영업활동 삭제
 */
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ actSerial: string }> }
) {
    try {
        const params = await props.params;
        const { searchParams } = new URL(request.url);
        const actSeqNo = searchParams.get("actSeqNo");

        if (!actSeqNo) {
            return NextResponse.json(
                { result: false, errMsg: "actSeqNo가 필요합니다." },
                { status: 400 }
            );
        }

        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
            return NextResponse.json(
                { result: false, errMsg: "인증 정보가 없습니다." },
                { status: 401 }
            );
        }

        const payload = parseJWT(token);

        // 삭제는 stateName을 "삭제"로 설정하여 수정 프로시저 호출
        const data = {
            userId: payload.userId,
            actSerial: params.actSerial,
            actSeqNo: actSeqNo,
            comCode: "",
            comName: "",
            comIdno: "",
            prgCode: "",
            billPrice: 0,
            installPrice: 0,
            installPriceAdd: 0,
            upgradePrice: 0,
            userMax: 0,
            saleHour: 0,
            specialMemo: "",
            stateName: "삭제" as const,
            saleDay: "",
            salesType: "기타" as const,
        };

        const result = await SalesHistProcedures.updateSalesActivity(data);

        // OUTPUT 파라미터로 전달된 에러 메시지 체크
        const output = (result as any).output;
        if (output?.errmsg) {
            return NextResponse.json(
                { result: false, errMsg: output.errmsg },
                { status: 400 }
            );
        }

        return NextResponse.json({ result: true });
    } catch (error: any) {
        console.error("Delete sales activity error:", error);
        return NextResponse.json(
            { result: false, errMsg: error.message || "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
