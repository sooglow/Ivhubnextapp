import { NextRequest, NextResponse } from "next/server";
import { ShopProcedures } from "@/public/procedures/shop";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ comCode: string }> }
) {
  try {
    const resolvedParams = await params;
    const comCode = resolvedParams.comCode;

    if (!comCode) {
      return NextResponse.json(
        {
          result: false,
          data: null,
          errMsg: "업체코드 파라미터가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const result = await ShopProcedures.getShopView(comCode);

    if (result.success && result.data) {
      // 기본 정보가 없으면 업체 정보 없음
      if (!result.data.comInfo) {
        return NextResponse.json({
          result: false,
          data: null,
          errMsg: "해당 업체 정보를 찾을 수 없습니다.",
        });
      }

      return NextResponse.json({
        result: true,
        data: result.data,
        errMsg: null,
        errCode: null,
      });
    } else {
      return NextResponse.json({
        result: false,
        data: null,
        errMsg: result.error || "데이터 조회에 실패했습니다.",
      });
    }
  } catch (error) {
    console.error("Shop View API Error:", error);
    return NextResponse.json(
      {
        result: false,
        data: null,
        errMsg: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
