export interface TsSerialViewData {
    comSerial: string;
    name: string;
    idNo: string;
    manCode: string;
    manName: string;
    areaCode: string;
    areaName: string;
    intDay: string;
}

export interface TsSerialViewResponse {
    result: boolean;
    data: TsSerialViewData;
    errMsg?: string;
}
