export interface MaintenanceViewData {
    maintenanceSerial: string;
    comCode: string;
    comName: string;
    asDay: string;
    userId: string;
    subject: string;
    asMemo: string;
    asResult: string;
    bigo: string;
    result: string;
}

export interface MaintenanceViewResponse {
    result: boolean;
    data: MaintenanceViewData;
    errMsg?: string;
}

export interface MaintenanceUpdateRequest {
    maintenanceSerial: string;
    comCode: string;
    comName: string;
    asDay: string;
    userId: string;
    subject: string;
    asMemo: string;
    asResult: string;
    bigo: string;
    result: string;
}

export interface MaintenanceUpdateResponse {
    result: boolean;
    errMsg?: string;
}
