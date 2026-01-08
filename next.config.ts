import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    eslint: {
        // 빌드 시 ESLint 에러 무시
        ignoreDuringBuilds: true,
    },
    typescript: {
        // 빌드 시 TypeScript 에러 무시 (프로덕션 빌드 허용)
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
