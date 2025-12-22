import { useQuery } from "@tanstack/react-query";
import { getIvBoardView } from "@/app/api/ivBoard/ivBoard";

interface useIvInfoEditParams {
    serial: string;
    enabled?: boolean;
}

export function useIvInfoEdit({
    serial,
    enabled = true,
}: useIvInfoEditParams) {
    return useQuery({
        queryKey: ["ivInfoEdit", serial],
        queryFn: () => getIvBoardView(serial),
        enabled: enabled && !!serial,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}
