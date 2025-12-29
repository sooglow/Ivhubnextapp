// 업계 이슈 목록 아이템 타입
export interface IvIssueItem {
    RowNumber: number;
    serial: string;
    title: string;
    writer: string;
    wdate: string;
}

// 업계 이슈 목록 응답 타입
export interface IvIssueListResponse {
    result: boolean;
    data: {
        items: IvIssueItem[];
        totalCount: number;
    } | null;
    errMsg: string | null;
}
