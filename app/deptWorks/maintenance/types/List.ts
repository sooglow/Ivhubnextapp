export interface MaintenanceListItem {
    rowNumber: number;
    serial: string;
    comCode: string;
    asComName: string;
    asDay: string;
    userId: string;
    subject: string;
    result: string;
    totalCount?: number;
}

export interface MaintenanceListResponse {
    result: boolean;
    data: MaintenanceListItem[];
    totalCount: number;
    errMsg?: string;
}
