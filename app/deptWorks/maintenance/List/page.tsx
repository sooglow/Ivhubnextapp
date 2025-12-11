"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useInput } from "@/public/hooks/useInput";
import { useMaintenanceList } from "../hooks/useMaintenance";
import Pagination from "@/public/components/Pagination";

export default function MaintenanceList() {
    const router = useRouter();
    const PAGE_SIZE = 10;
    const [comCode, setComCode] = useState("");
    const [keyword, setKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [windowWidth, setWindowWidth] = useState(0);

    const keywordInput = useInput("", (value: string) => value.length <= 50);
    const keywordRef = useRef<HTMLInputElement>(null);

    const { data, isLoading } = useMaintenanceList(comCode, currentPage, PAGE_SIZE);

    const searchClick = () => {
        if (keywordInput.value.length > 1) {
            setKeyword(keywordInput.value);
            if (currentPage !== 1) {
                setCurrentPage(1);
            }
        } else {
            alert("검색어는 2자 이상 입력해 주세요.");
            keywordRef.current?.focus();
        }
    };

    const KeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            searchClick();
        }
    };

    const initClick = () => {
        keywordInput.setValue("");
        setKeyword("");
        setComCode("");
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    };

    const createClick = () => {
        router.push("/deptWorks/maintenance/Create");
    };

    const setPage = (page: number) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const listItemClick = (serial: string) => {
        router.push(`/deptWorks/maintenance/View/${serial}`);
    };

    useEffect(() => {
        setWindowWidth(window.innerWidth);

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto pb-20">
                    <h2 className="pl-4 font-semibold text-2xl py-4 md:py-8">
                        유지보수 계약업체A/S
                    </h2>

                    {/* PC 검색탭 */}
                    <div className="w-full h-[120px] bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[140px] hidden md:flex items-center">
                        <div className="flex pl-6 text-[14px]">
                            <div className="flex items-baseline">
                                <label className="font-semibold hidden md:block">검색</label>
                                <input
                                    ref={keywordRef}
                                    className="w-[65%] hidden h-12 pl-6 text-sm focus:outline-none border border-[#E1E1E1] rounded-md md:w-[350px] md:ml-12 md:pl-4 md:h-12 md:block"
                                    placeholder="제목"
                                    value={keywordInput.value}
                                    onChange={keywordInput.onChange}
                                    onKeyDown={KeyPress}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex pl-2">
                                <button
                                    onClick={searchClick}
                                    className="w-[48px] h-12 bg-[#A50A2E] rounded-[5px] hidden md:w-[48px] md:h-12 md:block"
                                    disabled={isLoading}
                                >
                                    <img
                                        className="mx-auto"
                                        src={"/images/icon_search.png"}
                                        alt="검색"
                                    />
                                </button>
                                <button
                                    onClick={initClick}
                                    className="w-[48px] border ml-2 bg-white rounded-[5px] hidden md:block md:w-[48px] md:h-12"
                                    disabled={isLoading}
                                >
                                    <img
                                        className="mx-auto"
                                        src={"/images/icon_refresh.png"}
                                        alt="초기화"
                                    />
                                </button>

                                <select
                                    value={comCode}
                                    onChange={(e) => {
                                        const newComCode = e.target.value;
                                        if (newComCode !== comCode) {
                                            setComCode(newComCode);
                                            setCurrentPage(1);
                                        }
                                    }}
                                    className="hidden md:block h-12 pl-4 md:ml-6 md:pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[200px] md:h-12 md:bg-white"
                                    disabled={isLoading}
                                >
                                    <option value="">전체</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 모바일 검색탭 */}
                    <div className="w-full h-[120px] bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[140px] flex md:hidden items-center">
                        <div className="w-full md:hidden text-[14px] px-4">
                            <div className="flex">
                                <div className="w-[100%]">
                                    <input
                                        className="w-[100%] appearance-none block h-12 pl-4 text-sm focus:outline-none border border-[#E1E1E1] rounded-md"
                                        placeholder="제목"
                                        value={keywordInput.value}
                                        onChange={keywordInput.onChange}
                                        onKeyDown={KeyPress}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        onClick={searchClick}
                                        className="w-[48px] h-12 bg-[#A50A2E] rounded-[5px] md:w-[48px] ml-2"
                                        disabled={isLoading}
                                    >
                                        <img
                                            className="mx-auto"
                                            src={"/images/icon_search.png"}
                                            alt="검색"
                                        />
                                    </button>
                                    <button
                                        onClick={initClick}
                                        className="w-[48px] border bg-white rounded-[5px] ml-1 md:w-[48px] md:h-12"
                                        disabled={isLoading}
                                    >
                                        <img
                                            className="mx-auto"
                                            src={"/images/icon_refresh.png"}
                                            alt="초기화"
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2">
                                <select
                                    value={comCode}
                                    onChange={(e) => {
                                        const newComCode = e.target.value;
                                        if (newComCode !== comCode) {
                                            setComCode(newComCode);
                                            setCurrentPage(1);
                                        }
                                    }}
                                    className="w-[40%] block h-12 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none bg-white"
                                    disabled={isLoading}
                                >
                                    <option value="">전체</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 pl-4 md:pt-5 md:pl-4">
                        <button
                            onClick={createClick}
                            className="w-[115px] h-10 bg-[#77829B] text-[#FFFFFF] rounded-[5px] text-[14px] md:w-[115px] md:h-10"
                        >
                            작성하기
                        </button>
                    </div>

                    <div>
                        <table className="mt-2 md:mt-4 table-auto w-full border-separate border-spacing-[14px] rounded md:border-spacing-0 md:border-[#E1E1E1] md:rounded-[5px] md:border">
                            <thead className="hidden md:border md:border-separate md:rounded-l-sm md:rounded-r-sm md:table-header-group">
                                <tr className="bg-[#F9FBFC] text-[14px]">
                                    <th className="w-[10%] p-4 text-left whitespace-nowrap">번호</th>
                                    <th className="w-[15%] p-4 text-left">접수일</th>
                                    <th className="w-[10%] p-4 text-left">계약업체</th>
                                    <th className="w-[40%] p-4 text-left">제목</th>
                                    <th className="w-[15%] p-4 text-left">처리자</th>
                                    <th className="w-[10%] p-4 text-left">상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center">
                                            로딩 중...
                                        </td>
                                    </tr>
                                ) : data?.data && data.data.length > 0 ? (
                                    data.data.map((list, idx) => (
                                        <tr
                                            key={idx}
                                            onClick={() => listItemClick(list.maintenanceSerial)}
                                            className="hover:bg-slate-100 cursor-pointer transition-all"
                                        >
                                            <td className="p-4 whitespace-nowrap text-[#0340E6] font-bold hidden md:border-t last:rounded-bl-md md:table-cell">
                                                {(currentPage - 1) * PAGE_SIZE + idx + 1}
                                            </td>
                                            <td className="p-4 text-left hidden whitespace-nowrap md:border-t md:table-cell">
                                                {list.asDay ?? ""}
                                            </td>
                                            <td className="p-4 text-left hidden md:border-t md:table-cell whitespace-nowrap">
                                                {list.comName ?? ""}
                                            </td>
                                            <td className="max-w-[403px] p-4 text-left whitespace-nowrap overflow-hidden text-ellipsis hidden md:border-t md:table-cell">
                                                {list.subject ?? ""}
                                            </td>
                                            <td className="p-4 text-left hidden md:border-t md:table-cell whitespace-nowrap">
                                                {list.userId ?? ""}
                                            </td>
                                            <td className="p-4 text-left hidden md:border-t md:table-cell whitespace-nowrap">
                                                {list.result ?? ""}
                                            </td>

                                            {/* 모바일 */}
                                            <td colSpan={6} className="p-4 border rounded-[5px] md:hidden">
                                                <div className="w-full text-[#0340E6] font-semibold">
                                                    {(currentPage - 1) * PAGE_SIZE + idx + 1}
                                                </div>
                                                <div className="pt-1 font-semibold text-ellipsis flex justify-between">
                                                    <div>{list.subject ?? ""}</div>
                                                    <div className="whitespace-nowrap">
                                                        {list.userId ?? ""}
                                                    </div>
                                                </div>
                                                <div className="pt-1 font-semibold text-ellipsis"></div>
                                                <div className="pt-1 flex justify-between">
                                                    <div className="pt-1">{list.comName ?? ""}</div>
                                                    <div className="pt-1">{list.asDay ?? ""}</div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="pl-2 pt-2 text-[16px]">
                                            결과가없습니다
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="py-5 md:block">
                        <Pagination
                            currentPage={currentPage}
                            totalCount={data?.totalCount || 0}
                            pageSize={PAGE_SIZE}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
