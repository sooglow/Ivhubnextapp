import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/public/lib/axiosInstance";
import { CodeListResponse } from "@/app/shop/types/Code";

export function useCodeList(kind: string, subCode?: string) {
  return useQuery<CodeListResponse>({
    queryKey: ["codeList", kind, subCode],
    queryFn: async () => {
      const params: any = {
        Kind: kind,
      };
      if (subCode) {
        params.SubCode = subCode;
      }
      const response = await axiosInstance.get<CodeListResponse>("/api/code", {
        params,
      });
      return response.data;
    },
    enabled: !!kind,
  });
}
