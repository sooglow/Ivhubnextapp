import { IvInfoListResponse } from "@/app/homePage/ivInfo/types/List";
import { IvInfoViewResponse } from "@/app/homePage/ivInfo/types/View";

export async function getIvBoardList(
    keyword: string,
    currentPage: number,
    pageSize: number
): Promise<IvInfoListResponse> {
    const params = new URLSearchParams({
        keyword: keyword || "",
        pageNumber: currentPage.toString(),
        pageSize: pageSize.toString(),
    });

    const response = await fetch(`/api/ivBoard?${params}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch ivBoard list");
    }

    return response.json();
}

export async function getIvBoardView(serial: string): Promise<IvInfoViewResponse> {
    const response = await fetch(`/api/ivBoard/${serial}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch ivBoard detail");
    }

    return response.json();
}

export async function createIvBoard(data: {
    subject: string;
    writer: string;
    ip: string;
    contents: string;
}): Promise<any> {
    const response = await fetch("/api/ivBoard/Create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to create ivBoard");
    }

    return response.json();
}

export async function updateIvBoard(data: {
    serial: string;
    subject: string;
    writer: string;
    ip: string;
    contents: string;
}): Promise<any> {
    const response = await fetch("/api/ivBoard/Edit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to update ivBoard");
    }

    return response.json();
}

export async function deleteIvBoard(serial: string): Promise<any> {
    const response = await fetch(`/api/ivBoard/${serial}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete ivBoard");
    }

    return response.json();
}
