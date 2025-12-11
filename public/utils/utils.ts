// lib/utils/utils.ts - JSX 없이 정리된 버전
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// CSS class 결합 함수
export function cls(...classnames: string[]): string {
    return classnames.join(" ");
}

// Tailwind merge 함수
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

// 문자열 자르기 함수
export function truncate(str: string | undefined | null, n: number): string {
    return str && str.length > n ? str.substr(0, n - 1) : str || "";
}

// 팝업 가운데 띄우기 함수
export function openCenteredPopup(
    url: string,
    comcode: string,
    prgcode: string,
    width: number = 700,
    height: number = 500
): void {
    const targetUrl = `${url}?comcode=${comcode}&prgcode=${prgcode}`;

    const screenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screen.left;
    const screenTop = window.screenTop !== undefined ? window.screenTop : window.screen.top;

    const screenWidth = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : window.screen.width;

    const screenHeight = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : window.screen.height;

    const left = screenWidth / 2 - width / 2 + screenLeft;
    const top = screenHeight / 2 - height / 2 + screenTop;

    const newWindow = window.open(
        targetUrl,
        "Popup",
        `scrollbars=yes, width=${width}, height=${height}, top=${top}, left=${left}`
    );

    if (window.focus && newWindow) {
        newWindow.focus();
    }
}

// 로그아웃 처리 함수
export function logOutProc(): void {
    safeLocalStorage.removeItem("atKey");
    safeLocalStorage.removeItem("menu");
    window.location.href = "/login";
}

// 부서코드 정정 함수
export function deptCodeName(deptCode: string): string {
    const deptMap: Record<string, string> = {
        "01": "영업부",
        "02": "지원부",
        "03": "개발부",
    };

    return deptMap[deptCode] || deptCode;
}

// JWT 토큰 페이로드 인터페이스
export interface JWTPayload {
    userId: string;
    areaCode: string;
    userPower: string;
    deptCode: string;
}

// JWT Token payload 파싱 함수
export function parseJWT(token: string | null | undefined): JWTPayload | null {
    if (!token) return null;

    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );

        const payload = JSON.parse(jsonPayload);
        return {
            userId: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
            areaCode: payload.AreaCode,
            userPower: payload.UserPower,
            deptCode: payload.DeptCode,
        };
    } catch (e) {
        console.error("Error parsing JWT:", e);
        return null;
    }
}

// 상태 저장용 범용 함수
export const saveStateToSessionStorage = (state: Record<string, any>): void => {
    const listState = JSON.parse(sessionStorage.getItem("listState") || "{}");
    const addedListState = { ...listState, ...state };
    sessionStorage.setItem("listState", JSON.stringify(addedListState));
};

// 첨부파일 체크
export const handleFileChange =
    (
        setFile: React.Dispatch<React.SetStateAction<File | null>>,
        setFileKey: React.Dispatch<React.SetStateAction<number>>
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) return;

        if (!isValidExtension(selectedFile)) {
            alert("첨부할 수 없는 확장자입니다.");
            setFileKey((prevKey) => prevKey + 1);
            return;
        }
        setFile(selectedFile);
    };

// 첨부파일 다중 체크
export const handleMultipleFileChange =
    (
        setFile: React.Dispatch<React.SetStateAction<File[]>>,
        setFileKey: React.Dispatch<React.SetStateAction<number>>
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
        const selectedFiles = Array.from(event.target.files || []);
        const validFiles = selectedFiles.filter((file) => isValidExtension(file));

        if (validFiles.length !== selectedFiles.length) {
            alert("첨부할 수 없는 확장자가 포함되어 있습니다.");
            setFileKey((prevKey) => prevKey + 1);
        }

        setFile((prevFiles) => [...prevFiles, ...validFiles]);
    };

// 파일 확장자 체크
export const isValidExtension = (file: File): boolean => {
    if (!file?.name) return false;

    const allowedExtensions = (
        process.env.NEXT_PUBLIC_ALLOWED_EXTENSIONS ||
        ".jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.hwpx,.zip,.alz,.txt,.csv,.mp4,.mp3,.avi,.mov"
    )
        .split(",")
        .map((ext) => ext.trim().toLowerCase());

    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    return allowedExtensions.includes(fileExtension);
};

export const getFileDownloadUrl = (fileName: string | null | undefined): string => {
    if (!fileName) return "";

    return `/api/file/download/${encodeURIComponent(fileName)}`;
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 날짜 포맷팅 함수
export const formatDate = (date: string | Date, format: "short" | "long" = "short"): string => {
    const d = new Date(date);

    if (isNaN(d.getTime())) return "";

    if (format === "short") {
        return d.toISOString().slice(0, 19).replace("T", " ");
    } else {
        return d.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
};

// 디바운스 함수
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// 로컬 스토리지 안전 접근 함수
export const safeLocalStorage = {
    getItem: (key: string): string | null => {
        if (typeof window === "undefined") return null;
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    },

    setItem: (key: string, value: string): void => {
        if (typeof window === "undefined") return;
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn("localStorage setItem failed:", error);
        }
    },

    removeItem: (key: string): void => {
        if (typeof window === "undefined") return;
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn("localStorage removeItem failed:", error);
        }
    },
};
