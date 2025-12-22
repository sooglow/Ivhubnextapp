// 공지사항 상세 아이템 타입
export interface IvInfoViewItem {
    serial: string;
    subject: string;
    writer: string;
    visited: number;
    wdate: string;
    contents: string;
}

// 공지사항 상세 응답 타입
export interface IvInfoViewResponse {
    result: boolean;
    data: IvInfoViewItem | null;
    errMsg: string | null;
}

// UserInfo 타입
export interface UserInfo {
    userId: string;
    userName: string;
}
