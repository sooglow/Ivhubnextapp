import { useMutation, UseMutationResult } from "@tanstack/react-query";
import {
    UpgradeCreateRequest,
    UpgradeCreateResponse,
} from "../types/Create";
import {
    UpgradeEditRequest,
    UpgradeEditResponse,
    UpgradeDeleteResponse,
} from "../types/Edit";

const createUpgrade = async (data: UpgradeCreateRequest): Promise<UpgradeCreateResponse> => {
    const response = await fetch("/api/upgradeBoard/Create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errMsg || "Failed to create upgrade");
    }

    return response.json();
};

const updateUpgrade = async (data: UpgradeEditRequest): Promise<UpgradeEditResponse> => {
    const response = await fetch("/api/upgradeBoard/Edit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errMsg || "Failed to update upgrade");
    }

    return response.json();
};

const deleteUpgrade = async (serial: string): Promise<UpgradeDeleteResponse> => {
    const response = await fetch(`/api/upgradeBoard/${serial}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errMsg || "Failed to delete upgrade");
    }

    return response.json();
};

export const useCreateUpgrade = (): UseMutationResult<
    UpgradeCreateResponse,
    Error,
    UpgradeCreateRequest
> => {
    return useMutation({
        mutationFn: createUpgrade,
    });
};

export const useUpdateUpgrade = (): UseMutationResult<
    UpgradeEditResponse,
    Error,
    UpgradeEditRequest
> => {
    return useMutation({
        mutationFn: updateUpgrade,
    });
};

export const useDeleteUpgrade = (): UseMutationResult<
    UpgradeDeleteResponse,
    Error,
    string
> => {
    return useMutation({
        mutationFn: deleteUpgrade,
    });
};
