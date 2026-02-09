import axiosInstance from "@/public/lib/axiosInstance";
import { ShopViewResponse } from "@/app/shop/types/View";

// 업체 상세 조회 - C# 백엔드 직접 호출
export async function getShopView(comCode: string): Promise<ShopViewResponse> {
  try {
    const response = await axiosInstance.get<ShopViewResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/Company/View?ComCode=${comCode}`
    );
    return response.data;
  } catch (error) {
    console.error("getShopView 오류:", error);
    return {
      result: false,
      data: null,
      errMsg: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      errCode: null,
    };
  }
}
