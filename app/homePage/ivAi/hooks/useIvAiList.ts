import { useQuery } from "@tanstack/react-query";
import { getAiBoardList } from "@/app/api/aiBoard/aiBoard";

interface useIvAiListParams {
    keyword: string;
    currentPage: number;
    pageSize: number;
    enabled?: boolean;
}

export function useIvAiList({
    keyword,
    currentPage,
    pageSize,
    enabled = true,
}: useIvAiListParams) {
    return useQuery({
        queryKey: ["ivAiList", keyword, currentPage, pageSize],
        queryFn: () => getAiBoardList(keyword, currentPage, pageSize),
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}
