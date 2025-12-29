import { useQuery } from "@tanstack/react-query";
import { getIssueBoardList } from "@/app/api/issueBoard/issueBoard";

interface useIvIssueListParams {
    keyword: string;
    currentPage: number;
    pageSize: number;
    enabled?: boolean;
}

export function useIvIssueList({
    keyword,
    currentPage,
    pageSize,
    enabled = true,
}: useIvIssueListParams) {
    return useQuery({
        queryKey: ["ivIssueList", keyword, currentPage, pageSize],
        queryFn: () => getIssueBoardList(keyword, currentPage, pageSize),
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}
