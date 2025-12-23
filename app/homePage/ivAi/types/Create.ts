// UserInfo 타입
export interface UserInfo {
    userId: string;
    userName: string;
}

// AI 게시판 생성 요청 타입
export interface IvAiCreateRequest {
    subject: string;
    writer: string;
    ip: string;
    contents: string;
}

// AI 게시판 생성 응답 타입
export interface IvAiCreateResponse {
    result: boolean;
    data: any;
    errMsg: string | null;
}
