"use client";

import React, { useEffect, useState, useCallback, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useInput } from "@/public/hooks/useInput";
import { useAlert } from "@/public/hooks/useAlert";
import { parseJWT } from "@/public/utils/utils";
import { UserInfo } from "@/app/homePage/ivIssue/types/Edit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIssueBoard, deleteIssueBoard } from "@/app/api/issueBoard/issueBoard";
import { useIvIssueEdit } from "@/app/homePage/ivIssue/hooks/useIvIssueEdit";
import { useLoading } from "@/public/contexts/LoadingContext";

export default function IvIssueEdit({ params }: { params: Promise<{ serial: string }> }) {
    const { serial } = use(params);
    const router = useRouter();
    const queryClient = useQueryClient();
    const { dispatch } = useLoading();

    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [post, setPost] = useState<any>({});

    const titleInput = useInput("", (value: string) => value.length <= 50);
    const linkInput = useInput("", (value: string) => value.length <= 100);

    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);

    const { data: queryData, isLoading, error } = useIvIssueEdit({ serial, enabled: true });

    useEffect(() => {
        if (queryData?.data) {
            titleInput.setValue(queryData.data.title);
            linkInput.setValue(queryData.data.link);
            setPost(queryData.data);
        }
    }, [queryData]);

    useEffect(() => {
        if (error) {
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
            router.push("/homePage/ivIssue/List");
        }
    }, [error, router]);

    // 로딩 상태 관리
    useEffect(() => {
        dispatch({ type: "SET_LOADING", payload: isLoading });
    }, [isLoading, dispatch]);

    const validateAll = useAlert([
        {
            test: () => titleInput.value.length > 5,
            message: "제목은 5자 이상 입력해 주세요.",
            ref: titleRef,
        },
        {
            test: () => linkInput.value.length > 10,
            message: "링크는 10자 이상 입력해 주세요.",
            ref: linkRef,
        },
    ]);

    const updateMutation = useMutation({
        mutationFn: (data: { serial: string; title: string; writer: string; link: string }) =>
            updateIssueBoard(data),
        onSuccess: async (data) => {
            if (data.result) {
                alert("수정되었습니다.");
                // Edit 페이지 캐시 무효화
                await queryClient.invalidateQueries({
                    queryKey: ["ivIssueEdit", serial],
                    refetchType: "all",
                });
                // List 페이지 캐시 무효화
                await queryClient.invalidateQueries({
                    queryKey: ["ivIssueList"],
                    refetchType: "all",
                });
                await queryClient.refetchQueries({
                    queryKey: ["ivIssueList"],
                    type: "all",
                });
                sessionStorage.removeItem("listState");
                router.push("/homePage/ivIssue/List");
            } else {
                alert(data.errMsg || "수정에 실패했습니다.");
            }
        },
        onError: (error: any) => {
            alert("수정 중 오류가 발생했습니다: " + error.message);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (serial: string) => deleteIssueBoard(serial),
        onSuccess: async (data) => {
            if (data.result) {
                alert("삭제되었습니다.");
                // Edit 페이지 캐시 무효화
                await queryClient.invalidateQueries({
                    queryKey: ["ivIssueEdit", serial],
                    refetchType: "all",
                });
                // List 페이지 캐시 무효화
                await queryClient.invalidateQueries({
                    queryKey: ["ivIssueList"],
                    refetchType: "all",
                });
                await queryClient.refetchQueries({
                    queryKey: ["ivIssueList"],
                    type: "all",
                });
                sessionStorage.removeItem("listState");
                router.push("/homePage/ivIssue/List");
            } else {
                alert(data.errMsg || "삭제에 실패했습니다.");
            }
        },
        onError: (error: any) => {
            alert("삭제 중 오류가 발생했습니다: " + error.message);
        },
    });

    const cancelClick = useCallback(() => {
        router.push("/homePage/ivIssue/List");
    }, [router]);

    const editBtnClick = useCallback(() => {
        if (!validateAll()) return;
        if (!window.confirm("저장하시겠습니까?")) return;

        updateMutation.mutate({
            serial: serial,
            title: titleInput.value,
            writer: post.writer,
            link: linkInput.value,
        });
    }, [validateAll, serial, titleInput.value, post.writer, linkInput.value, updateMutation]);

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
            const token = tokenItem ? JSON.parse(tokenItem)?.token : null;
            const payload = parseJWT(token);
            if (payload) {
                setUserInfo(payload);
            }
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto">
                    <h2 className="pl-4 font-semibold text-2xl py-4 md:py-8">IV 업계이슈</h2>
                    <div className="px-4">
                        <div className="md:pt-8 flex md:flex-row justify-between flex-col">
                            <p>제목</p>
                            <input
                                ref={titleRef}
                                placeholder="제목"
                                className="md:w-[95%] mt-2 md:mt-0 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                value={titleInput.value}
                                onChange={titleInput.onChange}
                                maxLength={50}
                            />
                        </div>
                        <div className="pt-4 md:pt-8 flex md:flex-row justify-between flex-col">
                            <p>링크</p>
                            <input
                                ref={linkRef}
                                placeholder="링크"
                                className="md:w-[95%] mt-2 md:mt-0 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                value={linkInput.value}
                                onChange={linkInput.onChange}
                                maxLength={100}
                            />
                        </div>

                        <div className="flex justify-center items-center pt-3 mx-auto">
                            <div>
                                <button
                                    onClick={cancelClick}
                                    disabled={updateMutation.isPending || deleteMutation.isPending}
                                    className="w-[110px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 cursor-pointer"
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
                                    } w-[110px] px-4 py-2 text-white bg-[#77829B] border border-slate-400 border-transparent shadow-sm rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 cursor-pointer`}
                                >
                                    삭제
                                </button>
                            </div>

                            <div className="pl-2">
                                <button
                                    onClick={editBtnClick}
                                    disabled={updateMutation.isPending || deleteMutation.isPending}
                                    className="w-[110px] bg-[#77829B] hover:bg-slate-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 cursor-pointer"
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
