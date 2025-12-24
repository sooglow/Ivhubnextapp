// UserInfo 타입
export interface UserInfo {
    userId: string;
    userName: string;
}

// FAQ 게시판 생성 요청 타입
export interface IvFaqCreateRequest {
    kind: string;
    title: string;
    contents: string;
}

// FAQ 게시판 생성 응답 타입
export interface IvFaqCreateResponse {
    result: boolean;
    data: any;
    errMsg: string | null;
}
