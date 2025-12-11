// types/Edit.ts

export interface InfoEditRequest {
    serial: string;
    subject: string;
    writer: string;
    content: string;
    ip: string;
    auth: string;

    uploadedFile1?: File | null;
    uploadedFile2?: File | null;

    filename1?: string | null;
    filesize1?: number | null;
    filename2?: string | null;
    filesize2?: number | null;
}

export interface InfoEditResponse {
    result: boolean;
    errMsg: string | null;
    errCode: string | null;
}

export interface EditFormState {
    subject: string;
    content: string;
    auth: string;
    filename1: File | null;
    filename2: File | null;
    file1Key: number;
    file2Key: number;
}

export interface FileInfo {
    serial: string;
    filename1?: string | null;
    filesize1?: number | null;
    filename2?: string | null;
    filesize2?: number | null;
}
