import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * 정비맛집 관리자 SSO Token 생성
 * comcode + 현재 날짜(MM/DD/YYYY)를 SHA256으로 해싱하여 Base64 인코딩
 */
function hashToken(comCode: string): string {
  const today = new Date();
  const dateString = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  const data = comCode + dateString;

  const hash = crypto.createHash("sha256").update(data, "utf8").digest("base64");
  return hash;
}

/**
 * 정비맛집 SSO 로그인을 위한 Token 발행 API
 * GET /api/sso?comCode=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const comCode = searchParams.get("comCode");

    // comCode 필수 파라미터 체크
    if (!comCode) {
      return NextResponse.json(
        {
          result: false,
          data: null,
          errMsg: "comCode는 필수 파라미터입니다.",
          errCode: "INVALID_PARAMETERS",
        },
        { status: 400 }
      );
    }

    // SSO 토큰 생성
    const ssoToken = hashToken(comCode);

    if (!ssoToken) {
      return NextResponse.json(
        {
          result: false,
          data: null,
          errMsg: "Token 생성에 실패하였습니다.",
          errCode: "TOKEN_GENERATION_FAILED",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: true,
      data: ssoToken,
      errMsg: null,
      errCode: null,
    });
  } catch (error) {
    console.error("SSO API Error:", error);
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
