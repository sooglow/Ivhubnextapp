import { NextRequest, NextResponse } from "next/server";
import { TsSerialProcedures } from "@/public/procedures/tsSerial";

// GET: 국토부 시리얼 상세 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ serial: string }> }) {
    try {
        const { serial } = await params;
        const result = await TsSerialProcedures.getTsSerialDetail(serial);

        if (result.success && result.data && result.data.length > 0) {
            const item = result.data[0];

            // DB 필드명(소문자)을 camelCase로 변환
            const mappedItem = {
                comSerial: item.comserial,
                name: item.name,
                idNo: item.idno,
                manCode: item.mancode,
                manName: item.manname,
                areaCode: item.areacode,
                areaName: item.areaname,
                intDay: item.intday,
            };

            return NextResponse.json({
                result: true,
                data: mappedItem,
            });
        } else {
            return NextResponse.json(
                { result: false, errMsg: "데이터를 찾을 수 없습니다." },
                { status: 404 }
            );
        }
    } catch (error: any) {
        console.error("TsSerial detail error:", error);
        return NextResponse.json(
            { result: false, errMsg: error.message },
            { status: 500 }
        );
    }
}

// POST: 국토부 시리얼 수정
export async function POST(request: NextRequest, { params }: { params: Promise<{ serial: string }> }) {
    try {
        const { serial } = await params;
        const body = await request.json();

        const result = await TsSerialProcedures.updateTsSerial({
            comSerial: serial,
            name: body.name,
            idNo: body.idNo,
            manCode: body.manCode,
            areaCode: body.areaCode,
        });

        if (result.success) {
            return NextResponse.json({ result: true });
        } else {
            return NextResponse.json(
                { result: false, errMsg: result.error },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error("TsSerial update error:", error);
        return NextResponse.json(
            { result: false, errMsg: error.message },
            { status: 500 }
        );
    }
}

// DELETE: 국토부 시리얼 삭제
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ serial: string }> }) {
    try {
        const { serial } = await params;
        const result = await TsSerialProcedures.deleteTsSerial(serial);

        if (result.success) {
            return NextResponse.json({ result: true });
        } else {
            return NextResponse.json(
                { result: false, errMsg: result.error },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error("TsSerial delete error:", error);
        return NextResponse.json(
            { result: false, errMsg: error.message },
            { status: 500 }
        );
    }
}
