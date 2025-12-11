export interface UserInfo {
    userId: string;
    [key: string]: string;
}

export interface CreateResponse {
    result: boolean;
    errMsg?: string;
    data?: {
        serial: number;
    };
}
