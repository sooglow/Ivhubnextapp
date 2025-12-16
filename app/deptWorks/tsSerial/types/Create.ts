export interface TsSerialCreateRequest {
    // 추가생성 API는 파라미터 없이 POST만 하면 됨
}

export interface TsSerialCreateResponse {
    result: boolean;
    data?: {
        comSerial?: string;
    };
    errMsg?: string;
}
