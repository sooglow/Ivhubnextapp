// app/login/types/types.ts
export interface ApiResponse {
    result: boolean;
    errMsg: string;
    data?: {
        token?: string;
        refreshToken?: string;
        requiresSmsVerification?: boolean;
    };
}
