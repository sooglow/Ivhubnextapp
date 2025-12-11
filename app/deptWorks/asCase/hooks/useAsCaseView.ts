import { useQuery } from "@tanstack/react-query";
import { getAsCaseView } from "@/app/api/asCase/asCase";

interface useAsCaseViewParams {
    serial: string;
    enabled?: boolean;
}

export function useAsCaseView({ serial, enabled = true }: useAsCaseViewParams) {
    return useQuery({
        queryKey: ["asCaseView", serial],
        queryFn: () => getAsCaseView(serial),
        enabled: enabled && !!serial,
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
    });
}
