export interface MaintenanceListItem {
    maintenanceSerial: string;
    comCode: string;
    comName: string;
    asDay: string;
    userId: string;
    subject: string;
    result: string;
}

export interface MaintenanceListResponse {
    result: boolean;
    data: MaintenanceListItem[];
    totalCount: number;
    errMsg?: string;
}
