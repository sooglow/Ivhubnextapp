// lib/utils/fileUtils.ts - 환경변수 기반으로 수정
import path from "path";
import { writeFile, mkdir, unlink, access } from "fs/promises";
import { constants } from "fs";
import { getPathConfig, FILE_CONFIG } from "@/public/lib/config/path";

export interface FileUploadResult {
    originalName: string;
    savedName: string;
    size: number;
    path: string;
}

export interface FileValidationResult {
    isValid: boolean;
    error?: string;
}

// MIME 타입 매핑
const MIME_TYPES: Record<string, string> = {
    ".doc": "application/vnd.ms-word",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".txt": "text/plain",
    ".hwp": "application/hwp",
    ".hwpx": "application/hwpx",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".zip": "application/zip",
    ".alz": "application/alz",
    ".pdf": "application/pdf",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
    ".mp4": "video/mp4",
    ".mp3": "audio/mpeg",
    ".avi": "video/x-msvideo",
    ".mov": "video/quicktime",
    ".csv": "text/csv",
};

// 업로드 디렉토리 경로 가져오기 (설정 기반)
function getUploadDir(): string {
    const config = getPathConfig();
    return config.dataFolderPath;
}

/**
 * 파일 검증 (설정 기반)
 */
export function validateFile(file: File): FileValidationResult {
    const extension = path.extname(file.name).toLowerCase();

    if (!FILE_CONFIG.allowedExtensions.includes(extension)) {
        return {
            isValid: false,
            error: `허용되지 않는 파일 형식입니다: ${extension}`,
        };
    }

    if (file.size > FILE_CONFIG.maxFileSize) {
        return {
            isValid: false,
            error: `파일 크기가 너무 큽니다. 최대 ${
                FILE_CONFIG.maxFileSize / 1024 / 1024
            }MB까지 허용됩니다.`,
        };
    }

    return { isValid: true };
}

/**
 * 고유한 파일명 생성
 */
export function generateUniqueFileName(originalName: string): string {
    const name = path.parse(originalName).name;
    const ext = path.parse(originalName).ext;
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6);

    return `${name}_${timestamp}_${random}${ext}`;
}

/**
 * 디렉토리 생성 (설정 기반)
 */
export async function ensureUploadDir(): Promise<void> {
    const uploadDir = getUploadDir();
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (error) {
        if ((error as any).code !== "EEXIST") {
            throw error;
        }
    }
}

/**
 * 단일 파일 저장 (설정 기반)
 */
export async function saveFile(file: File): Promise<FileUploadResult> {
    // 파일 검증
    const validation = validateFile(file);
    if (!validation.isValid) {
        throw new Error(validation.error);
    }

    // 업로드 디렉토리 확인/생성
    await ensureUploadDir();

    // 고유한 파일명 생성
    const uniqueFileName = generateUniqueFileName(file.name);
    const uploadDir = getUploadDir();
    const filePath = path.join(uploadDir, uniqueFileName);

    // 파일 저장
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    return {
        originalName: file.name,
        savedName: uniqueFileName,
        size: file.size,
        path: filePath,
    };
}

/**
 * 여러 파일 저장
 */
export async function saveFiles(files: File[]): Promise<FileUploadResult[]> {
    const results: FileUploadResult[] = [];

    for (const file of files) {
        const result = await saveFile(file);
        results.push(result);
    }

    return results;
}

/**
 * 파일 삭제 (설정 기반)
 */
export async function deleteFile(fileName: string): Promise<void> {
    const uploadDir = getUploadDir();
    const filePath = path.join(uploadDir, fileName);

    try {
        await access(filePath, constants.F_OK);
        await unlink(filePath);
    } catch (error) {
        console.warn(`파일 삭제 실패: ${fileName}`, error);
    }
}

/**
 * 파일 존재 여부 확인 (설정 기반)
 */
export async function fileExists(fileName: string): Promise<boolean> {
    const uploadDir = getUploadDir();
    const filePath = path.join(uploadDir, fileName);

    try {
        await access(filePath, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

/**
 * MIME 타입 가져오기
 */
export function getMimeType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    return MIME_TYPES[ext] || "application/octet-stream";
}

/**
 * 파일 확장자가 유효한지 확인 (설정 기반)
 */
export function isValidExtension(file: File): boolean {
    const extension = path.extname(file.name).toLowerCase();
    return FILE_CONFIG.allowedExtensions.includes(extension);
}

/**
 * 파일 다운로드 URL 생성 (설정 기반)
 */
export function getFileDownloadUrl(fileName: string): string {
    const config = getPathConfig();
    return `${config.baseUrl}/file/download/${encodeURIComponent(fileName)}`;
}
