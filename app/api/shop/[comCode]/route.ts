import { NextRequest, NextResponse } from "next/server";

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

    const authHeader = request.headers.get("authorization");
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${backendUrl}/Company/View?comCode=${comCode}`, {
      headers: {
        Authorization: authHeader || "",
      },
    });

    const data = await response.json();

    if (data.result && data.data) {
      return NextResponse.json({
        result: true,
        data: {
          comInfo: data.data.comInfo ? {
            comCode: data.data.comInfo.comCode || "",
            comName: data.data.comInfo.comName || "",
            idno: data.data.comInfo.idno || "",
            boss: data.data.comInfo.boss || "",
            hp: data.data.comInfo.hp || "",
            tel: data.data.comInfo.tel || "",
            address: data.data.comInfo.address || "",
            vipComMemo: data.data.comInfo.vipComMemo || "",
            blackComMemo: data.data.comInfo.blackComMemo || "",
            hpSlot01: data.data.comInfo.hpSlot01 || "",
            hp01: data.data.comInfo.hp01 || "",
            hpSlot02: data.data.comInfo.hpSlot02 || "",
            hp02: data.data.comInfo.hp02 || "",
            hpSlot03: data.data.comInfo.hpSlot03 || "",
            hp03: data.data.comInfo.hp03 || "",
            hpSlot04: data.data.comInfo.hpSlot04 || "",
            hp04: data.data.comInfo.hp04 || "",
            areaCode: data.data.comInfo.areaCode || "",
            areaName: data.data.comInfo.areaName || "",
            registMan: data.data.comInfo.registMan || "",
            homeCode: data.data.comInfo.homeCode || "",
            homeName: data.data.comInfo.homeName || "",
            fax: data.data.comInfo.fax || "",
            lat: data.data.comInfo.lat || undefined,
            lon: data.data.comInfo.lon || undefined,
          } : null,
          salesItems: data.data.salesItems || [],
          asHistItems: data.data.asHistItems || [],
          usedPrgItems: data.data.usedPrgItems || [],
        },
        errMsg: null,
        errCode: null,
      });
    } else {
      return NextResponse.json({
        result: false,
        data: null,
        errMsg: data.errMsg || "데이터 조회에 실패했습니다.",
        errCode: data.errCode || null,
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
