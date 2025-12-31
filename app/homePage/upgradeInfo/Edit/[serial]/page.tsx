"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useInput } from "@/public/hooks/useInput";
import { useIvUpgradeView } from "../../hooks/useIvUpgradeView";
import { useUpdateUpgrade, useDeleteUpgrade } from "../../hooks/useIvUpgradeEdit";
import { parseJWT } from "@/public/utils/utils";
import { SOLUTION_UPGRADE_INFO } from "@/public/constants/solution";
import { useLoading } from "@/public/contexts/LoadingContext";

export default function IvUpgradeEdit() {
    const router = useRouter();
    const params = useParams();
    const serial = params.serial as string;
    const { dispatch } = useLoading();

    const [userInfo, setUserInfo] = useState<any>({});
    const [post, setPost] = useState<any>({});

    const titleInput = useInput("", (value: string) => value.length <= 100);
    const preViewInput = useInput("", (value: string) => value.length <= 500);
    const linkInput = useInput("", (value: string) => value.length <= 500);

    const titleRef = useRef<HTMLInputElement>(null);
    const preViewRef = useRef<HTMLTextAreaElement>(null);

    const { data: viewData, isLoading } = useIvUpgradeView({
        serial,
        enabled: !!serial,
    });

    const updateMutation = useUpdateUpgrade();
    const deleteMutation = useDeleteUpgrade();

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

    // 로딩 상태 관리
    useEffect(() => {
        dispatch({ type: "SET_LOADING", payload: isLoading });
    }, [isLoading, dispatch]);

    useEffect(() => {
        if (viewData?.data) {
            const data = viewData.data;
            setPost(data);
            titleInput.setValue(data.title || "");
            preViewInput.setValue(data.preView || "");
            linkInput.setValue(data.link || "");
        }
    }, [viewData]);

    const cancelClick = useCallback((): void => {
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

    const editBtnClick = useCallback((): void => {
        if (!validateAll()) return;

        if (!window.confirm("저장하시겠습니까?")) return;

        updateMutation.mutate(
            {
                serial,
                title: titleInput.value,
                prgName: post.prgName,
                preView: preViewInput.value,
                link: linkInput.value,
                writer: userInfo.userId,
            },
            {
                onSuccess: () => {
                    alert("수정되었습니다.");
                    router.push("/homePage/upgradeInfo/List");
                },
                onError: (error: any) => {
                    alert(error.message || "수정 중 오류가 발생했습니다.");
                },
            }
        );
    }, [
        validateAll,
        serial,
        titleInput.value,
        post.prgName,
        preViewInput.value,
        linkInput.value,
        userInfo.userId,
        updateMutation,
        router,
    ]);

    const deleteClick = useCallback((): void => {
        if (!window.confirm("삭제후에는 복원이 불가능합니다.\n삭제 하시겠습니까?")) return;

        deleteMutation.mutate(serial, {
            onSuccess: () => {
                alert("삭제되었습니다.");
                router.push("/homePage/upgradeInfo/List");
            },
            onError: (error: any) => {
                alert(error.message || "삭제 중 오류가 발생했습니다.");
            },
        });
    }, [serial, deleteMutation, router]);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow p-4">
                <div className="max-w-6xl mx-auto md:px-4">
                    <h2 className="md:pt-4 md:text-2xl font-semibold text-xl">IV 신규기능소개</h2>

                    <div className="pt-4 md:pt-8 flex md:flex-row justify-between items-baseline">
                        <p>솔루션</p>
                        <div className="md:w-[952px]">
                            <select
                                value={post.prgName || "AUTO7"}
                                onChange={(e) => {
                                    setPost((prev: any) => ({
                                        ...prev,
                                        prgName: e.target.value,
                                    }));
                                }}
                                className="pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[150px] h-11"
                                disabled={userInfo.areaCode !== "30000"}
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
                            className="w-full md:w-[85%] mt-2 md:mt-0 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                            value={titleInput.value}
                            onChange={titleInput.onChange}
                            disabled={userInfo.areaCode !== "30000"}
                        />
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row justify-between items-baseline">
                        <p className="hidden md:block">내용요약(200자내)</p>
                        <p className="block md:hidden">내용</p>
                        <textarea
                            ref={preViewRef}
                            placeholder="내용"
                            className="w-full md:w-[85%] mt-2 md:mt-0 h-[100px] md:h-[80px] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            value={preViewInput.value}
                            onChange={preViewInput.onChange}
                            disabled={userInfo.areaCode !== "30000"}
                        />
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row justify-between items-baseline">
                        <p>링크</p>
                        <input
                            placeholder="링크"
                            className="w-full md:w-[85%] mt-2 md:mt-0 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                            value={linkInput.value}
                            onChange={linkInput.onChange}
                            disabled={userInfo.areaCode !== "30000"}
                        />
                    </div>

                    <div className="flex justify-center items-center pt-3 mx-auto">
                        <div>
                            <button
                                onClick={cancelClick}
                                className="w-[110px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer"
                            >
                                목록
                            </button>
                        </div>
                        <div className="pl-2">
                            <button
                                onClick={deleteClick}
                                disabled={deleteMutation.isPending}
                                className={`w-[110px] px-4 py-2 text-white bg-[#77829B] border border-slate-400 border-transparent shadow-sm rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 cursor-pointer ${
                                    userInfo.userId === post.writer || userInfo.userPower === "0"
                                        ? ""
                                        : "hidden"
                                }`}
                            >
                                삭제
                            </button>
                        </div>
                        <div className="pl-2">
                            <button
                                onClick={editBtnClick}
                                disabled={updateMutation.isPending}
                                className="w-[110px] bg-[#77829B] text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 cursor-pointer"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
