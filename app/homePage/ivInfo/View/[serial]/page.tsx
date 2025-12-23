"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { parseJWT, truncate } from "@/public/utils/utils";
import { UserInfo } from "@/app/homePage/ivInfo/types/Create";
import SafeHtmlComponent from "@/public/components/SafeHtmlComponent";
import { useIvInfoView } from "@/app/homePage/ivInfo/hooks/useIvInfoView";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteIvBoard } from "@/app/api/ivBoard/ivBoard";

interface Props {
    params: Promise<{ serial: string }>;
}

export default function IvInfoView({ params }: Props) {
    const { serial } = use(params);
    const router = useRouter();
    const queryClient = useQueryClient();

    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

    const { data: queryData, isLoading } = useIvInfoView({
        serial,
        enabled: true,
    });

    const post = queryData?.data || null;

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

    const editClick = useCallback(() => {
        if (!post) return;

        if (userInfo.userId !== post.writer && userInfo.userPower !== "0") {
            alert("관리자 및 작성자만 수정이 가능합니다.");
            return;
        }

        router.push(`/homePage/ivInfo/Edit/${serial}`);
    }, [userInfo, post, serial, router]);

    const deleteClick = useCallback(() => {
        if (!post) return;

        if (userInfo.userId !== post.writer && userInfo.userPower !== "0") {
            alert("관리자 및 작성자만 삭제가 가능합니다.");
            return;
        }

        if (!window.confirm("삭제후에는 복원이 불가능합니다.\n삭제 하시겠습니까?")) {
            return;
        }

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

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow p-4 pt-8">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="pl-4 font-semibold text-2xl">iV공지사항</h2>

                    <div className="w-[92%] h-[58px] mx-auto mt-4 md:mt-8 flex justify-between rounded-tl-md rounded-tr-md border-[#E1E1E1] border-[1px] md:w-full md:h-[58px] md:rounded-tl-md md:rounded-tr-md md:border-[#E1E1E1] md:border-[1px]">
                        <p className="pl-2 md:pl-6 font-semibold text-[14px] text-[#A50A2E] my-auto md:text-[16px]">
                            공지: {post?.subject ?? ""}
                        </p>
                        <div className="pt-4 pr-6 hidden md:block">
                            조회수: {post?.visited ?? ""}
                        </div>
                    </div>

                    <div className="md:w-full md:h-full md:rounded-bl-md md:rounded-br-md  md:border-[1px] hidden md:block">
                        <ul className="space-y-4 pt-3">
                            <li className="pb-3 flex justify-between border-b border-[#E1E1E1]">
                                <div className="mx-6">작성자: {post?.writer ?? ""}</div>
                                <div className="mx-6">
                                    작성일: {truncate(post?.wdate ?? "", 11)}
                                </div>
                            </li>
                            <div className="mx-6 pb-8">
                                <SafeHtmlComponent html={post?.contents ?? ""} />
                            </div>
                        </ul>
                    </div>

                    {/* 모바일 */}
                    <div className="w-[92%] h-[full] mx-auto border rounded-b-md md:hidden">
                        <ul className="w-[full] space-y-2">
                            <li className="py-[15px] px-4 flex justify-between text-[14px] border-b border-[#E1E1E1]">
                                <div className="font-semibold">{post?.writer ?? ""}</div>
                                <div className="font-semibold">
                                    {truncate(post?.wdate ?? "", 11)}
                                </div>
                                <div className="font-semibold">조회수: {post?.visited ?? ""}</div>
                            </li>
                            <div className="px-4 pb-4">
                                <SafeHtmlComponent html={post?.contents ?? ""} />
                            </div>
                        </ul>
                    </div>

                    <div className="flex justify-center pt-3 space-x-4">
                        <div>
                            <button
                                onClick={editClick}
                                className={`${
                                    userInfo.userId === post?.writer || userInfo.userPower === "0"
                                        ? ""
                                        : "hidden"
                                } w-full px-4 py-2 text-white bg-[#77829B] border border-slate-400 border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none`}
                                disabled={deleteMutation.isPending}
                            >
                                수정
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={deleteClick}
                                className={`${
                                    userInfo.userId === post?.writer || userInfo.userPower === "0"
                                        ? ""
                                        : "hidden"
                                } w-full px-4 py-2 text-white bg-[#77829B] border border-slate-400 border-transparent shadow-sm rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none`}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? "삭제 중..." : "삭제"}
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={listClick}
                                className="w-full bg-[#A50A2E] hover:bg-slate-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                                disabled={deleteMutation.isPending}
                            >
                                목록
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
