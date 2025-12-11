// lib/config/paths.ts
import path from "path";

export interface PathConfig {
    uploadsFolderPath: string;
    dataFolderPath: string;
    baseUrl: string;
}

export const getPathConfig = (): PathConfig => {
    const isDevelopment = process.env.NODE_ENV === "development";

    const uploadsFolderPath = process.env.UPLOADS_FOLDER_PATH || "Uploads";

    return {
        uploadsFolderPath,
        dataFolderPath: isDevelopment
            ? path.join(process.cwd(), "public", uploadsFolderPath, "Data")
            : path.join(uploadsFolderPath, "Data"),
        baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    };
};

// 파일 설정 상수들
export const FILE_CONFIG = {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760"), // 10MB
    allowedExtensions: (
        process.env.ALLOWED_EXTENSIONS ||
        ".jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.hwpx,.zip,.alz,.txt,.csv,.mp4,.mp3,.avi,.mov"
    )
        .split(",")
        .map((ext) => ext.trim()),
} as const;
