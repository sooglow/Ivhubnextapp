import { useQuery } from "@tanstack/react-query";
import { getIssueBoardView } from "@/app/api/issueBoard/issueBoard";

interface useIvIssueEditParams {
    serial: string;
    enabled?: boolean;
}

export function useIvIssueEdit({
    serial,
    enabled = true,
}: useIvIssueEditParams) {
    return useQuery({
        queryKey: ["ivIssueEdit", serial],
        queryFn: () => getIssueBoardView(serial),
        enabled: enabled && !!serial,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}
