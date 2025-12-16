export interface TsSerialListItem {
    comSerial: string;
    name: string;
    idNo: string;
    manCode: string;
    manName: string;
    areaCode: string;
    areaName: string;
    intDay: string;
}

export interface TsSerialListResponse {
    result: boolean;
    data: TsSerialListItem[];
    totalCount: number;
    errMsg?: string;
}
