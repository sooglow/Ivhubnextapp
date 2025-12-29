import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { UpgradeListResponse } from "../types/List";

interface UseUpgradeListParams {
    keyword: string;
    currentPage: number;
    pageSize: number;
    enabled?: boolean;
}

const fetchUpgradeList = async ({
    keyword,
    currentPage,
    pageSize,
}: Omit<UseUpgradeListParams, "enabled">): Promise<UpgradeListResponse> => {
    const params = new URLSearchParams({
        pageNumber: currentPage.toString(),
        pageSize: pageSize.toString(),
    });

    if (keyword) {
        params.append("keyword", keyword);
    }

    const response = await fetch(`/api/upgradeBoard?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch upgrade list");
    }

    return response.json();
};

export const useIvUpgradeList = ({
    keyword,
    currentPage,
    pageSize,
    enabled = true,
}: UseUpgradeListParams): UseQueryResult<UpgradeListResponse, Error> => {
    return useQuery({
        queryKey: ["ivUpgradeList", keyword, currentPage, pageSize],
        queryFn: () => fetchUpgradeList({ keyword, currentPage, pageSize }),
        enabled,
        staleTime: 0,
        gcTime: 0,
    });
};
