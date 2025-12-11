import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ShopListResponse } from "@/app/shop/types/List";

export function useShopList(
  keyword: string,
  pageNumber: number,
  pageSize: number,
  prgCode: string = "",
  areaCode: string = ""
) {
  return useQuery<ShopListResponse>({
    queryKey: ["shopList", keyword, pageNumber, pageSize, prgCode, areaCode],
    queryFn: async () => {
      const response = await axios.get<ShopListResponse>("/api/shop", {
        params: {
          keyword: keyword || "",
          pageNumber,
          pageSize,
          PrgCode: prgCode || "",
          AreaCode: areaCode || "",
        },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh 상태로 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지 (이전 cacheTime)
  });
}
