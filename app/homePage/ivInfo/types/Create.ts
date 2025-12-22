// UserInfo 타입
export interface UserInfo {
    userId: string;
    userName: string;
}

// 공지사항 생성 요청 타입
export interface IvInfoCreateRequest {
    subject: string;
    writer: string;
    ip: string;
    contents: string;
}

// 공지사항 생성 응답 타입
export interface IvInfoCreateResponse {
    result: boolean;
    data: any;
    errMsg: string | null;
}
