// UserInfo 타입
export interface UserInfo {
    userId: string;
    userName: string;
    userPower: string;
}

// FAQ 게시판 수정 요청 타입
export interface IvFaqEditRequest {
    serial: string;
    kind: string;
    title: string;
    contents: string;
}

// FAQ 게시판 수정 응답 타입
export interface IvFaqEditResponse {
    result: boolean;
    data: any;
    errMsg: string | null;
}
