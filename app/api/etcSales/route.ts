import { NextRequest, NextResponse } from "next/server";
import { EtcSalesProcedures } from "@/public/procedures/etcSales";

// GET: EtcSales List 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const state = searchParams.get("state");
        const keyword = searchParams.get("keyword");
        const pageNumber = parseInt(searchParams.get("pageNumber") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "10");

        const result = await EtcSalesProcedures.getEtcSalesList(
            state,
            keyword,
            pageNumber,
            pageSize
        );

        if (result.success && result.data) {
            const totalCount = result.data.length > 0 ? result.data[0].totalCount : 0;

            return NextResponse.json({
                result: true,
                data: {
                    items: result.data,
                    totalCount: totalCount,
                },
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
        console.error("EtcSales List API Error:", error);
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

// POST: EtcSales Create
export async function POST(request: NextRequest) {
    try {
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

        const result = await EtcSalesProcedures.createOrUpdateEtcSales(
            null,
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
                data: result.data,
                errMsg: null,
                errCode: null,
            });
        } else {
            return NextResponse.json(
                {
                    result: false,
                    data: null,
                    errMsg: result.error || "저장에 실패했습니다.",
                    errCode: "CREATE_FAILED",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("EtcSales Create API Error:", error);
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
