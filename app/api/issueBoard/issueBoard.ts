import { IvIssueListResponse } from "@/app/homePage/ivIssue/types/List";
import { IvIssueViewResponse } from "@/app/homePage/ivIssue/types/View";

export async function getIssueBoardList(
    keyword: string,
    currentPage: number,
    pageSize: number
): Promise<IvIssueListResponse> {
    const params = new URLSearchParams({
        keyword: keyword || "",
        pageNumber: currentPage.toString(),
        pageSize: pageSize.toString(),
    });

    const response = await fetch(`/api/issueBoard?${params}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch issueBoard list");
    }

    return response.json();
}

export async function getIssueBoardView(serial: string): Promise<IvIssueViewResponse> {
    const response = await fetch(`/api/issueBoard/${serial}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch issueBoard detail");
    }

    return response.json();
}

export async function createIssueBoard(data: {
    title: string;
    writer: string;
    link: string;
}): Promise<any> {
    const response = await fetch("/api/issueBoard/Create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to create issueBoard");
    }

    return response.json();
}

export async function updateIssueBoard(data: {
    serial: string;
    title: string;
    writer: string;
    link: string;
}): Promise<any> {
    const response = await fetch("/api/issueBoard/Edit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to update issueBoard");
    }

    return response.json();
}

export async function deleteIssueBoard(serial: string): Promise<any> {
    const response = await fetch(`/api/issueBoard/${serial}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete issueBoard");
    }

    return response.json();
}
