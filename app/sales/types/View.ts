// Sales View 관련 타입 정의

export interface SalesInfo {
    salesSerial: string;
    callDay: string;
    area: string;
    comName: string;
    salesMan: string;
    salesType: string;
    salesState: number;
    salesStateName: string;
    comCode: string;
    salesArea: string;
    comMan: string;
    comTel: string;
    hp: string;
    comAddr: string;
    salesPath: string;
    prgName: string;
    callMan: string;
    salesDescr: string;
    salesOutDescr: string;
}

export interface SalesComPrgItem {
    prgName: string;
    luseName: string;
    luseDt: string;
    ssoDay: string;
}

export interface SalesViewData {
    salesInfo: SalesInfo;
    salesComPrgItems: SalesComPrgItem[];
}

export interface SalesViewResponse {
    result: boolean;
    data: SalesViewData;
    errMsg: string | null;
    errCode: string | null;
}

export interface SalesUpdateRequest {
    salesSerial: string;
    salesMan: string;
    salesArea: string;
    salesState: number;
}

export interface SalesUpdateResponse {
    result: boolean;
    data: null;
    errMsg: string | null;
    errCode: string | null;
}
