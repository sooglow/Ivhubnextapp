import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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
      const response = await axios.get<CodeListResponse>("/api/code", {
        params,
      });
      return response.data;
    },
    enabled: !!kind,
  });
}
