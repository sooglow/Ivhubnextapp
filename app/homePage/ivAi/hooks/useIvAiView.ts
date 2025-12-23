import { useQuery } from "@tanstack/react-query";
import { getAiBoardView } from "@/app/api/aiBoard/aiBoard";

interface useIvAiViewParams {
    serial: string;
    enabled?: boolean;
}

export function useIvAiView({
    serial,
    enabled = true,
}: useIvAiViewParams) {
    return useQuery({
        queryKey: ["ivAiView", serial],
        queryFn: () => getAiBoardView(serial),
        enabled: enabled && !!serial,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}
