import { NextRequest, NextResponse } from "next/server";
import { TsSerialProcedures } from "@/public/procedures/tsSerial";

// GET: 국토부 시리얼 목록 조회
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const keyword = searchParams.get("keyword") || "";

        const result = await TsSerialProcedures.getTsSerialList(keyword);

        if (result.success) {
            const items = result.data || [];

            // DB 필드명(소문자)을 camelCase로 변환
            const mappedItems = items.map((item: any) => ({
                comSerial: item.comserial,
                name: item.name,
                idNo: item.idno,
                manCode: item.mancode,
                manName: item.manname,
                areaCode: item.areacode,
                areaName: item.areaname,
                intDay: item.intday,
            }));

            return NextResponse.json({
                result: true,
                data: mappedItems,
                totalCount: mappedItems.length,
            });
        } else {
            return NextResponse.json(
                { result: false, errMsg: result.error },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error("TsSerial list error:", error);
        return NextResponse.json(
            { result: false, errMsg: error.message },
            { status: 500 }
        );
    }
}

// POST: 국토부 시리얼 추가 생성
export async function POST(request: NextRequest) {
    try {
        const result = await TsSerialProcedures.createTsSerial();

        if (result.success) {
            return NextResponse.json({
                result: true,
                data: result.data,
            });
        } else {
            return NextResponse.json(
                { result: false, errMsg: result.error },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error("TsSerial create error:", error);
        return NextResponse.json(
            { result: false, errMsg: error.message },
            { status: 500 }
        );
    }
}
