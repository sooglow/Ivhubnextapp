"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTsSerialView, useTsSerialDelete } from "../../hooks/useTsSerial";

interface TsSerialViewProps {
    params: Promise<{ serial: string }>;
}

export default function TsSerialView({ params }: TsSerialViewProps) {
    const router = useRouter();
    const [serial, setSerial] = useState<string>("");
    const [post, setPost] = useState<any>({});

    const { data, isLoading } = useTsSerialView(serial);
    const { mutate: deleteTsSerial, isPending: isDeleting } = useTsSerialDelete(serial);

    const listClick = () => {
        router.push("/deptWorks/tsSerial/List");
    };

    const editClick = () => {
        router.push(`/deptWorks/tsSerial/Edit/${serial}`);
    };

    const deleteClick = () => {
        if (!window.confirm("삭제후에는 복원이 불가능합니다.\n삭제 하시겠습니까?")) {
            return;
        }

        deleteTsSerial(undefined, {
            onSuccess: () => {
                alert("삭제되었습니다.");
                router.push("/deptWorks/tsSerial/List");
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
                    <h2 className="md:pl-4 font-semibold text-2xl">국토부 시리얼 관리</h2>

                    <div className="h-[58px] mx-auto mt-4 px-4 md:px-6 md:mt-8 flex items-center justify-between rounded-tl-md rounded-tr-md border-[#E1E1E1] w-full md:h-[58px] md:rounded-tl-md md:rounded-tr-md md:border-[#E1E1E1] border-x border-t">
                        <div className="text-[14px] md:text-[16px]">
                            <p className="font-semibold text-[14px] text-[#A50A2E] my-auto md:text-[16px]">
                                시리얼: {post.comSerial ?? ""}
                            </p>
                        </div>
                        <div className="text-[14px] md:text-[16px] hidden md:block">
                            발급일자: {truncate(post.intDay ?? "", 12)}
                        </div>
                    </div>

                    {/* 데스크톱 */}
                    <div className="md:w-full md:h-full md:rounded-bl-md md:rounded-br-md md:border-[#E1E1E1] md:border-[1px] hidden md:block">
                        <ul className="space-y-4 pt-6 pb-6">
                            <li className="w-full flex">
                                <div className="w-1/4 mx-6 font-semibold">업체명</div>
                                <div className="w-3/4 mx-6">{post.name ?? ""}</div>
                            </li>
                            <li className="w-full flex">
                                <div className="w-1/4 mx-6 font-semibold">사업자등록번호</div>
                                <div className="w-3/4 mx-6">{post.idNo ?? ""}</div>
                            </li>
                            <li className="w-full flex">
                                <div className="w-1/4 mx-6 font-semibold">담당자</div>
                                <div className="w-3/4 mx-6">{post.manName ?? ""}</div>
                            </li>
                            <li className="w-full flex">
                                <div className="w-1/4 mx-6 font-semibold">담당지사</div>
                                <div className="w-3/4 mx-6">{post.areaName ?? ""}</div>
                            </li>
                        </ul>
                    </div>

                    {/* 모바일 */}
                    <div className="w-full h-[full] mx-auto border rounded-b-md md:hidden">
                        <ul className="w-[full] space-y-2">
                            <li className="py-[15px] px-4 text-[14px] border-b">
                                <div className="font-semibold">
                                    발급일자: {truncate(post.intDay ?? "", 12)}
                                </div>
                            </li>
                            <div className="p-4 text-[14px] flex">
                                <p className="font-semibold pr-2 w-1/3">업체명:</p>
                                <p className="w-2/3">{post.name ?? ""}</p>
                            </div>
                            <div className="p-4 text-[14px] flex">
                                <p className="font-semibold pr-2 w-1/3">사업자등록번호:</p>
                                <p className="w-2/3">{post.idNo ?? ""}</p>
                            </div>
                            <div className="p-4 text-[14px] flex">
                                <p className="font-semibold pr-2 w-1/3">담당자:</p>
                                <p className="w-2/3">{post.manName ?? ""}</p>
                            </div>
                            <div className="p-4 text-[14px] flex pb-8">
                                <p className="font-semibold pr-2 w-1/3">담당지사:</p>
                                <p className="w-2/3">{post.areaName ?? ""}</p>
                            </div>
                        </ul>
                    </div>

                    <div className="flex justify-center pt-3 space-x-4 pb-20">
                        <div>
                            <button
                                onClick={listClick}
                                className="w-[105px] bg-[#A50A2E] text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer"
                                disabled={isLoading || isDeleting}
                            >
                                목록
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={editClick}
                                className="w-[105px] px-4 py-2 text-white bg-[#77829B] border border-slate-400 border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer"
                                disabled={isLoading || isDeleting}
                            >
                                수정
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={deleteClick}
                                className="w-[105px] px-4 py-2 text-white bg-[#77829B] border border-slate-400 border-transparent shadow-sm rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer"
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
