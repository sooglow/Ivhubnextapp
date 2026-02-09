// SOLUTION 상수 정의
export const SOLUTION = [
    { solutionCode: "AUTO7", solutionName: "오토7" },
    { solutionCode: "AUTOPOS", solutionName: "오토포스" },
    { solutionCode: "AUTOX", solutionName: "오토X" },
    { solutionCode: "KAIMA", solutionName: "카이마" },
    { solutionCode: "NEO", solutionName: "네오하이웨이" },
    { solutionCode: "BIZ5", solutionName: "비즈5" },
    { solutionCode: "ETC", solutionName: "부가서비스" },
];

// Upgrade Info 용 SOLUTION 상수
export const SOLUTION_UPGRADE_INFO = [
    { solutionCode: "AUTO7", solutionName: "AUTO7" },
    { solutionCode: "AUTO6", solutionName: "AUTO6" },
    { solutionCode: "AUTOSTOCK", solutionName: "재고" },
    { solutionCode: "AUTOMANAGE", solutionName: "경영" },
    { solutionCode: "AUTOCENTER", solutionName: "센터" },
    { solutionCode: "AUTONET", solutionName: "AUTONET" },
];

// SOLUTION 매핑
export const SOLUTION_MAPPING: Record<string, string> = {
    AUTO7: "AUTO7",
    AUTO6: "AUTO6",
    AUTOSTOCK: "재고",
    AUTOMANAGE: "경영",
    AUTOCENTER: "센터",
    AUTONET: "AUTONET",
    "01": "하이웨이",
    "02": "하이퀵",
    "03": "하이픽",
    "04": "하이콜",
    "05": "하이원",
};
