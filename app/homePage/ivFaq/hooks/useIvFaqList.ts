import { useQuery } from "@tanstack/react-query";
import { getFaqBoardList } from "@/app/api/faqBoard/faqBoard";

interface useIvFaqListParams {
    kind: string;
    keyword: string;
    currentPage: number;
    pageSize: number;
    enabled?: boolean;
}

export function useIvFaqList({
    kind,
    keyword,
    currentPage,
    pageSize,
    enabled = true,
}: useIvFaqListParams) {
    return useQuery({
        queryKey: ["ivFaqList", kind, keyword, currentPage, pageSize],
        queryFn: () => getFaqBoardList(kind, keyword, currentPage, pageSize),
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}
