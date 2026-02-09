import { NextRequest, NextResponse } from "next/server";
import { ShopProcedures } from "@/public/procedures/shop";

// 서버사이드 JWT 파싱 함수
function parseJWTServer(token: string | null): { areaCode: string } | null {
  if (!token) return null;

  try {
    // Bearer 제거
    const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const base64Url = actualToken.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    const payload = JSON.parse(jsonPayload);

    return {
      areaCode: payload.AreaCode || "",
    };
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get("keyword") || null;
    const pageNumber = parseInt(searchParams.get("pageNumber") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const prgCode = searchParams.get("PrgCode") || null;
    let areaCode = searchParams.get("AreaCode") || null;

    // JWT에서 사용자 지사코드 추출
    const authHeader = request.headers.get("authorization");
    const userInfo = parseJWTServer(authHeader);
    const userAreaCode = userInfo?.areaCode || "";

    // C# 백엔드 로직: 본사(30000)가 아니면 사용자의 지사코드를 강제 사용
    if (userAreaCode && userAreaCode !== "30000") {
      areaCode = userAreaCode;
    }

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
