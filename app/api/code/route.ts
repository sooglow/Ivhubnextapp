import { NextRequest, NextResponse } from "next/server";
import { CodeProcedures } from "@/public/procedures/code";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kind = searchParams.get("Kind") || "";
    const subCode = searchParams.get("SubCode") || null;

    if (!kind) {
      return NextResponse.json(
        {
          result: false,
          data: null,
          errMsg: "Kind 파라미터가 필요합니다.",
          errCode: "MISSING_PARAMETER",
        },
        { status: 400 }
      );
    }

    const result = await CodeProcedures.getCodeList(kind, subCode);

    if (result.success && result.data) {
      const items = Array.isArray(result.data) ? result.data : [result.data];

      return NextResponse.json({
        result: true,
        data: {
          items,
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
    console.error("API Error:", error);
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
