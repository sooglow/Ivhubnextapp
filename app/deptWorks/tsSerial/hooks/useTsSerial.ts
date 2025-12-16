import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { TsSerialListResponse } from "../types/List";
import { TsSerialViewResponse } from "../types/View";
import { TsSerialUpdateRequest, TsSerialUpdateResponse } from "../types/Edit";
import { TsSerialCreateResponse } from "../types/Create";

// 국토부 시리얼 목록 조회
export const useTsSerialList = (keyword: string = "") => {
    return useQuery<TsSerialListResponse>({
        queryKey: ["tsSerialList", keyword],
        queryFn: async () => {
            const response = await axios.get<TsSerialListResponse>(
                `/api/tsSerial?keyword=${keyword}`
            );
            return response.data;
        },
    });
};

// 국토부 시리얼 상세 조회
export const useTsSerialView = (serial: string) => {
    return useQuery<TsSerialViewResponse>({
        queryKey: ["tsSerialView", serial],
        queryFn: async () => {
            const response = await axios.get<TsSerialViewResponse>(`/api/tsSerial/${serial}`);
            return response.data;
        },
        enabled: !!serial,
    });
};

// 국토부 시리얼 추가 생성
export const useTsSerialCreate = () => {
    const queryClient = useQueryClient();

    return useMutation<TsSerialCreateResponse, Error>({
        mutationFn: async () => {
            const response = await axios.post<TsSerialCreateResponse>(`/api/tsSerial`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tsSerialList"] });
        },
    });
};

// 국토부 시리얼 수정
export const useTsSerialUpdate = (serial: string) => {
    const queryClient = useQueryClient();

    return useMutation<TsSerialUpdateResponse, Error, TsSerialUpdateRequest>({
        mutationFn: async (data: TsSerialUpdateRequest) => {
            const response = await axios.post<TsSerialUpdateResponse>(
                `/api/tsSerial/${serial}`,
                data
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tsSerialView", serial] });
            queryClient.invalidateQueries({ queryKey: ["tsSerialList"] });
        },
    });
};

// 국토부 시리얼 삭제
export const useTsSerialDelete = (serial: string) => {
    const queryClient = useQueryClient();

    return useMutation<TsSerialUpdateResponse, Error>({
        mutationFn: async () => {
            const response = await axios.delete<TsSerialUpdateResponse>(`/api/tsSerial/${serial}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tsSerialList"] });
        },
    });
};
