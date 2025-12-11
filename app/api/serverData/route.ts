import { NextRequest, NextResponse } from "next/server";
import { ServerDataProcedures } from "@/public/procedures/serverData";

/**
 * 업체 서버 데이터 조회 API
 * GET /api/serverData?comCode=xxx&prgCode=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const comCode = searchParams.get("comCode");
    const prgCode = searchParams.get("prgCode");

    // 필수 파라미터 검증
    if (!comCode || !prgCode) {
      return NextResponse.json(
        {
          result: false,
          data: null,
          errMsg: "comCode와 prgCode는 필수 파라미터입니다.",
          errCode: "INVALID_PARAMETERS",
        },
        { status: 400 }
      );
    }

    const result = await ServerDataProcedures.getCompanyServerData(
      comCode,
      prgCode
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
