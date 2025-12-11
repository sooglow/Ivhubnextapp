//app/login/api/api.ts
import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// 로그인 API
export function login(userId: string, password: string) {
    return instance.post("/api/auth/login", {
        userId,
        password,
    });
}

// SMS 인증 API
export function verifySms(userId: string, smsCode: string) {
    return instance.get(`/api/auth/verify-sms?UserId=${userId}&SmsCode=${smsCode}`);
}

// 토큰 갱신 API
export function refreshToken(refreshToken: string) {
    return instance.post("/api/auth/refresh", { refreshToken });
}
