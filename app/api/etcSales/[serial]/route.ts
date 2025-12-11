import { NextRequest, NextResponse } from "next/server";
import { EtcSalesProcedures } from "@/public/procedures/etcSales";

// GET: EtcSales View 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ serial: string }> }
) {
    try {
        const { serial } = await params;

        if (!serial) {
            return NextResponse.json(
                {
                    result: false,
                    data: null,
                    errMsg: "serial 파라미터가 필요합니다.",
                    errCode: "MISSING_PARAMETER",
                },
                { status: 400 }
            );
        }

        const result = await EtcSalesProcedures.getEtcSalesView(serial);

        if (result.success && result.data && result.data.length > 0) {
            return NextResponse.json({
                result: true,
                data: result.data[0],
                errMsg: null,
                errCode: null,
            });
        } else {
            return NextResponse.json(
                {
                    result: false,
                    data: null,
                    errMsg: result.error || "데이터 조회에 실패했습니다.",
                    errCode: "QUERY_FAILED",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("EtcSales View API Error:", error);
        return NextResponse.json(
            {
                result: false,
                data: null,
                errMsg: "서버 오류가 발생했습니다.",
                errCode: "SERVER_ERROR",
            },
            { status: 500 }
        );
    }
}

// POST: EtcSales Update
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ serial: string }> }
) {
    try {
        const { serial } = await params;
        const body = await request.json();

        const {
            comName,
            comCode,
            recMan,
            tel,
            hp,
            area,
            addr,
            receipter,
            kind,
            skind,
            qty,
            reqSum,
            inTotal,
            misu,
            descr,
            state,
            sendDay,
        } = body;

        if (!serial) {
            return NextResponse.json(
                {
                    result: false,
                    data: null,
                    errMsg: "serial이 필요합니다.",
                    errCode: "MISSING_PARAMETER",
                },
                { status: 400 }
            );
        }

        const result = await EtcSalesProcedures.createOrUpdateEtcSales(
            serial,
            comName,
            comCode,
            recMan,
            tel,
            hp,
            area,
            addr,
            receipter,
            kind,
            skind,
            qty,
            reqSum,
            inTotal,
            misu,
            descr,
            state,
            sendDay
        );

        if (result.success) {
            return NextResponse.json({
                result: true,
                data: null,
                errMsg: null,
                errCode: null,
            });
        } else {
            return NextResponse.json(
                {
                    result: false,
                    data: null,
                    errMsg: result.error || "수정에 실패했습니다.",
                    errCode: "UPDATE_FAILED",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("EtcSales Update API Error:", error);
        return NextResponse.json(
            {
                result: false,
                data: null,
                errMsg: "서버 오류가 발생했습니다.",
                errCode: "SERVER_ERROR",
            },
            { status: 500 }
        );
    }
}

// DELETE: EtcSales Delete
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ serial: string }> }
) {
    try {
        const { serial } = await params;

        if (!serial) {
            return NextResponse.json(
                {
                    result: false,
                    data: null,
                    errMsg: "serial이 필요합니다.",
                    errCode: "MISSING_PARAMETER",
                },
                { status: 400 }
            );
        }

        const result = await EtcSalesProcedures.deleteEtcSales(serial);

        if (result.success) {
            return NextResponse.json({
                result: true,
                data: null,
                errMsg: null,
                errCode: null,
            });
        } else {
            return NextResponse.json(
                {
                    result: false,
                    data: null,
                    errMsg: result.error || "삭제에 실패했습니다.",
                    errCode: "DELETE_FAILED",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("EtcSales Delete API Error:", error);
        return NextResponse.json(
            {
                result: false,
                data: null,
                errMsg: "서버 오류가 발생했습니다.",
                errCode: "SERVER_ERROR",
            },
            { status: 500 }
        );
    }
}
