// AI 게시판 목록 아이템 타입
export interface IvAiItem {
    RowNumber: number;
    serial: string;
    subject: string;
    writer: string;
    wdate: string;
    visited: number;
}

// AI 게시판 목록 응답 타입
export interface IvAiListResponse {
    result: boolean;
    data: {
        items: IvAiItem[];
        totalCount: number;
    } | null;
    errMsg: string | null;
}
