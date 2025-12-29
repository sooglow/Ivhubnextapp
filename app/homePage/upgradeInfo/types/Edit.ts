export interface UpgradeEditRequest {
    serial: string;
    title: string;
    prgName: string;
    preView: string;
    link: string;
    writer: string;
}

export interface UpgradeEditResponse {
    result: boolean;
    data?: string;
    errMsg?: string;
}

export interface UpgradeDeleteResponse {
    result: boolean;
    data?: string;
    errMsg?: string;
}
