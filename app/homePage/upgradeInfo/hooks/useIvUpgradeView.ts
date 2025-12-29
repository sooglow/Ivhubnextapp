import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { UpgradeViewResponse } from "../types/View";

interface UseUpgradeViewParams {
    serial: string;
    enabled?: boolean;
}

const fetchUpgradeView = async (serial: string): Promise<UpgradeViewResponse> => {
    const response = await fetch(`/api/upgradeBoard/${serial}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch upgrade view");
    }

    return response.json();
};

export const useIvUpgradeView = ({
    serial,
    enabled = true,
}: UseUpgradeViewParams): UseQueryResult<UpgradeViewResponse, Error> => {
    return useQuery({
        queryKey: ["ivUpgradeView", serial],
        queryFn: () => fetchUpgradeView(serial),
        enabled: enabled && !!serial,
        staleTime: 0,
        gcTime: 0,
    });
};
