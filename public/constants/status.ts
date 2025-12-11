export const SALESTATUS = [
    { statusCode: "0", statusName: "대기" },
    { statusCode: "1", statusName: "진행" },
    { statusCode: "2", statusName: "취소" },
    { statusCode: "3", statusName: "납예" },
    { statusCode: "4", statusName: "납품" },
];

/**
 * salesState 코드를 statusName으로 변환
 */
export const getSalesStatusName = (statusCode: string): string => {
    const status = SALESTATUS.find((item) => item.statusCode === statusCode);
    return status?.statusName || "";
};
