// FAQ 게시판 목록 아이템 타입
export interface IvFaqItem {
    RowNumber: number;
    serial: string;
    kind: string;
    title: string;
    update_dt: string;
}

// FAQ 게시판 목록 응답 타입
export interface IvFaqListResponse {
    result: boolean;
    data: {
        items: IvFaqItem[];
        totalCount: number;
    } | null;
    errMsg: string | null;
}
