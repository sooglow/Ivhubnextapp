import { useQuery } from "@tanstack/react-query";
import type { AsAnalyticsResponse } from "../types";

interface UseAsAnalyticsProps {
    sday: string;
    eday: string;
    enabled?: boolean;
}

export const useAsAnalytics = ({ sday, eday, enabled = true }: UseAsAnalyticsProps) => {
    return useQuery<AsAnalyticsResponse>({
        queryKey: ["asAnalytics", sday, eday],
        queryFn: async () => {
            const response = await fetch(`/api/chart/as?Sday=${sday}&Eday=${eday}`);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            return response.json();
        },
        enabled: enabled && !!sday && !!eday,
        staleTime: 1000 * 60 * 5, // 5분
    });
};
