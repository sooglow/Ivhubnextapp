import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SalesViewResponse, SalesUpdateResponse, SalesUpdateRequest } from "@/app/sales/types/View";

// Sales View 조회
export const useSalesView = (salesSerial: string) => {
    return useQuery<SalesViewResponse>({
        queryKey: ["salesView", salesSerial],
        queryFn: async () => {
            const response = await axios.get<SalesViewResponse>(`/api/sales/${salesSerial}`);
            return response.data;
        },
        enabled: !!salesSerial,
    });
};

// Sales 수정
export const useSalesUpdate = (salesSerial: string) => {
    const queryClient = useQueryClient();

    return useMutation<SalesUpdateResponse, Error, SalesUpdateRequest>({
        mutationFn: async (data: SalesUpdateRequest) => {
            const response = await axios.post<SalesUpdateResponse>(`/api/sales/${salesSerial}`, data);
            return response.data;
        },
        onSuccess: () => {
            // 수정 후 해당 sales view 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ["salesView", salesSerial] });
        },
    });
};

// Sales 삭제
export const useSalesDelete = (salesSerial: string) => {
    const queryClient = useQueryClient();

    return useMutation<SalesUpdateResponse, Error, { userId: string; areaCode: string }>({
        mutationFn: async ({ userId, areaCode }) => {
            const response = await axios.delete<SalesUpdateResponse>(
                `/api/sales/${salesSerial}?userId=${userId}&areaCode=${areaCode}`
            );
            return response.data;
        },
        onSuccess: () => {
            // 삭제 후 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ["salesList"] });
        },
    });
};
