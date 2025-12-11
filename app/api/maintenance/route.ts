import { NextRequest, NextResponse } from "next/server";
import { MaintenanceProcedures } from "@/public/procedures/maintenance";

// GET: 유지보수 계약업체 목록 조회
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const comCode = searchParams.get("comCode") || "";
        const pageNumber = parseInt(searchParams.get("pageNumber") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "10");

        const result = await MaintenanceProcedures.getMaintenanceList(comCode, pageNumber, pageSize);

        if (result.success) {
            return NextResponse.json({
                result: true,
                data: result.data || [],
                totalCount: result.data?.length || 0,
            });
        } else {
            return NextResponse.json(
                { result: false, errMsg: result.error },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error("Maintenance list error:", error);
        return NextResponse.json(
            { result: false, errMsg: error.message },
            { status: 500 }
        );
    }
}

// POST: 유지보수 계약업체 생성
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = await MaintenanceProcedures.createOrUpdateMaintenance({
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
        console.error("Maintenance create error:", error);
        return NextResponse.json(
            { result: false, errMsg: error.message },
            { status: 500 }
        );
    }
}
