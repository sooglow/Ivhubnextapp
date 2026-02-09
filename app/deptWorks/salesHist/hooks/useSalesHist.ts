import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/public/lib/axiosInstance";
import {
    SalesInquiryListResponse,
    UpdateSalesStateRequest,
    UpdateSalesStateResponse,
} from "../types/List";
import {
    SalesActivityListResponse,
    CreateSalesActivityRequest,
    UpdateSalesActivityRequest,
    SalesActivityResponse,
} from "../types/Activity";

// 1. 영업문의 최근 50개 목록 조회
export const useSalesInquiryList = () => {
    return useQuery<SalesInquiryListResponse>({
        queryKey: ["salesInquiryList"],
        queryFn: async () => {
            const response = await axiosInstance.get<SalesInquiryListResponse>("/api/salesHist");
            return response.data;
        },
    });
};

// 2. 영업문의 상태 즉시 수정 (기존 /api/sales 재사용)
export const useUpdateSalesState = () => {
    const queryClient = useQueryClient();

    return useMutation<UpdateSalesStateResponse, Error, UpdateSalesStateRequest>({
        mutationFn: async (data: UpdateSalesStateRequest) => {
            const response = await axiosInstance.post<UpdateSalesStateResponse>("/api/sales", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["salesInquiryList"] });
        },
    });
};

// 3. 성장 및 확장 활동 목록 조회 (StateName="납품")
export const useExpandActivityList = (params: {
    areaCode: string;
    userId: string;
    saleDay1: string;
    saleDay2: string;
    keyword: string;
    pageNumber: number;
    pageSize?: number;
}) => {
    const { areaCode, userId, saleDay1, saleDay2, keyword, pageNumber, pageSize = 3 } = params;

    return useQuery<SalesActivityListResponse>({
        queryKey: [
            "expandActivityList",
            areaCode,
            userId,
            saleDay1,
            saleDay2,
            keyword,
            pageNumber,
        ],
        queryFn: async () => {
            const searchParams = new URLSearchParams({
                AreaCode: areaCode,
                UserId: userId,
                SaleDay1: saleDay1,
                SaleDay2: saleDay2,
                Keyword: keyword,
                StateName: "납품",
                PageNumber: pageNumber.toString(),
                PageSize: pageSize.toString(),
            });

            const response = await axiosInstance.get<SalesActivityListResponse>(
                `/api/salesHist/activity?${searchParams.toString()}`
            );
            return response.data;
        },
        enabled: !!areaCode && !!userId,
    });
};

// 4. 고객 지원 및 관리 활동 목록 조회 (StateName="영업활동")
export const useCustomerActivityList = (params: {
    areaCode: string;
    userId: string;
    saleDay1: string;
    saleDay2: string;
    keyword: string;
    pageNumber: number;
    pageSize?: number;
}) => {
    const { areaCode, userId, saleDay1, saleDay2, keyword, pageNumber, pageSize = 3 } = params;

    return useQuery<SalesActivityListResponse>({
        queryKey: [
            "customerActivityList",
            areaCode,
            userId,
            saleDay1,
            saleDay2,
            keyword,
            pageNumber,
        ],
        queryFn: async () => {
            const searchParams = new URLSearchParams({
                AreaCode: areaCode,
                UserId: userId,
                SaleDay1: saleDay1,
                SaleDay2: saleDay2,
                Keyword: keyword,
                StateName: "영업활동",
                PageNumber: pageNumber.toString(),
                PageSize: pageSize.toString(),
            });

            const response = await axiosInstance.get<SalesActivityListResponse>(
                `/api/salesHist/activity?${searchParams.toString()}`
            );
            return response.data;
        },
        enabled: !!areaCode && !!userId,
    });
};

// 5. 영업활동 생성
export const useCreateSalesActivity = () => {
    const queryClient = useQueryClient();

    return useMutation<SalesActivityResponse, Error, CreateSalesActivityRequest>({
        mutationFn: async (data: CreateSalesActivityRequest) => {
            const response = await axiosInstance.post<SalesActivityResponse>(
                "/api/salesHist/activity",
                data
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expandActivityList"] });
            queryClient.invalidateQueries({ queryKey: ["customerActivityList"] });
        },
    });
};

// 6. 영업활동 수정
export const useUpdateSalesActivity = (actSerial: string) => {
    const queryClient = useQueryClient();

    return useMutation<SalesActivityResponse, Error, UpdateSalesActivityRequest>({
        mutationFn: async (data: UpdateSalesActivityRequest) => {
            const response = await axiosInstance.post<SalesActivityResponse>(
                `/api/salesHist/activity/${actSerial}`,
                data
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expandActivityList"] });
            queryClient.invalidateQueries({ queryKey: ["customerActivityList"] });
        },
    });
};

// 7. 영업활동 삭제
export const useDeleteSalesActivity = (actSerial: string) => {
    const queryClient = useQueryClient();

    return useMutation<SalesActivityResponse, Error, UpdateSalesActivityRequest>({
        mutationFn: async (data: UpdateSalesActivityRequest) => {
            const response = await axiosInstance.delete<SalesActivityResponse>(
                `/api/salesHist/activity/${actSerial}`,
                { data }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expandActivityList"] });
            queryClient.invalidateQueries({ queryKey: ["customerActivityList"] });
        },
    });
};
