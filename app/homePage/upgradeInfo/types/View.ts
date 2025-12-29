export interface UpgradeViewData {
    serial: string;
    title: string;
    prgName: string;
    preView: string;
    link: string;
    writer: string;
    wdate: string;
}

export interface UpgradeViewResponse {
    result: boolean;
    data?: UpgradeViewData;
    errMsg?: string;
}
