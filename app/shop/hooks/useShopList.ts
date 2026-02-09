import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/public/lib/axiosInstance";
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
      const response = await axiosInstance.get<ShopListResponse>("/api/shop", {
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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
