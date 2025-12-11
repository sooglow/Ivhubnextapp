// app/info/info/types/View.ts
export interface InfoViewItem {
    serial: string;
    subject: string;
    writer: string;
    visited: number;
    wdate: string;
    filename1: string;
    filename2: string;
    filesize1: string;
    filesize2: string;
    content: string;
    auth: string;
}

export interface InfoViewResponse {
    result: boolean;
    data: InfoViewItem | null;
    errMsg: string | null;
    errCode: string | null;
}
