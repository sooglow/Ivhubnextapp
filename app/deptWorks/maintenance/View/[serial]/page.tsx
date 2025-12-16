"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMaintenanceView, useMaintenanceDelete } from "../../hooks/useMaintenance";
import SafeHtmlComponent from "@/public/components/SafeHtmlComponent";

interface MaintenanceViewProps {
    params: Promise<{ serial: string }>;
}

export default function MaintenanceView({ params }: MaintenanceViewProps) {
    const router = useRouter();
    const [serial, setSerial] = useState<string>("");
    const [post, setPost] = useState<any>({});

    const { data, isLoading } = useMaintenanceView(serial);
    const { mutate: deleteMaintenance, isPending: isDeleting } = useMaintenanceDelete(serial);

    const listClick = () => {
        router.push("/deptWorks/maintenance/List");
    };

    const editClick = () => {
        router.push(`/deptWorks/maintenance/Edit/${serial}`);
    };

    const deleteClick = () => {
        if (!window.confirm("삭제후에는 복원이 불가능합니다.\n삭제 하시겠습니까?")) {
            return;
        }

        deleteMaintenance(undefined, {
            onSuccess: () => {
                alert("삭제되었습니다.");
                router.push("/deptWorks/maintenance/List");
            },
            onError: (error: any) => {
                alert(error.response?.data?.errMsg || "삭제에 실패했습니다.");
            },
        });
    };

    const truncate = (str: string, maxLength: number) => {
        return str.length > maxLength ? str.substring(0, maxLength) : str;
    };

    // params 처리
    useEffect(() => {
        params.then((p) => {
            setSerial(p.serial);
        });
    }, [params]);

    // 상세 데이터 로드
    useEffect(() => {
        if (data?.data) {
            setPost(data.data);
        }
    }, [data]);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow md:pt-8 pt-4">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="md:pl-4 font-semibold text-2xl">유지보수 계약업체A/S</h2>
                    <div className="h-[58px] mx-auto mt-4 px-4 md:px-6 md:mt-8 flex items-center justify-between rounded-tl-md rounded-tr-md border-[#E1E1E1] w-full md:h-[58px]  md:rounded-tl-md md:rounded-tr-md md:border-[#E1E1E1] border-x border-t ">
                        <div className="text-[14px] md:text-[16px] ">
                            <p
                                className="font-semibold text-[14px] text-[#A50A2E] my-auto
                        md:text-[16px]"
                            >
                                {post.subject ?? ""}
                            </p>
                        </div>
                        <div className="text-[14px] md:text-[16px]  hidden md:block">
                            상태: {post.result ?? ""}
                        </div>
                    </div>

                    <div className="md:w-full md:h-full md:rounded-bl-md md:rounded-br-md md:border-[#E1E1E1] md:border-[1px] hidden md:block">
                        <ul className="space-y-4  pt-3">
                            <li className="w-full pb-3 flex justify-between border-b border-[#E1E1E1] ">
                                <div className="mx-6">{post.userId ?? ""}</div>
                                <div className="mx-6">작성일: {truncate(post.wdate ?? "", 10)}</div>
                            </li>
                            <li>
                                <div className="mx-6 pb-8">
                                    <div className="flex justify-between">
                                        <p className="font-semibold">접수내용</p>
                                        <p>접수일: {post.asDay ?? ""}</p>
                                    </div>
                                    <div className="pl-4">
                                        <SafeHtmlComponent html={post.asMemo ?? ""} />
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="mx-6 pb-8">
                                    <p className="font-semibold">처리내용</p>
                                    <div className="pl-4">
                                        <SafeHtmlComponent html={post.asResult ?? ""} />
                                    </div>
                                </div>
                                <div className="mx-6 pb-8">
                                    <p className="font-semibold">비고</p>
                                    <div className="pl-4">
                                        <SafeHtmlComponent html={post.bigo ? post.bigo : "-"} />
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* 모바일 */}
                    <div className="w-full h-[full] mx-auto border rounded-b-md md:hidden">
                        <ul className="w-[full]   space-y-2">
                            <li className="py-[15px] px-4 flex justify-between text-[14px] border-b">
                                <div className=" font-semibold ">상태 : {post.result ?? ""}</div>
                                <div className=" font-semibold">
                                    작성일 : {truncate(post.wdate ?? "", 10)}
                                </div>
                            </li>
                            <div className="p-4 text-[14px] flex">
                                <p className="font-semibold pr-2">접수일 :</p> {post.asDay ?? ""}
                            </div>
                            <div className="p-4 text-[14px]">
                                <p className="font-semibold">문의내용</p>
                                <SafeHtmlComponent html={post.asMemo} />
                            </div>
                            <div className="pb-8 text-[14px] pt-2">
                                <p className="font-semibold pl-4">처리내용</p>
                                <div className="pl-4">
                                    <SafeHtmlComponent html={post.asResult} />
                                </div>
                            </div>
                            <div className="pb-8 text-[14px] ">
                                <p className="font-semibold pl-4">비고</p>
                                <div className="pl-4">
                                    <SafeHtmlComponent html={post.bigo ? post.bigo : "-"} />
                                </div>
                            </div>
                        </ul>
                    </div>
                    <div className="flex justify-center pt-3 space-x-4 pb-20">
                        <div>
                            <button
                                onClick={listClick}
                                className="w-[105px] bg-[#A50A2E] hover:bg-slate-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                                disabled={isLoading || isDeleting}
                            >
                                목록
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={editClick}
                                className="w-[105px] px-4 py-2 text-white bg-[#77829B] border border-slate-400 border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                                disabled={isLoading || isDeleting}
                            >
                                수정
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={deleteClick}
                                className="w-[105px] px-4 py-2 text-white bg-[#77829B] border border-slate-400 border-transparent shadow-sm rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                                disabled={isLoading || isDeleting}
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
