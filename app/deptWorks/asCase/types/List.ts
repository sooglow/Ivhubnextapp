export interface AsCaseItem {
    RowNumber: number;
    serial: string;
    prgCode: string;
    prgName: string;
    asCode: string;
    asName: string;
    writer: string;
    subject: string;
    visited: number;
    fileName1: string;
    fileSize1: number | null;
    wdate: string;
}

export interface AsCaseListResponse {
    result: boolean;
    data: {
        items: AsCaseItem[];
        totalCount: number;
    } | null;
    errMsg: string | null;
    errCode: string | null;
}
