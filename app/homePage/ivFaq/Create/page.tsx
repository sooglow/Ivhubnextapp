"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useInput } from "@/public/hooks/useInput";
import { useAlert } from "@/public/hooks/useAlert";
import { parseJWT } from "@/public/utils/utils";
import { UserInfo } from "@/app/homePage/ivFaq/types/Create";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFaqBoard } from "@/app/api/faqBoard/faqBoard";
import { SOLUTION } from "@/public/constants/solution";

const TextEditor = dynamic(() => import("@/public/components/TextEditor"), {
    ssr: false,
    loading: () => (
        <div className="h-96 border border-gray-300 rounded-md animate-pulse bg-gray-100" />
    ),
});

export default function IvFaqCreate() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [contents, setContents] = useState<string>("");
    const [kind, setKind] = useState<string>("AUTO7");
    const titleInput = useInput("", (value: string) => value.length <= 50);
    const titleRef = useRef<HTMLInputElement>(null);

    const validateAll = useAlert([
        {
            test: () => titleInput.value.length >= 5,
            message: "제목은 5자 이상 입력해 주세요.",
            ref: titleRef,
        },
        { test: () => contents.length >= 10, message: "내용은 10자 이상 입력해 주세요." },
    ]);

    const createMutation = useMutation({
        mutationFn: (data: { kind: string; title: string; contents: string }) =>
            createFaqBoard(data),
        onSuccess: async (data) => {
            if (data.result) {
                alert("저장되었습니다.");
                await queryClient.invalidateQueries({
                    queryKey: ["ivFaqList"],
                    refetchType: "all",
                });
                await queryClient.refetchQueries({
                    queryKey: ["ivFaqList"],
                    type: "all",
                });
                sessionStorage.removeItem("listState");
                router.push("/homePage/ivFaq/List");
            } else {
                alert(data.errMsg || "저장에 실패했습니다.");
            }
        },
        onError: (error: any) => {
            alert("저장 중 오류가 발생했습니다: " + error.message);
        },
    });

    const listClick = useCallback(() => {
        router.push("/homePage/ivFaq/List");
    }, [router]);

    const createBtnClick = useCallback(() => {
        if (!validateAll()) return;
        if (!window.confirm("저장하시겠습니까?")) return;
        createMutation.mutate({
            kind: kind,
            title: titleInput.value,
            contents: contents,
        });
    }, [validateAll, kind, titleInput.value, contents, createMutation]);

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
                <div className="max-w-6xl mx-auto pb-20">
                    <h2 className="pl-4 font-semibold text-2xl">IV 자주하는 질문</h2>
                    <div className="px-4">
                        <div className="pt-4 flex justify-between items-baseline">
                            <p className="pt-[10px] md:pt-4">제목</p>
                            <input
                                ref={titleRef}
                                placeholder="제목"
                                className="md:w-[70%] w-[80%] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                value={titleInput.value}
                                onChange={titleInput.onChange}
                                maxLength={50}
                            />
                            <p className="hidden md:block pl-14 pt-[10px] md:pt-[10px]">구분</p>
                            <select
                                value={kind}
                                onChange={(e) => setKind(e.target.value)}
                                className="hidden md:block md:pl-3 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[150px] md:h-12"
                            >
                                {SOLUTION.map((item) => (
                                    <option key={item.solutionCode} value={item.solutionCode}>
                                        {item.solutionName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="pt-4 flex flex-row justify-between md:hidden items-baseline">
                            <p>구분</p>
                            <select
                                value={kind}
                                onChange={(e) => setKind(e.target.value)}
                                className="pl-3 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[40%] h-12"
                            >
                                {SOLUTION.map((item) => (
                                    <option key={item.solutionCode} value={item.solutionCode}>
                                        {item.solutionName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="pt-4">
                            <TextEditor setData={setContents} data={contents} />
                        </div>
                        <div className="flex justify-center items-center pt-3 mx-auto">
                            <div>
                                <button
                                    onClick={listClick}
                                    disabled={createMutation.isPending}
                                    className="w-[155px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 cursor-pointer"
                                >
                                    목록
                                </button>
                            </div>
                            <div className="pl-2">
                                <button
                                    onClick={createBtnClick}
                                    disabled={createMutation.isPending}
                                    className="w-[155px] bg-[#77829B] text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 cursor-pointer"
                                >
                                    저장
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
