import { useQuery } from "@tanstack/react-query";
import { SalesListResponse } from "@/app/sales/types/List";

export const useSalesList = (
    prgCode: string,
    areaCode: string,
    salesMan: string,
    state: string | number,
    keyword: string,
    currentPage: number,
    pageSize: number
) => {
    return useQuery<SalesListResponse>({
        queryKey: ["salesList", prgCode, areaCode, salesMan, state, keyword, currentPage, pageSize],
        queryFn: async () => {
            const params = new URLSearchParams({
                prgCode: prgCode || "",
                areaCode: areaCode || "",
                salesMan: salesMan || "",
                state: state.toString(),
                keyword: keyword || "",
                pageNumber: currentPage.toString(),
                pageSize: pageSize.toString(),
            });

            const response = await fetch(`/api/sales?${params.toString()}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        },
        staleTime: 0,
        gcTime: 1000 * 60 * 5,
    });
};
