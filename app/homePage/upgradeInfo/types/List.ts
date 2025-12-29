export interface UpgradeListItem {
    RowNumber: number;
    serial: string;
    prgName: string;
    title: string;
    writer: string;
    wdate: string;
}

export interface UpgradeListResponse {
    result: boolean;
    data?: {
        items: UpgradeListItem[];
        totalCount: number;
    };
    errMsg?: string;
}
