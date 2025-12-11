export interface AsCaseViewItem {
    serial: string;
    prgCode: string;
    prgName: string;
    asCode: string;
    asName: string;
    writer: string;
    subject: string;
    question: string;
    answer: string;
    visited: number;
    fileName1: string;
    fileSize1: number | null;
    wdate: string;
}

export interface AsCaseViewResponse {
    result: boolean;
    data: AsCaseViewItem | null;
    errMsg: string | null;
    errCode: string | null;
}
