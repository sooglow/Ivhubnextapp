export interface UserInfo {
    userId: string;
    userName: string;
    deptCode: string;
    areaCode: string;
    userPower: string;
}

export interface AsCaseCreateRequest {
    prgCode: string;
    asCode: string;
    writer: string;
    subject: string;
    question: string;
    answer: string;
    uploadedFile1?: File;
}

export interface AsCaseCreateResponse {
    result: boolean;
    data: {
        serial: string;
    } | null;
    errMsg: string | null;
    errCode: string | null;
}
