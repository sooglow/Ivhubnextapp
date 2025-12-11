export interface UserInfo {
    userId: string;
    userPower: string;
}

export interface MaintenanceCreateRequest {
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

export interface MaintenanceCreateResponse {
    result: boolean;
    errMsg?: string;
}
