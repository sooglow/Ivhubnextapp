// etcSales Edit types
export interface EtcSalesInfo {
    etcSalesSerial: string;
    comName: string;
    comCode: string;
    recMan: string;
    tel: string;
    hp: string;
    area: string;
    addr: string;
    receipter: string;
    kind: string;
    skind: string;
    qty: number;
    reqSum: number;
    inTotal: number;
    misu: number;
    descr: string;
    state: string;
    sendDay: string;
    recDay: string;
}

export interface EtcSalesViewResponse {
    result: boolean;
    data: EtcSalesInfo | null;
    errMsg: string | null;
    errCode: string | null;
}

export interface EtcSalesUpdateRequest {
    etcSalesSerial: string;
    comName: string;
    comCode: string;
    recMan: string;
    tel: string;
    hp: string;
    area: string;
    addr: string;
    receipter: string;
    kind: string;
    skind: string;
    qty: number;
    reqSum: number;
    inTotal: number;
    misu: number;
    descr: string;
    state: string;
    sendDay: string;
}

export interface EtcSalesUpdateResponse {
    result: boolean;
    data: any;
    errMsg: string | null;
    errCode: string | null;
}
