import { NextRequest, NextResponse } from "next/server";
import { ShopProcedures } from "@/public/procedures/shop";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get("keyword") || null;
    const pageNumber = parseInt(searchParams.get("pageNumber") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const prgCode = searchParams.get("PrgCode") || null;
    const areaCode = searchParams.get("AreaCode") || null;

    const result = await ShopProcedures.getShopList(
      keyword,
      pageNumber,
      pageSize,
      prgCode,
      areaCode
    );

    if (result.success && result.data) {
      const items = Array.isArray(result.data) ? result.data : [result.data];
      const totalCount = items.length > 0 ? (items[0] as any).TotalCount || 0 : 0;
      return NextResponse.json({
        result: true,
        data: {
          items,
          totalCount,
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
