// UserInfo 타입
export interface UserInfo {
    userId: string;
    userName: string;
}

// 업계 이슈 생성 요청 타입
export interface IvIssueCreateRequest {
    title: string;
    writer: string;
    link: string;
}

// 업계 이슈 생성 응답 타입
export interface IvIssueCreateResponse {
    result: boolean;
    data: any;
    errMsg: string | null;
}
