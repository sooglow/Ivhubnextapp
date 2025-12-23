// AI 게시판 상세 아이템 타입
export interface IvAiViewItem {
    serial: string;
    subject: string;
    writer: string;
    visited: number;
    wdate: string;
    contents: string;
}

// AI 게시판 상세 응답 타입
export interface IvAiViewResponse {
    result: boolean;
    data: IvAiViewItem | null;
    errMsg: string | null;
}

// UserInfo 타입
export interface UserInfo {
    userId: string;
    userName: string;
}
