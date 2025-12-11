import { AsCaseListResponse } from "@/app/deptWorks/asCase/types/List";
import { AsCaseViewResponse } from "@/app/deptWorks/asCase/types/View";

export async function getAsCaseList(
    prgcode: string,
    keyword: string,
    currentPage: number,
    pageSize: number
): Promise<AsCaseListResponse> {
    const params = new URLSearchParams({
        prgcode: prgcode || "",
        keyword: keyword || "",
        pageNumber: currentPage.toString(),
        pageSize: pageSize.toString(),
    });

    const response = await fetch(`/api/asCase?${params}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch asCase list");
    }

    return response.json();
}

export async function getAsCaseView(serial: string): Promise<AsCaseViewResponse> {
    const response = await fetch(`/api/asCase/${serial}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch asCase detail");
    }

    return response.json();
}

export async function createAsCase(formData: FormData): Promise<any> {
    const response = await fetch("/api/asCase/Create", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to create asCase");
    }

    return response.json();
}

export async function updateAsCase(formData: FormData): Promise<any> {
    const response = await fetch("/api/asCase/Edit", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to update asCase");
    }

    return response.json();
}

export async function deleteAsCase(serial: string): Promise<any> {
    const response = await fetch(`/api/asCase/${serial}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete asCase");
    }

    return response.json();
}

export async function deleteAsCaseFile(serial: string, fileNumber: number): Promise<any> {
    const response = await fetch(`/api/asCase/${serial}/deleteFile`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileNumber }),
    });

    if (!response.ok) {
        throw new Error("Failed to delete file");
    }

    return response.json();
}
