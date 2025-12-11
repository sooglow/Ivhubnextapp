// etcSales List types
export interface EtcSalesItem {
    rowNumber: number;
    etcSalesSerial: string;
    recDay: string;
    area: string;
    comName: string;
    comCode: string;
    kind: string;
    skind: string;
    qty: number;
    reqSum: number;
    inTotal: number;
    misu: number;
    state: string;
    stateName: string;
    recMan: string;
    totalCount: number;
}

export interface EtcSalesListResponse {
    result: boolean;
    data: {
        items: EtcSalesItem[];
        totalCount: number;
    } | null;
    errMsg: string | null;
    errCode: string | null;
}
