// etcSales Create types
export interface EtcSalesCreateRequest {
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

export interface EtcSalesCreateResponse {
    result: boolean;
    data: any;
    errMsg: string | null;
    errCode: string | null;
}

export interface UserInfo {
    userId: string;
    userName: string;
    areaCode: string;
    deptCode: string;
    userPower: string;
}
