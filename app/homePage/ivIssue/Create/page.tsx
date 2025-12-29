"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useInput } from "@/public/hooks/useInput";
import { useAlert } from "@/public/hooks/useAlert";
import { parseJWT } from "@/public/utils/utils";
import { UserInfo } from "@/app/homePage/ivIssue/types/Create";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIssueBoard } from "@/app/api/issueBoard/issueBoard";

export default function IvIssueCreate() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const titleInput = useInput("", (value: string) => value.length <= 50);
    const linkInput = useInput("", (value: string) => value.length <= 100);

    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);

    const validateAll = useAlert([
        {
            test: () => titleInput.value.length >= 5,
            message: "제목은 5자 이상 입력해 주세요.",
            ref: titleRef,
        },
        {
            test: () => linkInput.value.length >= 10,
            message: "링크는 10자 이상 입력해 주세요.",
            ref: linkRef,
        },
    ]);

    const createMutation = useMutation({
        mutationFn: (data: { title: string; writer: string; link: string }) =>
            createIssueBoard(data),
        onSuccess: (data) => {
            if (data.result) {
                alert("저장되었습니다.");
                queryClient.invalidateQueries({ queryKey: ["ivIssueList"] });
                sessionStorage.removeItem("listState");
                router.push("/homePage/ivIssue/List");
                router.refresh();
            } else {
                alert(data.errMsg || "저장에 실패했습니다.");
            }
        },
        onError: (error: any) => {
            alert("저장 중 오류가 발생했습니다: " + error.message);
        },
    });

    const listClick = useCallback(() => {
        router.push("/homePage/ivIssue/List");
    }, [router]);

    const createBtnClick = useCallback(() => {
        if (!validateAll()) return;

        if (!window.confirm("저장하시겠습니까?")) return;

        createMutation.mutate({
            title: titleInput.value,
            writer: userInfo.userId,
            link: linkInput.value,
        });
    }, [validateAll, titleInput.value, userInfo.userId, linkInput.value, createMutation]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const tokenItem = localStorage.getItem("atKey");
            const token = tokenItem ? JSON.parse(tokenItem)?.token : null;
            const payload = parseJWT(token);
            if (payload) {
                setUserInfo(payload);
            }
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow pt-4 md:pt-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="pl-4 font-semibold text-2xl">IV 업계이슈</h2>
                    <div className="px-4">
                        <div className="pt-4 md:pt-8 flex md:flex-row justify-between flex-col">
                            <p className="md:pt-[6px]">제목</p>
                            <input
                                ref={titleRef}
                                placeholder="제목"
                                className="md:w-[95%] mt-2 md:mt-0 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                value={titleInput.value}
                                onChange={titleInput.onChange}
                                maxLength={50}
                            />
                        </div>
                        <div className="pt-4 md:pt-8 flex md:flex-row justify-between flex-col">
                            <p className="pt-[6px]">링크</p>
                            <input
                                ref={linkRef}
                                placeholder="링크"
                                className="md:w-[95%] mt-2 md:mt-0 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                value={linkInput.value}
                                onChange={linkInput.onChange}
                                maxLength={100}
                            />
                        </div>
                        <div className="flex justify-center items-center pt-4 md:pt-3 mx-auto">
                            <div>
                                <button
                                    onClick={listClick}
                                    disabled={createMutation.isPending}
                                    className="w-[165px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50"
                                >
                                    목록
                                </button>
                            </div>
                            <div className="pl-2">
                                <button
                                    onClick={createBtnClick}
                                    disabled={createMutation.isPending}
                                    className="w-[165px] bg-[#77829B] text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50"
                                >
                                    {createMutation.isPending ? "저장 중..." : "저장"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
