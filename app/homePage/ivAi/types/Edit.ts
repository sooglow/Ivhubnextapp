// UserInfo 타입
export interface UserInfo {
    userId: string;
    userName: string;
    userPower: string;
}

// AI 게시판 수정 요청 타입
export interface IvAiEditRequest {
    serial: string;
    subject: string;
    writer: string;
    ip: string;
    contents: string;
}

// AI 게시판 수정 응답 타입
export interface IvAiEditResponse {
    result: boolean;
    data: any;
    errMsg: string | null;
}
