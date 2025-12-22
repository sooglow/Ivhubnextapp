// UserInfo 타입
export interface UserInfo {
    userId: string;
    userName: string;
}

// 공지사항 수정 요청 타입
export interface IvInfoEditRequest {
    serial: string;
    subject: string;
    writer: string;
    ip: string;
    contents: string;
}

// 공지사항 수정 응답 타입
export interface IvInfoEditResponse {
    result: boolean;
    data: any;
    errMsg: string | null;
}
