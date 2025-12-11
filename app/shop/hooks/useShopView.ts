import { useQuery } from "@tanstack/react-query";
import { getShopView } from "@/app/api/shop/shop";
import { ShopViewResponse } from "@/app/shop/types/View";

export function useShopView(comCode: string) {
  return useQuery<ShopViewResponse>({
    queryKey: ["shopView", comCode],
    queryFn: () => getShopView(comCode),
    enabled: !!comCode,
  });
}
