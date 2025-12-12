export interface MaintenanceViewData {
    serial?: string;
    comCode: string;
    asComName: string;
    asDay: string;
    userId: string;
    subject: string;
    asMemo: string;
    asResult: string;
    bigo: string;
    result: string;
    wdate: string;
    writer?: string;
}

export interface MaintenanceViewResponse {
    result: boolean;
    data: MaintenanceViewData;
    errMsg?: string;
}

export interface MaintenanceUpdateRequest {
    serial?: string;
    comCode: string;
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
