import { useQuery } from "@tanstack/react-query";
import { getIvBoardList } from "@/app/api/ivBoard/ivBoard";

interface useIvInfoListParams {
    keyword: string;
    currentPage: number;
    pageSize: number;
    enabled?: boolean;
}

export function useIvInfoList({
    keyword,
    currentPage,
    pageSize,
    enabled = true,
}: useIvInfoListParams) {
    return useQuery({
        queryKey: ["ivInfoList", keyword, currentPage, pageSize],
        queryFn: () => getIvBoardList(keyword, currentPage, pageSize),
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}
