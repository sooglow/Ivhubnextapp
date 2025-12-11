// types/info.ts
export interface InfoItem {
    RowNumber: number;
    checkBoard: boolean;
    serial: string;
    writer: string;
    subject: string;
    visited: number;
    filename1: string;
    filename2: string;
    filesize1: number | null;
    filesize2: number | null;
    wdate: string;
}

export interface InfoListResponse {
    result: boolean;
    data: {
        items: InfoItem[];
        totalCount: number;
    } | null;
    errMsg: string | null;
    errCode: string | null;
}
