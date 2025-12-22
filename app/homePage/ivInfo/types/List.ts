// 공지사항 목록 아이템 타입
export interface IvInfoItem {
    RowNumber: number;
    serial: string;
    subject: string;
    writer: string;
    wdate: string;
    visited: number;
}

// 공지사항 목록 응답 타입
export interface IvInfoListResponse {
    result: boolean;
    data: {
        items: IvInfoItem[];
        totalCount: number;
    } | null;
    errMsg: string | null;
}
