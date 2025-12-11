export interface AsCaseEditRequest {
    serial: string;
    prgCode: string;
    asCode: string;
    writer: string;
    subject: string;
    question: string;
    answer: string;
    uploadedFile1?: File;
}

export interface AsCaseEditResponse {
    result: boolean;
    data: any | null;
    errMsg: string | null;
    errCode: string | null;
}
