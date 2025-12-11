import { useMutation } from "@tanstack/react-query";
import { updateInfo } from "@/app/api/info/info";

export function useUpdateInfo() {
    return useMutation({
        mutationFn: updateInfo,
    });
}
