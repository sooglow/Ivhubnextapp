import axios from "axios";
import { ShopViewResponse } from "@/app/shop/types/View";

// 업체 상세 조회
export async function getShopView(comCode: string): Promise<ShopViewResponse> {
  try {
    const response = await axios.get<ShopViewResponse>(`/api/shop/${comCode}`);
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
