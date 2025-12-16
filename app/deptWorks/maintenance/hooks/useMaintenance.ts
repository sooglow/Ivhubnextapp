import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
    MaintenanceListResponse,
    MaintenanceViewResponse,
    MaintenanceUpdateRequest,
    MaintenanceUpdateResponse,
} from "../types/Edit";

// 유지보수 계약업체 목록 조회
export const useMaintenanceList = (comCode: string = "", keyword: string = "", pageNumber: number = 1, pageSize: number = 10) => {
    return useQuery<MaintenanceListResponse>({
        queryKey: ["maintenanceList", comCode, keyword, pageNumber, pageSize],
        queryFn: async () => {
            const response = await axios.get<MaintenanceListResponse>(
                `/api/maintenance?comCode=${comCode}&keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`
            );
            return response.data;
        },
    });
};

// 유지보수 계약업체 상세 조회
export const useMaintenanceView = (serial: string) => {
    return useQuery<MaintenanceViewResponse>({
        queryKey: ["maintenanceView", serial],
        queryFn: async () => {
            const response = await axios.get<MaintenanceViewResponse>(`/api/maintenance/${serial}`);
            return response.data;
        },
        enabled: !!serial,
    });
};

// 유지보수 계약업체 생성
export const useMaintenanceCreate = () => {
    const queryClient = useQueryClient();

    return useMutation<MaintenanceUpdateResponse, Error, MaintenanceUpdateRequest>({
        mutationFn: async (data: MaintenanceUpdateRequest) => {
            const response = await axios.post<MaintenanceUpdateResponse>(`/api/maintenance`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maintenanceList"] });
        },
    });
};

// 유지보수 계약업체 수정
export const useMaintenanceUpdate = (serial: string) => {
    const queryClient = useQueryClient();

    return useMutation<MaintenanceUpdateResponse, Error, MaintenanceUpdateRequest>({
        mutationFn: async (data: MaintenanceUpdateRequest) => {
            const response = await axios.post<MaintenanceUpdateResponse>(
                `/api/maintenance/${serial}`,
                data
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maintenanceView", serial] });
            queryClient.invalidateQueries({ queryKey: ["maintenanceList"] });
        },
    });
};

// 유지보수 계약업체 삭제
export const useMaintenanceDelete = (serial: string) => {
    const queryClient = useQueryClient();

    return useMutation<MaintenanceUpdateResponse, Error>({
        mutationFn: async () => {
            const response = await axios.delete<MaintenanceUpdateResponse>(`/api/maintenance/${serial}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maintenanceList"] });
        },
    });
};
