// UserInfo 타입
export interface UserInfo {
    userId: string;
    userName: string;
}

// 업계 이슈 수정 요청 타입
export interface IvIssueEditRequest {
    serial: string;
    title: string;
    writer: string;
    link: string;
}

// 업계 이슈 수정 응답 타입
export interface IvIssueEditResponse {
    result: boolean;
    data: any;
    errMsg: string | null;
}
