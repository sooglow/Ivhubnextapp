import { useQuery } from "@tanstack/react-query";
import { getAsCaseList } from "@/app/api/asCase/asCase";

interface useAsCaseListParams {
    prgCode: string;
    keyword: string;
    currentPage: number;
    pageSize: number;
    enabled?: boolean;
}

export function useAsCaseList({
    prgCode,
    keyword,
    currentPage,
    pageSize,
    enabled = true,
}: useAsCaseListParams) {
    return useQuery({
        queryKey: ["asCaseList", prgCode, keyword, currentPage, pageSize],
        queryFn: () => getAsCaseList(prgCode, keyword, currentPage, pageSize),
        enabled,
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
        keepPreviousData: true,
    });
}
