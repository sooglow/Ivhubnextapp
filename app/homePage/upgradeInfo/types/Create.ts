export interface UpgradeCreateRequest {
    title: string;
    prgName: string;
    preView: string;
    link: string;
    writer: string;
}

export interface UpgradeCreateResponse {
    result: boolean;
    data?: string;
    errMsg?: string;
}
