"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useInput } from "@/public/hooks/useInput";
import { useCreateUpgrade } from "../hooks/useIvUpgradeEdit";
import { parseJWT } from "@/public/utils/utils";
import { SOLUTION_UPGRADE_INFO } from "@/public/constants/solution";

export default function IvUpgradeCreate() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<any>({});
    const [prgName, setPrgName] = useState("AUTO7");

    const titleInput = useInput("", (value: string) => value.length <= 100);
    const preViewInput = useInput("", (value: string) => value.length <= 500);
    const linkInput = useInput("", (value: string) => value.length <= 500);

    const titleRef = useRef<HTMLInputElement>(null);
    const preViewRef = useRef<HTMLTextAreaElement>(null);

    const createMutation = useCreateUpgrade();

    useEffect(() => {
        const token = localStorage.getItem("atKey");
        if (token) {
            try {
                const payload = parseJWT(JSON.parse(token).token);
                setUserInfo(payload);
            } catch (error) {
                console.error("Token parse error:", error);
            }
        }
    }, []);

    const listClick = useCallback((): void => {
        router.push("/homePage/upgradeInfo/List");
    }, [router]);

    const validateAll = useCallback((): boolean => {
        if (titleInput.value.trim().length < 5) {
            alert("제목은 5자 이상 입력해 주세요.");
            titleRef.current?.focus();
            return false;
        }

        if (preViewInput.value.trim().length < 10) {
            alert("내용은 10자 이상 입력해 주세요.");
            preViewRef.current?.focus();
            return false;
        }

        if (preViewInput.value.trim().length > 200) {
            alert("내용은 200자 이내로 입력해 주세요.");
            preViewRef.current?.focus();
            return false;
        }

        return true;
    }, [titleInput.value, preViewInput.value]);

    const createBtnClick = useCallback((): void => {
        if (!validateAll()) return;

        if (!window.confirm("저장하시겠습니까?")) return;

        createMutation.mutate(
            {
                title: titleInput.value,
                prgName,
                preView: preViewInput.value,
                link: linkInput.value,
                writer: userInfo.userId,
            },
            {
                onSuccess: () => {
                    alert("저장되었습니다.");
                    sessionStorage.removeItem("listState");
                    router.push("/homePage/upgradeInfo/List");
                },
                onError: (error: any) => {
                    alert(error.message || "저장 중 오류가 발생했습니다.");
                },
            }
        );
    }, [
        validateAll,
        titleInput.value,
        prgName,
        preViewInput.value,
        linkInput.value,
        userInfo.userId,
        createMutation,
        router,
    ]);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow p-4">
                <div className="max-w-6xl mx-auto md:px-4">
                    <h2 className="md:pt-4 md:text-2xl font-semibold text-xl">
                        IV 신규기능소개
                    </h2>

                    <div className="pt-4 md:pt-8 flex flex-row justify-between items-baseline">
                        <p>솔루션</p>
                        <div className="md:w-[952px]">
                            <select
                                value={prgName}
                                onChange={(e) => setPrgName(e.target.value)}
                                className="pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[150px] h-11"
                            >
                                {SOLUTION_UPGRADE_INFO.map((item) => (
                                    <option key={item.solutionCode} value={item.solutionCode}>
                                        {item.solutionName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row justify-between items-baseline">
                        <p>제목</p>
                        <input
                            ref={titleRef}
                            placeholder="제목"
                            className="w-full md:w-[85%] mt-2 md:mt-0 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            value={titleInput.value}
                            onChange={titleInput.onChange}
                        />
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row justify-between">
                        <p className="pt-6 hidden md:block">내용요약(200자내)</p>
                        <p className="pt-6 block md:hidden">내용</p>
                        <textarea
                            ref={preViewRef}
                            placeholder="내용"
                            className="w-full md:w-[85%] h-[80px] mt-2 md:mt-0 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            value={preViewInput.value}
                            onChange={preViewInput.onChange}
                        />
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row justify-between">
                        <p className="pt-[6px]">링크</p>
                        <input
                            placeholder="링크"
                            className="w-full md:w-[85%] mt-2 md:mt-0 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                            value={linkInput.value}
                            onChange={linkInput.onChange}
                        />
                    </div>

                    <div className="flex justify-center items-center pt-3 mx-auto">
                        <div>
                            <button
                                onClick={listClick}
                                className="w-[160px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                            >
                                목록
                            </button>
                        </div>
                        <div className="pl-2">
                            <button
                                onClick={createBtnClick}
                                disabled={createMutation.isPending}
                                className="w-[160px] bg-[#77829B] hover:bg-slate-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50"
                            >
                                {createMutation.isPending ? "저장 중..." : "저장"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
