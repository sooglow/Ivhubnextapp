import { NextRequest, NextResponse } from "next/server";
import { MaintenanceProcedures } from "@/public/procedures/maintenance";

// GET: 유지보수 계약업체 상세 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ serial: string }> }) {
    try {
        const { serial } = await params;
        const result = await MaintenanceProcedures.getMaintenanceDetail(serial);

        if (result.success && result.data && result.data.length > 0) {
            const item = result.data[0];

            // DB 필드명을 camelCase로 변환
            const mappedItem = {
                serial: item.serial,
                asDay: item.asday,
                userId: item.userid,
                comCode: item.comcode,
                subject: item.subject,
                asMemo: item.asmemo,
                asResult: item.asresult,
                bigo: item.bigo,
                result: item.result,
                wdate: item.wdate,
                asComName: item.ascomname,
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
        console.error("Maintenance detail error:", error);
        return NextResponse.json(
            { result: false, errMsg: error.message },
            { status: 500 }
        );
    }
}

// POST: 유지보수 계약업체 수정
export async function POST(request: NextRequest, { params }: { params: Promise<{ serial: string }> }) {
    try {
        const { serial } = await params;
        const body = await request.json();

        const result = await MaintenanceProcedures.createOrUpdateMaintenance({
            serial: serial,
            asDay: body.asDay,
            userId: body.userId,
            comCode: body.comCode,
            subject: body.subject,
            asMemo: body.asMemo,
            asResult: body.asResult,
            bigo: body.bigo,
            result: body.result,
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
        console.error("Maintenance update error:", error);
        return NextResponse.json(
            { result: false, errMsg: error.message },
            { status: 500 }
        );
    }
}

// DELETE: 유지보수 계약업체 삭제
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ serial: string }> }) {
    try {
        const { serial } = await params;
        const result = await MaintenanceProcedures.deleteMaintenance(serial);

        if (result.success) {
            return NextResponse.json({ result: true });
        } else {
            return NextResponse.json(
                { result: false, errMsg: result.error },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error("Maintenance delete error:", error);
        return NextResponse.json(
            { result: false, errMsg: error.message },
            { status: 500 }
        );
    }
}
