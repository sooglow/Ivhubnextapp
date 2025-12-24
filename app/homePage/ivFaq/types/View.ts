// FAQ 게시판 상세 아이템 타입
export interface IvFaqViewItem {
    serial: string;
    kind: string;
    title: string;
    writer: string;
    update_dt: string;
    contents: string;
}

// FAQ 게시판 상세 응답 타입
export interface IvFaqViewResponse {
    result: boolean;
    data: IvFaqViewItem | null;
    errMsg: string | null;
}

// UserInfo 타입
export interface UserInfo {
    userId: string;
    userName: string;
}
