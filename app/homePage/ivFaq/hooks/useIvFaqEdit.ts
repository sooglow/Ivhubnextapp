import { useQuery } from "@tanstack/react-query";
import { getFaqBoardView } from "@/app/api/faqBoard/faqBoard";

interface useIvFaqEditParams {
    serial: string;
    enabled?: boolean;
}

export function useIvFaqEdit({ serial, enabled = true }: useIvFaqEditParams) {
    return useQuery({
        queryKey: ["ivFaqEdit", serial],
        queryFn: () => getFaqBoardView(serial),
        enabled: enabled && !!serial,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}
