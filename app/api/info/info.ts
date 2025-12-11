import { InfoListResponse } from "@/app/info/info/types/List";
import { InfoViewResponse } from "@/app/info/info/types/View";
import { InfoEditRequest, InfoEditResponse } from "@/app/info/info/types/Edit";

// 공지사항 목록 조회
export async function getInfoList(
    keyword: string,
    pageNumber: number,
    pageSize: number,
    userid: string = "",
    areacode: string = ""
): Promise<InfoListResponse> {
    try {
        const params = new URLSearchParams({
            keyword: keyword || "", // null 대신 빈 문자열로 변환
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
            userid: userid,
            areacode: areacode,
        });

        const response = await fetch(`/api/info?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("getInfoList 오류:", error);
        return {
            result: false,
            data: null,
            errMsg: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
            errCode: null,
        };
    }
}

export async function getInfoView(
    serial: string,
    userid: string = "GUEST"
): Promise<InfoViewResponse> {
    try {
        const params = new URLSearchParams({
            userid: userid,
        });

        const response = await fetch(`/api/info/${serial}?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("getInfoView 오류:", error);
        return {
            result: false,
            data: null,
            errMsg: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
            errCode: null,
        };
    }
}

export async function updateInfo(data: InfoEditRequest): Promise<InfoEditResponse> {
    try {
        const formData = new FormData();
        formData.append("serial", data.serial);
        formData.append("subject", data.subject);
        formData.append("writer", data.writer);
        formData.append("content", data.content);
        formData.append("auth", data.auth || "");

        if (data.filename1) formData.append("uploadedFile1", data.filename1);
        if (data.filename2) formData.append("uploadedFile2", data.filename2);

        const response = await fetch("/api/info/Edit", {
            method: "POST",
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error("updateInfo 오류:", error);
        return {
            result: false,
            errMsg: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
            errCode: "NETWORK_ERROR",
        };
    }
}
