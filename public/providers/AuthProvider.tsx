// app/providers/AuthProvider.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import LoginHeader from "@/public/components/layout/LoginHeader";
import Header from "@/public/components/layout/Header";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();

    // 로그인 페이지인지 확인
    const isLoginPage = pathname === "/login";

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("atKey");
            const loggedIn = !!token;
            setIsLoggedIn(loggedIn);

            if (!loggedIn && !isLoginPage) {
                router.push("/login");
            }
        }
    }, [pathname, router, isLoginPage]);

    return (
        <>
            {isLoggedIn && <LoginHeader />}
            {isLoggedIn && <Header />}
            {children}
        </>
    );
}
