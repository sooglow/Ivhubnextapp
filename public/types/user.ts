export interface userInfo {
    userId?: string;
    deptCode?: string;
    [key: string]: string | undefined;
}

interface TokenInfo {
    token: string;
    refreshToken: string;
}
