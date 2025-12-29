import { useQuery } from "@tanstack/react-query";
import { getIssueBoardView } from "@/app/api/issueBoard/issueBoard";

interface useIvIssueViewParams {
    serial: string;
    enabled?: boolean;
}

export function useIvIssueView({
    serial,
    enabled = true,
}: useIvIssueViewParams) {
    return useQuery({
        queryKey: ["ivIssueView", serial],
        queryFn: () => getIssueBoardView(serial),
        enabled: enabled && !!serial,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}
