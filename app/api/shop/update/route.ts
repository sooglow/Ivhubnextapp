import { NextRequest, NextResponse } from "next/server";
import { ShopProcedures } from "@/public/procedures/shop";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { comCode, prgCode, limit, tsUserId, tsPassword } = body;

    // 필수 파라미터 검증
    if (!comCode || !prgCode) {
      return NextResponse.json(
        { result: false, errMsg: "업체코드와 프로그램코드는 필수입니다." },
        { status: 400 }
      );
    }

    // 프로시저 호출
    const result = await ShopProcedures.updatePrgInfo(
      comCode,
      prgCode,
      limit,
      tsUserId || "",
      tsPassword || ""
    );

    if (!result.success) {
      return NextResponse.json(
        { result: false, errMsg: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      result: true,
      data: null,
    });
  } catch (error: any) {
    console.error("Shop update error:", error);
    return NextResponse.json(
      { result: false, errMsg: error.message || "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
