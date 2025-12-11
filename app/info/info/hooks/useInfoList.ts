import { useQuery } from "@tanstack/react-query";
import { getInfoList } from "@/app/api/info/info";

interface useInfoListParams {
    keyword: string;
    currentPage: number;
    pageSize: number;
    userid: string;
    areacode: string;
    enabled?: boolean;
}

export function useInfoList({
    keyword,
    currentPage,
    pageSize,
    userid,
    areacode,
    enabled = true,
}: useInfoListParams) {
    return useQuery({
        queryKey: ["infoList", keyword, currentPage, pageSize, userid, areacode],
        queryFn: () => getInfoList(keyword, currentPage, pageSize, userid, areacode),
        enabled,
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
        keepPreviousData: true,
    });
}
