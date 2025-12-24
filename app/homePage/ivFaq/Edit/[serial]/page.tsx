"use client";
import React, { useEffect, useState, useCallback, useRef, use } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useInput } from "@/public/hooks/useInput";
import { useAlert } from "@/public/hooks/useAlert";
import { parseJWT } from "@/public/utils/utils";
import { UserInfo } from "@/app/homePage/ivFaq/types/Edit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFaqBoard, deleteFaqBoard } from "@/app/api/faqBoard/faqBoard";
import { useIvFaqEdit } from "@/app/homePage/ivFaq/hooks/useIvFaqEdit";
import { useLoading } from "@/public/contexts/LoadingContext";
import { SOLUTION } from "@/public/constants/solution";

const TextEditor = dynamic(() => import("@/public/components/TextEditor"), {
    ssr: false,
    loading: () => (
        <div className="h-96 border border-gray-300 rounded-md animate-pulse bg-gray-100" />
    ),
});

export default function IvFaqEdit({ params }: { params: Promise<{ serial: string }> }) {
    const { serial } = use(params);
    const router = useRouter();
    const queryClient = useQueryClient();
    const { dispatch } = useLoading();
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [post, setPost] = useState<any>({});
    const [contents, setContents] = useState<string>("");
    const [isEditorReady, setIsEditorReady] = useState(false);
    const titleInput = useInput("", (value: string) => value.length <= 50);
    const titleRef = useRef<HTMLInputElement>(null);

    const { data: queryData, isLoading, error } = useIvFaqEdit({ serial, enabled: true });

    useEffect(() => {
        if (queryData?.data && !isEditorReady) {
            titleInput.setValue(queryData.data.title);
            setContents(queryData.data.contents);
            setPost(queryData.data);
            setIsEditorReady(true);
        }
    }, [queryData, isEditorReady]);

    useEffect(() => {
        if (error) {
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
            router.push("/homePage/ivFaq/List");
        }
    }, [error, router]);

    useEffect(() => {
        dispatch({ type: "SET_LOADING", payload: isLoading });
    }, [isLoading, dispatch]);

    const validateAll = useAlert([
        {
            test: () => titleInput.value.length > 5,
            message: "제목은 5자 이상 입력해 주세요.",
            ref: titleRef,
        },
        { test: () => contents.length > 10, message: "내용은 10자 이상 입력해 주세요." },
    ]);

    const updateMutation = useMutation({
        mutationFn: (data: { serial: string; kind: string; title: string; contents: string }) =>
            updateFaqBoard(data),
        onSuccess: async (data) => {
            if (data.result) {
                alert("수정되었습니다.");
                await queryClient.invalidateQueries({
                    queryKey: ["ivFaqEdit", serial],
                    refetchType: "all",
                });
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
                alert(data.errMsg || "수정에 실패했습니다.");
            }
        },
        onError: (error: any) => {
            alert("수정 중 오류가 발생했습니다: " + error.message);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (serial: string) => deleteFaqBoard(serial),
        onSuccess: async (data) => {
            if (data.result) {
                alert("삭제되었습니다.");
                await queryClient.invalidateQueries({
                    queryKey: ["ivFaqEdit", serial],
                    refetchType: "all",
                });
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
                alert(data.errMsg || "삭제에 실패했습니다.");
            }
        },
        onError: (error: any) => {
            alert("삭제 중 오류가 발생했습니다: " + error.message);
        },
    });

    const cancelClick = useCallback(() => {
        router.push("/homePage/ivFaq/List");
    }, [router]);

    const editBtnClick = useCallback(() => {
        if (!validateAll()) return;
        if (!window.confirm("저장하시겠습니까?")) return;
        updateMutation.mutate({
            serial: serial,
            kind: post.kind,
            title: titleInput.value,
            contents: contents,
        });
    }, [validateAll, serial, post.kind, titleInput.value, contents, updateMutation]);

    const deleteClick = useCallback(() => {
        if (userInfo.userId !== post.writer && userInfo.userPower !== "0") {
            alert("관리자 및 작성자만 삭제가 가능합니다.");
            return;
        }
        if (!window.confirm("삭제후에는 복원이 불가능합니다.\n삭제 하시겠습니까?")) return;
        deleteMutation.mutate(serial);
    }, [userInfo, post, serial, deleteMutation]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const tokenItem = localStorage.getItem("atKey");
            console.log("FAQ Edit - tokenItem:", tokenItem);
            const token = tokenItem ? JSON.parse(tokenItem)?.token : null;
            console.log("FAQ Edit - token:", token);
            const payload = parseJWT(token);
            console.log("FAQ Edit - payload:", payload);
            console.log("FAQ Edit - userPower:", payload?.userPower);
            console.log("FAQ Edit - userPower type:", typeof payload?.userPower);
            console.log("FAQ Edit - userPower === '0':", payload?.userPower === "0");
            if (payload) {
                setUserInfo(payload);
            }
        }
    }, []);

    useEffect(() => {
        console.log("FAQ Edit - userInfo state changed:", userInfo);
        console.log("FAQ Edit - userInfo.userPower:", userInfo.userPower);
        console.log("FAQ Edit - should show delete button:", userInfo.userPower === "0");
    }, [userInfo]);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow pt-4 md:pt-8">
                <div className="max-w-6xl mx-auto pb-20">
                    <div className="px-4">
                        <h2 className="font-semibold text-2xl">IV 자주하는 질문</h2>
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
                                value={post.kind}
                                onChange={(e) => {
                                    setPost((prev: any) => ({
                                        ...prev,
                                        kind: e.target.value,
                                    }));
                                }}
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
                                value={post.kind}
                                onChange={(e) => {
                                    setPost((prev: any) => ({
                                        ...prev,
                                        kind: e.target.value,
                                    }));
                                }}
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
                            {isEditorReady && <TextEditor setData={setContents} data={contents} />}
                        </div>
                        <div className="flex justify-center items-center pt-3 mx-auto">
                            <div>
                                <button
                                    onClick={cancelClick}
                                    disabled={updateMutation.isPending || deleteMutation.isPending}
                                    className="w-[110px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50"
                                >
                                    취소
                                </button>
                            </div>
                            <div className="pl-2">
                                <button
                                    onClick={deleteClick}
                                    disabled={updateMutation.isPending || deleteMutation.isPending}
                                    className={`${
                                        userInfo.userId === post.writer || userInfo.userPower === "0"
                                            ? ""
                                            : "hidden"
                                    } w-[110px] px-4 py-2 text-white bg-[#77829B] border border-slate-400 border-transparent shadow-sm rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50`}
                                >
                                    삭제
                                </button>
                            </div>
                            <div className="pl-2">
                                <button
                                    onClick={editBtnClick}
                                    disabled={updateMutation.isPending || deleteMutation.isPending}
                                    className="w-[110px] bg-[#77829B] text-white px-4 py-2 border border-transparent rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50"
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
