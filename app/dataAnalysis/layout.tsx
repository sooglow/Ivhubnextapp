'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from "clsx"
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';

export default function DataAnalysisLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window === 'undefined') return false;
        const savedTheme = localStorage.getItem('theme');
        const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return savedTheme ? savedTheme === 'dark' : userPrefersDark;
    });

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <section className={clsx({ "bg-black": isDarkMode }, { "dark": isDarkMode })}>
            <div className="w-full min-h-screen flex flex-col items-center justify-items-center p-5">
                <div className={clsx("w-full flex items-center justify-end space-x-2 pt-2", { "text-white": isDarkMode }, { "text-black": !isDarkMode })}>
                    <Switch id="theme-mode" onClick={toggleTheme} />
                    <Label htmlFor="theme-mode">{isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}</Label>
                </div>

                <h1 className={clsx("pt-[30px] text-4xl", { "text-white": isDarkMode }, { "text-black": !isDarkMode })}>
                    차대번호 데이터 분석
                </h1>

                <h4 className={clsx("pt-5", { "text-white": isDarkMode }, { "text-black": !isDarkMode })}>아래 Tab메뉴를 선택하여 작업해 주세요.</h4>

                <nav className="w-full pt-[30px] pb-[20px]">
                    <ul className="flex flex-row items-center justify-center space-x-10">
                        <li>
                            <Link
                                href="/dataAnalysis/Code"
                                className={clsx(
                                    "flex h-10 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary font-medium",
                                    {
                                        "bg-muted text-primary": pathname === "/dataAnalysis/Code",
                                        "text-muted-foreground": pathname !== "/dataAnalysis/Code"
                                    }
                                )}
                            >
                                기초코드
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/dataAnalysis/Create"
                                className={clsx(
                                    "flex h-10 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary font-medium",
                                    {
                                        "bg-muted text-primary": pathname === "/dataAnalysis/Create",
                                        "text-muted-foreground": pathname !== "/dataAnalysis/Create"
                                    }
                                )}
                            >
                                입력
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/dataAnalysis/View"
                                className={clsx(
                                    "flex h-10 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary font-medium",
                                    {
                                        "bg-muted text-primary": pathname === "/dataAnalysis/View",
                                        "text-muted-foreground": pathname !== "/dataAnalysis/View"
                                    }
                                )}
                            >
                                조회
                            </Link>
                        </li>
                    </ul>
                </nav>

                {children}

                <Toaster />
            </div>
        </section>
    );
}
