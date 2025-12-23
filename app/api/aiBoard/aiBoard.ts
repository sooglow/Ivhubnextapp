import { IvAiListResponse } from "@/app/homePage/ivAi/types/List";
import { IvAiViewResponse } from "@/app/homePage/ivAi/types/View";

export async function getAiBoardList(
    keyword: string,
    currentPage: number,
    pageSize: number
): Promise<IvAiListResponse> {
    const params = new URLSearchParams({
        keyword: keyword || "",
        pageNumber: currentPage.toString(),
        pageSize: pageSize.toString(),
    });

    const response = await fetch(`/api/aiBoard?${params}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch aiBoard list");
    }

    return response.json();
}

export async function getAiBoardView(serial: string): Promise<IvAiViewResponse> {
    const response = await fetch(`/api/aiBoard/${serial}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch aiBoard detail");
    }

    return response.json();
}

export async function createAiBoard(data: {
    subject: string;
    writer: string;
    ip: string;
    contents: string;
}): Promise<any> {
    const response = await fetch("/api/aiBoard/Create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to create aiBoard");
    }

    return response.json();
}

export async function updateAiBoard(data: {
    serial: string;
    subject: string;
    writer: string;
    ip: string;
    contents: string;
}): Promise<any> {
    const response = await fetch("/api/aiBoard/Edit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to update aiBoard");
    }

    return response.json();
}

export async function deleteAiBoard(serial: string): Promise<any> {
    const response = await fetch(`/api/aiBoard/${serial}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete aiBoard");
    }

    return response.json();
}
