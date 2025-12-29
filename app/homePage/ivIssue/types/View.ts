// 업계 이슈 상세 아이템 타입
export interface IvIssueViewItem {
    serial: string;
    title: string;
    writer: string;
    wdate: string;
    link: string;
}

// 업계 이슈 상세 응답 타입
export interface IvIssueViewResponse {
    result: boolean;
    data: IvIssueViewItem | null;
    errMsg: string | null;
}

// UserInfo 타입
export interface UserInfo {
    userId: string;
    userName: string;
}
