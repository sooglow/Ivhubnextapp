import { IvFaqListResponse } from "@/app/homePage/ivFaq/types/List";
import { IvFaqViewResponse } from "@/app/homePage/ivFaq/types/View";

export async function getFaqBoardList(
    kind: string,
    keyword: string,
    currentPage: number,
    pageSize: number
): Promise<IvFaqListResponse> {
    const params = new URLSearchParams({
        kind: kind || "",
        keyword: keyword || "",
        pageNumber: currentPage.toString(),
        pageSize: pageSize.toString(),
    });

    const response = await fetch(`/api/faqBoard?${params}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch faqBoard list");
    }

    return response.json();
}

export async function getFaqBoardView(serial: string): Promise<IvFaqViewResponse> {
    const response = await fetch(`/api/faqBoard/${serial}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch faqBoard detail");
    }

    return response.json();
}

export async function createFaqBoard(data: {
    kind: string;
    title: string;
    contents: string;
}): Promise<any> {
    const response = await fetch("/api/faqBoard/Create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to create faqBoard");
    }

    return response.json();
}

export async function updateFaqBoard(data: {
    serial: string;
    kind: string;
    title: string;
    contents: string;
}): Promise<any> {
    const response = await fetch("/api/faqBoard/Edit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to update faqBoard");
    }

    return response.json();
}

export async function deleteFaqBoard(serial: string): Promise<any> {
    const response = await fetch(`/api/faqBoard/${serial}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete faqBoard");
    }

    return response.json();
}
