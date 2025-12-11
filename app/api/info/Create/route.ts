import { InfoCreateRequest, InfoCreateResponse } from "@/app/info/info/types/Create";

export async function createOrUpdateInfo(data: InfoCreateRequest): Promise<InfoCreateResponse> {
    try {
        const response = await fetch("/api/info/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("createOrUpdateInfo 오류:", error);
        return {
            result: false,
            errMsg: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
            errCode: "NETWORK_ERROR",
        };
    }
}

export async function createInfo(
    data: Omit<InfoCreateRequest, "serial">
): Promise<InfoCreateResponse> {
    return createOrUpdateInfo({ ...data, serial: undefined });
}

export async function updateInfo(
    serial: string,
    data: Omit<InfoCreateRequest, "serial">
): Promise<InfoCreateResponse> {
    return createOrUpdateInfo({ ...data, serial });
}
