import { useQuery } from "@tanstack/react-query";
import type { InnoAnalyticsResponse } from "../types";

interface UseInnoAnalyticsProps {
    sday: string;
    eday: string;
    enabled?: boolean;
}

export const useInnoAnalytics = ({ sday, eday, enabled = true }: UseInnoAnalyticsProps) => {
    return useQuery<InnoAnalyticsResponse>({
        queryKey: ["innoAnalytics", sday, eday],
        queryFn: async () => {
            const response = await fetch(`/api/chart/inno?Sday=${sday}&Eday=${eday}`);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            return response.json();
        },
        enabled: enabled && !!sday && !!eday,
        staleTime: 1000 * 60 * 5, // 5분
    });
};
