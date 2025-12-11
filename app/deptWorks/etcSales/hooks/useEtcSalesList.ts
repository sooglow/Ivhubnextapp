import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { EtcSalesListResponse } from "../types/List";

export const useEtcSalesList = (
    state: string,
    keyword: string,
    pageNumber: number,
    pageSize: number
) => {
    return useQuery<EtcSalesListResponse>({
        queryKey: ["etcSalesList", state, keyword, pageNumber, pageSize],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (state) params.append("state", state);
            if (keyword) params.append("keyword", keyword);
            params.append("pageNumber", pageNumber.toString());
            params.append("pageSize", pageSize.toString());

            const response = await axios.get<EtcSalesListResponse>(
                `/api/etcSales?${params.toString()}`
            );
            return response.data;
        },
    });
};
