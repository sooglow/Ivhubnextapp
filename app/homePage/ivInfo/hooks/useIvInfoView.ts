import { useQuery } from "@tanstack/react-query";
import { getIvBoardView } from "@/app/api/ivBoard/ivBoard";

interface useIvInfoViewParams {
    serial: string;
    enabled?: boolean;
}

export function useIvInfoView({
    serial,
    enabled = true,
}: useIvInfoViewParams) {
    return useQuery({
        queryKey: ["ivInfoView", serial],
        queryFn: () => getIvBoardView(serial),
        enabled: enabled && !!serial,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}
