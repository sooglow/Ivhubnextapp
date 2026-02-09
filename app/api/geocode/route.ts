import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
        return NextResponse.json(
            { error: "주소가 필요합니다." },
            { status: 400 }
        );
    }

    try {
        // 카카오 Local API 사용 (IP 제한 없음)
        const apiKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;

        // 주소 정리: 쉼표 이후, 괄호 부분 제거 (예: "1층(박달동)" 제거)
        let cleanAddress = address
            .split(",")[0]  // 쉼표 이전만
            .replace(/\([^)]*\)/g, "")  // 괄호 내용 제거
            .trim();


        // 1차: 주소 검색 API
        let url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(cleanAddress)}`;
        let response = await fetch(url, {
            headers: {
                Authorization: `KakaoAK ${apiKey}`,
            },
        });
        let data = await response.json();


        if (data.documents?.length > 0) {
            const location = data.documents[0];
            return NextResponse.json({
                lat: location.y,
                lon: location.x,
            });
        }

        // 2차: 키워드 검색 API (주소 검색 실패 시)
        url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(cleanAddress)}`;
        response = await fetch(url, {
            headers: {
                Authorization: `KakaoAK ${apiKey}`,
            },
        });
        data = await response.json();


        if (data.documents?.length > 0) {
            const location = data.documents[0];
            return NextResponse.json({
                lat: location.y,
                lon: location.x,
            });
        }

        return NextResponse.json(
            { error: "좌표를 찾을 수 없습니다." },
            { status: 400 }
        );
    } catch (error) {
        console.error("Geocoding error:", error);
        return NextResponse.json(
            { error: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
