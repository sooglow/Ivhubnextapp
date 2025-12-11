export interface CodeItem {
    code: string;
    codename: string;
}

export interface CodeListResponse {
    result: boolean;
    data: {
        items: CodeItem[];
    } | null;
    errMsg: string | null;
    errCode: string | null;
}
