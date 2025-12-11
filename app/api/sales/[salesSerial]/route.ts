import { NextRequest, NextResponse } from "next/server";
import { SalesProcedures } from "@/public/procedures/sales";

// GET: Sales View 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ salesSerial: string }> }
) {
    try {
        const { salesSerial } = await params;

        if (!salesSerial) {
            return NextResponse.json(
                {
                    result: false,
                    data: null,
                    errMsg: "salesSerial 파라미터가 필요합니다.",
                    errCode: "MISSING_PARAMETER",
                },
                { status: 400 }
            );
        }

        const result = await SalesProcedures.getSalesView(salesSerial);

        if (result.success && result.data) {
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
                    errMsg: result.error || "데이터 조회에 실패했습니다.",
                    errCode: "QUERY_FAILED",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Sales View API Error:", error);
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

// POST: Sales 수정
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ salesSerial: string }> }
) {
    try {
        const { salesSerial } = await params;
        const body = await request.json();

        const { salesMan, salesArea, salesState } = body;

        if (!salesSerial) {
            return NextResponse.json(
                {
                    result: false,
                    data: null,
                    errMsg: "salesSerial이 필요합니다.",
                    errCode: "MISSING_PARAMETER",
                },
                { status: 400 }
            );
        }

        const result = await SalesProcedures.updateSales(
            salesSerial,
            salesMan,
            salesArea,
            salesState
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
        console.error("Sales Update API Error:", error);
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

// DELETE: Sales 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ salesSerial: string }> }
) {
    try {
        const { salesSerial } = await params;
        const { searchParams } = new URL(request.url);

        const userId = searchParams.get("userId");
        const areaCode = searchParams.get("areaCode");

        if (!salesSerial || !userId || !areaCode) {
            return NextResponse.json(
                {
                    result: false,
                    data: null,
                    errMsg: "salesSerial, userId, areaCode가 필요합니다.",
                    errCode: "MISSING_PARAMETER",
                },
                { status: 400 }
            );
        }

        const result = await SalesProcedures.deleteSales(salesSerial, userId, areaCode);

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
        console.error("Sales Delete API Error:", error);
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
