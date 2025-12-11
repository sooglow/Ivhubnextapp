import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { EtcSalesViewResponse, EtcSalesUpdateRequest, EtcSalesUpdateResponse } from "../types/Edit";

export const useEtcSalesView = (serial: string) => {
    return useQuery<EtcSalesViewResponse>({
        queryKey: ["etcSalesView", serial],
        queryFn: async () => {
            const response = await axios.get<EtcSalesViewResponse>(`/api/etcSales/${serial}`);
            return response.data;
        },
        enabled: !!serial,
    });
};

export const useEtcSalesUpdate = (serial: string) => {
    const queryClient = useQueryClient();

    return useMutation<EtcSalesUpdateResponse, Error, EtcSalesUpdateRequest>({
        mutationFn: async (data: EtcSalesUpdateRequest) => {
            const response = await axios.post<EtcSalesUpdateResponse>(
                `/api/etcSales/${serial}`,
                data
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["etcSalesView", serial] });
            queryClient.invalidateQueries({ queryKey: ["etcSalesList"] });
        },
    });
};

export const useEtcSalesDelete = (serial: string) => {
    const queryClient = useQueryClient();

    return useMutation<EtcSalesUpdateResponse, Error>({
        mutationFn: async () => {
            const response = await axios.delete<EtcSalesUpdateResponse>(`/api/etcSales/${serial}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["etcSalesList"] });
        },
    });
};

export const useEtcSalesCreate = () => {
    const queryClient = useQueryClient();

    return useMutation<EtcSalesUpdateResponse, Error, EtcSalesUpdateRequest>({
        mutationFn: async (data: EtcSalesUpdateRequest) => {
            const response = await axios.post<EtcSalesUpdateResponse>(`/api/etcSales`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["etcSalesList"] });
        },
    });
};
