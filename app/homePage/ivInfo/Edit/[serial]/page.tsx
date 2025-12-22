"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useInput } from "@/public/hooks/useInput";
import { useAlert } from "@/public/hooks/useAlert";
import { parseJWT } from "@/public/utils/utils";
import { UserInfo } from "@/app/homePage/ivInfo/types/Edit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIvBoard, deleteIvBoard } from "@/app/api/ivBoard/ivBoard";
import { useIvInfoEdit } from "@/app/homePage/ivInfo/hooks/useIvInfoEdit";

const TextEditor = dynamic(() => import("@/public/components/TextEditor"), {
    ssr: false,
    loading: () => <div className="h-96 border border-gray-300 rounded-md animate-pulse bg-gray-100" />,
});
export default function IvInfoEdit({ params }: { params: { serial: string } }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { serial } = params;
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [contents, setContents] = useState<string>("");
    const [isEditorReady, setIsEditorReady] = useState(false);
    const subjectInput = useInput("", (value: string) => value.length <= 50);
    const subjectRef = useRef<HTMLInputElement>(null);
    const { data: queryData, isLoading, error } = useIvInfoEdit({ serial, enabled: true });
    useEffect(() => {
        if (queryData?.data && !isEditorReady) {
            subjectInput.setValue(queryData.data.subject);
            setContents(queryData.data.contents);
            setIsEditorReady(true);
        }
    }, [queryData, isEditorReady]);
    useEffect(() => {
        if (error) {
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
            router.push("/homePage/ivInfo/List");
        }
    }, [error, router]);
    const validateAll = useAlert([
        {
            test: () => subjectInput.value.length >= 5,
            message: "제목은 5자 이상 입력해 주세요.",
            ref: subjectRef,
        },
        { test: () => contents.length >= 10, message: "내용은 10자 이상 입력해 주세요." },
    ]);
    const updateMutation = useMutation({
        mutationFn: (data: {
            serial: string;
            subject: string;
            writer: string;
            ip: string;
            contents: string;
        }) => updateIvBoard(data),
        onSuccess: (data) => {
            if (data.result) {
                alert("수정되었습니다.");
                queryClient.invalidateQueries({ queryKey: ["ivInfoList"] });
                sessionStorage.removeItem("listState");
                router.push("/homePage/ivInfo/List");
                router.refresh();
            } else {
                alert(data.errMsg || "수정에 실패했습니다.");
            }
        },
        onError: (error: any) => {
            alert("수정 중 오류가 발생했습니다: " + error.message);
        },
    });
    const deleteMutation = useMutation({
        mutationFn: (serial: string) => deleteIvBoard(serial),
        onSuccess: (data) => {
            if (data.result) {
                alert("삭제되었습니다.");
                queryClient.invalidateQueries({ queryKey: ["ivInfoList"] });
                sessionStorage.removeItem("listState");
                router.push("/homePage/ivInfo/List");
                router.refresh();
            } else {
                alert(data.errMsg || "삭제에 실패했습니다.");
            }
        },
        onError: (error: any) => {
            alert("삭제 중 오류가 발생했습니다: " + error.message);
        },
    });
    const listClick = useCallback(() => {
        router.push("/homePage/ivInfo/List");
    }, [router]);
    const editBtnClick = useCallback(() => {
        if (!validateAll()) return;
        if (!window.confirm("수정하시겠습니까?")) return;
        updateMutation.mutate({
            serial: serial,
            subject: subjectInput.value,
            writer: userInfo.userId,
            ip: "0.0.0.0",
            contents: contents,
        });
    }, [validateAll, serial, subjectInput.value, userInfo.userId, contents, updateMutation]);
    const deleteBtnClick = useCallback(() => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        deleteMutation.mutate(serial);
    }, [serial, deleteMutation]);
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
    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
    }
    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow pt-4 md:pt-8">
                <div className="max-w-6xl mx-auto pb-20">
                    <h2 className="pl-4 font-semibold text-2xl">공지사항 수정</h2>
                    <div className="px-4">
                        <div className="pt-4 md:pt-8 pl-2 flex flex-row justify-between">
                            <p className="pt-[10px] md:pt-[6px]">제목</p>
                            <input
                                ref={subjectRef}
                                placeholder="제목"
                                className="w-[85%] md:w-[96%] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                value={subjectInput.value}
                                onChange={subjectInput.onChange}
                                maxLength={50}
                            />
                        </div>
                        <div className="pt-4">
                            {isEditorReady && (
                                <TextEditor setData={setContents} initialData={contents} />
                            )}
                        </div>
                        <div className="flex justify-center items-center pt-3 mx-auto">
                            <div>
                                <button
                                    onClick={listClick}
                                    disabled={updateMutation.isPending || deleteMutation.isPending}
                                    className="w-[155px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50"
                                >
                                    목록
                                </button>
                            </div>
                            <div className="pl-2">
                                <button
                                    onClick={editBtnClick}
                                    disabled={updateMutation.isPending || deleteMutation.isPending}
                                    className="w-[155px] bg-[#77829B] text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50"
                                >
                                    {updateMutation.isPending ? "수정 중..." : "수정"}
                                </button>
                            </div>
                            <div className="pl-2">
                                <button
                                    onClick={deleteBtnClick}
                                    disabled={updateMutation.isPending || deleteMutation.isPending}
                                    className="w-[155px] bg-red-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50"
                                >
                                    {deleteMutation.isPending ? "삭제 중..." : "삭제"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
