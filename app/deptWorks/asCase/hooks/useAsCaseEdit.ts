import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAsCase, updateAsCase, deleteAsCase } from "@/app/api/asCase/asCase";

export function useAsCaseCreate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => createAsCase(formData),
        onSuccess: () => {
            queryClient.invalidateQueries(["asCaseList"]);
        },
    });
}

export function useAsCaseUpdate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => updateAsCase(formData),
        onSuccess: () => {
            queryClient.invalidateQueries(["asCaseList"]);
            queryClient.invalidateQueries(["asCaseView"]);
        },
    });
}

export function useAsCaseDelete() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (serial: string) => deleteAsCase(serial),
        onSuccess: () => {
            queryClient.invalidateQueries(["asCaseList"]);
        },
    });
}
