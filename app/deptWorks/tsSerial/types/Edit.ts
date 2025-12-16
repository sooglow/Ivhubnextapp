export interface TsSerialUpdateRequest {
    comSerial: string;
    name: string;
    idNo: string;
    manCode: string;
    areaCode: string;
}

export interface TsSerialUpdateResponse {
    result: boolean;
    data?: any;
    errMsg?: string;
}
