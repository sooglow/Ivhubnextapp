"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { parseJWT, truncate, formatFileSize, getFileDownloadUrl } from "@/public/utils/utils";
import { UserInfo } from "@/app/deptWorks/asCase/types/Create";
import SafeHtmlComponent from "@/public/components/SafeHtmlComponent";
import { useAsCaseView } from "@/app/deptWorks/asCase/hooks/useAsCaseView";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAsCase } from "@/app/api/asCase/asCase";
import { useLoading } from "@/public/contexts/LoadingContext";

interface Props {
    params: Promise<{ serial: string }>;
}

export default function AsCaseView({ params }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { dispatch } = useLoading();

    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [serial, setSerial] = useState<string>("");

    useEffect(() => {
        params.then((p) => setSerial(p.serial));
    }, [params]);

    const { data: queryData, isLoading } = useAsCaseView({
        serial,
        enabled: !!serial,
    });

    const post = queryData?.data || null;

    const deleteMutation = useMutation({
        mutationFn: (serial: string) => deleteAsCase(serial),
        onSuccess: (data) => {
            if (data.result) {
                alert("삭제되었습니다.");
                queryClient.invalidateQueries(["asCaseList"]);
                router.push("/deptWorks/asCase/List");
            } else {
                alert(data.errMsg || "삭제에 실패했습니다.");
            }
        },
        onError: (error: any) => {
            console.error("Delete Error:", error);
            alert("삭제 중 오류가 발생했습니다.");
        },
    });

    const handleList = useCallback(() => {
        router.push("/deptWorks/asCase/List");
    }, [router]);

    const handleEdit = useCallback(() => {
        if (userInfo.userId !== post?.writer && userInfo.userPower !== "0") {
            alert("관리자 및 작성자만 수정이 가능합니다.");
            return;
        }
        router.push(`/deptWorks/asCase/Edit/${serial}`);
    }, [router, serial, userInfo, post]);

    const handleDelete = useCallback(() => {
        if (userInfo.userId !== post?.writer && userInfo.userPower !== "0") {
            alert("관리자 및 작성자만 삭제가 가능합니다.");
            return;
        }
        if (window.confirm("삭제 후에는 복원이 불가능합니다.\n삭제하시겠습니까?")) {
            deleteMutation.mutate(serial);
        }
    }, [deleteMutation, serial, userInfo, post]);

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

    // 로딩 상태 관리
    useEffect(() => {
        dispatch({ type: "SET_LOADING", payload: isLoading });

        // 클린업: 컴포넌트 언마운트 시 loading false로 리셋
        return () => {
            dispatch({ type: "SET_LOADING", payload: false });
        };
    }, [isLoading, dispatch]);

    const canEdit =
        userInfo?.userId && (userInfo?.userId === post?.writer || userInfo?.userPower === "0");

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow pt-4 md:pt-8">
                <div className="max-w-6xl mx-auto px-0 md:px-4 pb-20">
                    <h2 className="pl-4 font-semibold text-2xl">상담사례</h2>
                    <div className="w-[92%] h-[58px] mx-auto mt-4 md:mt-8 flex justify-between rounded-tl-md rounded-tr-md border-[#E1E1E1] md:w-full md:h-[58px] md:rounded-tl-md md:rounded-tr-md md:border-[#E1E1E1] border-0 border-x border-t px-4 md:px-0">
                        <p className="md:pl-6 font-semibold text-[14px] text-[#A50A2E] my-auto md:text-[16px]">
                            {post?.subject}
                        </p>
                        <div className="pt-4 pr-6 hidden md:block">조회수: {post?.visited}</div>
                    </div>

                    {/* 데스크톱 */}
                    <div className="md:w-full md:h-full md:rounded-bl-md md:rounded-br-md md:border-[#E1E1E1] md:border-[1px] hidden md:block">
                        <ul className="space-y-4 pt-3">
                            <li className="pb-3 flex justify-between border-b border-[#E1E1E1]">
                                <div className="mx-6">{post?.writer}</div>
                                <div className="mx-6">{truncate(post?.wdate, 11)}</div>
                            </li>
                            <li className="font-semibold text-[14px]">
                                {post?.fileName1 && (
                                    <div className="mx-6 flex items-center">
                                        <i className="fa-regular fa-file pr-2 text-gray-500"></i>
                                        <a
                                            href={getFileDownloadUrl(post?.fileName1)}
                                            download
                                            className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                            {post?.fileName1}
                                        </a>
                                        {post?.fileSize1 && (
                                            <span className="ml-2 text-gray-500">
                                                ({formatFileSize(post?.fileSize1)})
                                            </span>
                                        )}
                                    </div>
                                )}
                            </li>
                            <div className="mx-6 pb-8">
                                <p className="font-semibold">문의내용</p>
                                <div className="pl-4">
                                    <SafeHtmlComponent html={post?.question} />
                                </div>
                            </div>
                            <div className="mx-6 pb-8">
                                <p className="font-semibold">처리내용</p>
                                <div className="pl-4">
                                    <SafeHtmlComponent html={post?.answer} />
                                </div>
                            </div>
                        </ul>
                    </div>

                    {/* 모바일 */}
                    <div className="w-[92%] h-[full] mx-auto border rounded-b-md md:hidden">
                        <ul className="w-[full] space-y-2">
                            <li className="py-[15px] px-4 flex justify-between text-[14px] border-b border-[#E1E1E1]">
                                <div className="font-semibold">{post?.writer}</div>
                                <div className="font-semibold">{truncate(post?.wdate, 11)}</div>
                            </li>
                            <li className="px-4 font-semibold">
                                {post?.fileName1 && (
                                    <div className="flex items-center mb-2">
                                        <i className="fa-regular fa-file pr-2 text-gray-500"></i>
                                        <div className="text-sm">
                                            <a
                                                href={getFileDownloadUrl(post?.fileName1)}
                                                download
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                {post?.fileName1}
                                            </a>
                                            {post?.fileSize1 && (
                                                <span className="ml-2 text-gray-500">
                                                    ({formatFileSize(post?.fileSize1)})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </li>
                            <div className="px-4 pb-4 text-[14px]">
                                <p className="font-semibold">문의내용</p>
                                <SafeHtmlComponent html={post?.question} />
                            </div>
                            <div className="pb-8 text-[14px] pt-2">
                                <p className="font-semibold pl-4">처리내용</p>
                                <div className="pl-4">
                                    <SafeHtmlComponent html={post?.answer} />
                                </div>
                            </div>
                        </ul>
                    </div>

                    <div className="flex justify-center pt-3 space-x-4">
                        <div>
                            <button
                                onClick={handleList}
                                className="w-[105px] bg-[#A50A2E] text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer"
                            >
                                목록
                            </button>
                        </div>
                        {canEdit && (
                            <>
                                <div>
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleteMutation.isPending}
                                        className="w-[105px] px-4 py-2 text-white bg-[#77829B] border border-slate-400 border-transparent shadow-sm rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 cursor-pointer"
                                    >
                                        {deleteMutation.isPending ? "삭제중..." : "삭제"}
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={handleEdit}
                                        className="w-[105px] px-4 py-2 text-white bg-[#77829B] border border-slate-400 border-transparent shadow-sm rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer"
                                    >
                                        수정
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
