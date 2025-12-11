"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/public/contexts/Context";
import { parseJWT, truncate, formatFileSize, getFileDownloadUrl } from "@/public/utils/utils";
import SafeHtmlComponent from "@/public/components/SafeHtmlComponent";
import { UserInfo } from "@/app/info/info/types/Create";
import { InfoViewItem } from "@/app/info/info/types/View";
import { getInfoView } from "@/app/api/info/info";
import { useLoading } from "@/public/contexts/LoadingContext";

interface Props {
    params: Promise<{ serial: string }>;
}

export default function InfoView({ params }: Props) {
    const router = useRouter();
    const { setCurrentInfoSerial, setCurrentInfoData } = useAppContext();
    const { state, dispatch } = useLoading();

    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [post, setPost] = useState<InfoViewItem>({} as InfoViewItem);
    const [serial, setSerial] = useState<string>("");

    // URL 파라미터에서 serial 가져오기
    useEffect(() => {
        const getSerial = async () => {
            const resolvedParams = await params;
            setSerial(resolvedParams.serial);
            setCurrentInfoSerial(parseInt(resolvedParams.serial));
        };
        getSerial();
    }, [params, setCurrentInfoSerial]);

    // 공지사항 상세 조회
    const fetchPost = useCallback(
        async (serialId: string) => {
            if (!serialId) return;

            dispatch({ type: "SET_LOADING", payload: true });
            try {
                const response = await getInfoView(serialId);

                if (!response.result) {
                    alert(response.errMsg);
                    return;
                }

                const data = response.data || ({} as InfoViewItem);
                setPost(data);
                console.log(data);
                setCurrentInfoData(data);
            } catch (error: unknown) {
                console.error("Fetch Error:", error);
                const errorMessage =
                    (error as any).response?.data?.errMsg ||
                    (error as Error).message ||
                    "데이터를 불러오는 중 오류가 발생했습니다.";
                alert(errorMessage);
            } finally {
                dispatch({ type: "SET_LOADING", payload: false });
            }
        },
        [dispatch, setCurrentInfoData]
    );

    const deleteClick = useCallback(async () => {
        if (!window.confirm("삭제후에는 복원이 불가능합니다.\n삭제 하시겠습니까?")) return;

        dispatch({ type: "SET_LOADING", payload: true });
        try {
            // 삭제 API 구현 필요
            alert("삭제 API가 구현되지 않았습니다.");
        } catch (error: any) {
            console.error("Delete Error:", error);
            const errorMessage =
                error.response?.data?.errMsg || error.message || "삭제 중 오류가 발생했습니다.";
            alert(errorMessage);
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }, [dispatch]);

    const listClick = useCallback(() => {
        router.push("/info/info/List");
    }, [router]);

    const editClick = useCallback(() => {
        if (userInfo.userId !== post.writer && userInfo.userPower !== "0") {
            alert("관리자 및 작성자만 수정이 가능합니다.");
            return;
        }
        router.push(`/info/info/Edit/${serial}`);
    }, [userInfo.userId, userInfo.userPower, post.writer, router, serial]);

    const canModify = userInfo.userId === post.writer || userInfo.userPower === "0";
    const authText = post.auth === "1" ? "본사" : "전체";

    useEffect(() => {
        if (serial) {
            fetchPost(serial);
        }
    }, [serial, fetchPost]);

    // 사용자 정보 로드
    useEffect(() => {
        if (typeof window !== "undefined") {
            const tokenItem = localStorage.getItem("atKey");
            const token = tokenItem ? JSON.parse(tokenItem)?.token : null;
            const payload = parseJWT(token);
            setUserInfo(payload as UserInfo);
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto px-4 pb-10">
                    <h2 className="md:pl-4 pl-0 font-semibold text-2xl md:py-8 py-4">공지사항</h2>

                    {/* 제목 영역 */}
                    <div className="w-full h-[58px] mx-auto items-center flex justify-between rounded-tl-md rounded-tr-md border-[#E1E1E1] md:w-full md:h-[58px] md:rounded-tl-md md:rounded-tr-md md:border-[#E1E1E1] border-0 border-x border-t px-4 md:px-6">
                        <p className="font-semibold text-[14px] text-[#A50A2E] md:text-[16px]">
                            [{authText}공지] {post.subject || ""}
                        </p>
                    </div>

                    {/* 데스크톱 내용 영역 */}
                    <div className="md:w-full md:h-full md:rounded-bl-md md:rounded-br-md md:border-[#E1E1E1] md:border-[1px] hidden md:block">
                        <ul className="space-y-4 pt-3">
                            <li className="pb-3 flex justify-between border-b border-[#E1E1E1]">
                                <div className="mx-6">{post.writer || ""}</div>
                                <div className="mx-6">{truncate(post.wdate || "", 12)}</div>
                            </li>

                            {/* 첨부파일 - 간단한 a 태그 사용 */}
                            <li className="font-semibold text-[14px]">
                                {post.filename1 && (
                                    <div className="mx-6 flex items-center">
                                        <i className="fa-regular fa-file pr-2 text-gray-500"></i>
                                        <a
                                            href={getFileDownloadUrl(post.filename1)}
                                            download
                                            className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                            {post.filename1}
                                        </a>
                                        {post.filesize1 && (
                                            <span className="ml-2 text-gray-500">
                                                ({formatFileSize(post.filesize1)})
                                            </span>
                                        )}
                                    </div>
                                )}
                                {post.filename2 && (
                                    <div className="mx-6 flex items-center mt-2">
                                        <i className="fa-regular fa-file pr-2 text-gray-500"></i>
                                        <a
                                            href={getFileDownloadUrl(post.filename2)}
                                            download
                                            className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                            {post.filename2}
                                        </a>
                                        {post.filesize2 && (
                                            <span className="ml-2 text-gray-500">
                                                ({formatFileSize(post.filesize2)})
                                            </span>
                                        )}
                                    </div>
                                )}
                            </li>

                            {/* 내용 */}
                            <div className="mx-6 pb-8">
                                <SafeHtmlComponent html={post.content} />
                            </div>
                        </ul>
                    </div>

                    {/* 모바일 내용 영역 */}
                    <div className="w-full h-[full] mx-auto border rounded-b-md md:hidden text-[14px]">
                        <ul className="w-[full] space-y-2">
                            <li className="py-[15px] px-4 flex justify-between text-[14px] border-b">
                                <div className="font-semibold">{post.writer || ""}</div>
                                <div className="font-semibold">
                                    {truncate(post.wdate || "", 12)}
                                </div>
                            </li>

                            {/* 모바일 첨부파일 - 간단한 a 태그 사용 */}
                            <li className="px-4 font-semibold">
                                {post.filename1 && (
                                    <div className="flex items-center mb-2">
                                        <i className="fa-regular fa-file pr-2 text-gray-500"></i>
                                        <div className="text-sm">
                                            <a
                                                href={getFileDownloadUrl(post.filename1)}
                                                download
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                {post.filename1}
                                            </a>
                                            {post.filesize1 && (
                                                <span className="ml-2 text-gray-500">
                                                    ({formatFileSize(post.filesize1)})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {post.filename2 && (
                                    <div className="flex items-center">
                                        <i className="fa-regular fa-file pr-2 text-gray-500"></i>
                                        <div className="text-sm">
                                            <a
                                                href={getFileDownloadUrl(post.filename2)}
                                                download
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                {post.filename2}
                                            </a>
                                            {post.filesize2 && (
                                                <span className="ml-2 text-gray-500">
                                                    ({formatFileSize(post.filesize2)})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </li>

                            {/* 모바일 내용 */}
                            <div className="px-4 pb-4">
                                <SafeHtmlComponent html={post.content} />
                            </div>
                        </ul>
                    </div>

                    {/* 버튼 */}
                    <div className="flex justify-center pt-3 space-x-2 md:space-x-4">
                        {canModify && (
                            <>
                                <div>
                                    <button
                                        onClick={editClick}
                                        disabled={state.isLoading}
                                        className="w-[105px] md:w-[105px] px-4 py-2 text-white bg-[#77829B] border border-slate-400 border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        수정
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={deleteClick}
                                        disabled={state.isLoading}
                                        className="w-[105px] md:w-[105px] px-4 py-2 text-white bg-[#77829B] border border-slate-400 border-transparent shadow-sm rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {state.isLoading ? "삭제중..." : "삭제"}
                                    </button>
                                </div>
                            </>
                        )}
                        <div>
                            <button
                                onClick={listClick}
                                disabled={state.isLoading}
                                className="w-[105px] md:w-[105px] bg-[#A50A2E] text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
