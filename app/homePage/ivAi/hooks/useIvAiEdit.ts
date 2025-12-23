import { useQuery } from "@tanstack/react-query";
import { getAiBoardView } from "@/app/api/aiBoard/aiBoard";

interface useIvAiEditParams {
    serial: string;
    enabled?: boolean;
}

export function useIvAiEdit({
    serial,
    enabled = true,
}: useIvAiEditParams) {
    return useQuery({
        queryKey: ["ivAiEdit", serial],
        queryFn: () => getAiBoardView(serial),
        enabled: enabled && !!serial,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}
