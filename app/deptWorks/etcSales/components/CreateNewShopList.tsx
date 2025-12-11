"use client";

import React, { useEffect, useState } from "react";
import { useInput } from "@/public/hooks/useInput";

interface CreateNewShopListProps {
    setComCode: (comCode: string) => void;
    setArea: (area: string) => void;
}

interface ShopItem {
    comCode: string;
    comName: string;
    area: string;
    areaName: string;
    boss: string;
    hp: string;
}

export default function CreateNewShopList({ setComCode, setArea }: CreateNewShopListProps) {
    const PAGE_SIZE = 3;
    const [open, setOpen] = useState(false);
    const [shopLists, setShopLists] = useState<ShopItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    const keywordInput = useInput("", (value: string) => value.length <= 50);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const searchClick = () => {
        if (currentPage !== 1) {
            setCurrentPage(1);
            return;
        }
        fetchShopList();
    };

    const KeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            searchClick();
        }
    };

    const initClick = () => {
        keywordInput.setValue("");
        if (currentPage !== 1) {
            setCurrentPage(1);
            return;
        }
        fetchShopList();
    };

    const setPage = (page: number) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const listItemClick = (comCode: string, area: string) => {
        setComCode(comCode);
        setArea(area);
        setOpen(false);
    };

    const fetchShopList = async () => {
        if (!keywordInput.value) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/shop?PageSize=${PAGE_SIZE}&PageNumber=${currentPage}&Keyword=${keywordInput.value}`
            );
            const data = await response.json();

            if (data.result && data.data) {
                setShopLists(data.data.items || []);
                setTotalCount(data.data.totalCount || 0);
            } else {
                alert(data.errMsg || "업체 목록을 불러오는데 실패했습니다.");
            }
        } catch (error) {
            console.error("Error fetching shop list:", error);
            alert("업체 목록을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (keywordInput.value) {
            fetchShopList();
        }
    }, [currentPage]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-[#A50A2E] text-white rounded-md hover:bg-[#8A0824] transition-colors cursor-pointer"
            >
                업체검색
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg max-w-[1020px] w-full mx-4 max-h-[90vh] overflow-auto">
                <div className="p-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">거래처 선택</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            업체코드 및 업체명을 이용해 업체를 검색해 주세요.
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between mb-4">
                            <div className="flex flex-row gap-2">
                                <input
                                    type="text"
                                    className="w-[300px] h-12 rounded-md border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-[#A50A2E]"
                                    placeholder="업체코드,업체명"
                                    maxLength={20}
                                    value={keywordInput.value}
                                    onChange={keywordInput.onChange}
                                    onKeyDown={KeyPress}
                                    disabled={isLoading}
                                />
                                <button
                                    className="w-12 h-12 bg-[#A50A2E] rounded-md flex items-center justify-center"
                                    onClick={searchClick}
                                    disabled={isLoading}
                                >
                                    <img src="/images/icon_search.png" alt="검색" />
                                </button>
                                <button
                                    className="w-12 h-12 bg-white border border-gray-300 rounded-md flex items-center justify-center"
                                    onClick={initClick}
                                    disabled={isLoading}
                                >
                                    <img src="/images/icon_refresh.png" alt="초기화" />
                                </button>
                            </div>
                        </div>

                        <div className="w-full">
                            <table className="table-auto w-full border border-gray-300 rounded-md">
                                <thead>
                                    <tr className="bg-[#F9FBFC] text-[14px]">
                                        <th className="w-[20%] p-4 text-left">지역</th>
                                        <th className="w-[30%] p-4 text-left">업체코드</th>
                                        <th className="w-[30%] p-4 text-left">업체명</th>
                                        <th className="w-[20%] p-4 text-left">대표자</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center">
                                                로딩 중...
                                            </td>
                                        </tr>
                                    ) : shopLists.length > 0 ? (
                                        shopLists.map((shopList, idx) => (
                                            <tr
                                                key={idx}
                                                onClick={() => {
                                                    listItemClick(shopList.comCode, shopList.area);
                                                }}
                                                className="hover:bg-slate-100 cursor-pointer transition-all border-t border-[#E1E1E1]"
                                            >
                                                <td className="p-4 text-left">
                                                    {shopList.area ?? ""}
                                                </td>
                                                <td className="p-4 text-[#0340E6] font-bold">
                                                    {shopList.comCode ?? ""}
                                                </td>
                                                <td className="p-4">{shopList.comName ?? ""}</td>
                                                <td className="p-4">{shopList.boss ?? ""}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center">
                                                결과가 없습니다.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {totalPages > 1 && (
                                <div className="mt-4 flex justify-center gap-2">
                                    <button
                                        onClick={() => setPage(1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        처음
                                    </button>
                                    <button
                                        onClick={() => setPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        이전
                                    </button>
                                    <span className="px-3 py-1">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        다음
                                    </button>
                                    <button
                                        onClick={() => setPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        마지막
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
