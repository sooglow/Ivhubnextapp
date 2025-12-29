"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInput } from "@/public/hooks/useInput";
import { useIvUpgradeList } from "../hooks/useIvUpgradeList";
import SearchSection from "../components/SearchSection";
import ListItemLoader from "../components/ListItemLoader";
import MobileListItemLoader from "../components/MobileListItemLoader";
import { SOLUTION_MAPPING } from "@/public/constants/solution";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import type { UpgradeListItem } from "../types/List";

const PAGE_SIZE = 10;

const columnHelper = createColumnHelper<UpgradeListItem>();

export default function IvUpgradeList() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const keywordInput = useInput("", (value: string) => value.length <= 50);
    const keywordRef = useRef<HTMLInputElement>(null);

    const { data: queryData, isLoading, error } = useIvUpgradeList({
        keyword: searchKeyword,
        currentPage,
        pageSize: PAGE_SIZE,
        enabled: true,
    });

    const lists = queryData?.data?.items || [];
    const totalCount = queryData?.data?.totalCount || 0;

    const columns = [
        columnHelper.accessor("RowNumber", {
            header: "번호",
            cell: (info) => (
                <div className="text-[#0340E6] font-bold">{info.getValue()}</div>
            ),
        }),
        columnHelper.accessor("prgName", {
            header: "솔루션",
            cell: (info) => (
                <div className="whitespace-nowrap">
                    {SOLUTION_MAPPING[info.getValue()] || info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor("title", {
            header: "제목",
            cell: (info) => <div className="whitespace-nowrap">{info.getValue()}</div>,
        }),
        columnHelper.accessor("writer", {
            header: "작성자",
            cell: (info) => <div className="whitespace-nowrap">{info.getValue()}</div>,
        }),
        columnHelper.accessor("wdate", {
            header: "작성일",
            cell: (info) => <div className="whitespace-nowrap">{info.getValue()?.slice(0, 10)}</div>,
        }),
    ];

    const table = useReactTable({
        data: lists,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const validateKeyword = useCallback((): boolean => {
        if (keywordInput.value.trim().length > 0 && keywordInput.value.trim().length < 2) {
            alert("검색어는 2자 이상 입력해 주세요.");
            keywordRef.current?.focus();
            return false;
        }
        return true;
    }, [keywordInput.value]);

    const searchClick = useCallback((): void => {
        if (keywordInput.value === "" || validateKeyword()) {
            setSearchKeyword(keywordInput.value);
            if (currentPage !== 1) {
                setCurrentPage(1);
            }
        }
    }, [validateKeyword, currentPage, keywordInput.value]);

    const initClick = useCallback((): void => {
        keywordInput.setValue("");
        setSearchKeyword("");
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [keywordInput, currentPage]);

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>): void => {
            if (e.key === "Enter") {
                searchClick();
            }
        },
        [searchClick]
    );

    const createClick = useCallback((): void => {
        sessionStorage.setItem(
            "listState",
            JSON.stringify({
                upgradeInfo: { keyword: keywordInput.value, page: currentPage },
            })
        );
        router.push("/homePage/upgradeInfo/Create");
    }, [router, keywordInput.value, currentPage]);

    const listItemClick = useCallback(
        (serial: string): void => {
            sessionStorage.setItem(
                "listState",
                JSON.stringify({
                    upgradeInfo: { keyword: keywordInput.value, page: currentPage },
                })
            );
            router.push(`/homePage/upgradeInfo/Edit/${serial}`);
        },
        [router, keywordInput.value, currentPage]
    );

    const setPage = useCallback((page: number): void => {
        setCurrentPage(page);
    }, []);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen">
                <main className="w-full flex-grow">
                    <div className="max-w-6xl mx-auto pb-20">
                        <h2 className="pl-4 font-semibold text-2xl py-4 md:py-8">
                            IV 신규기능소개
                        </h2>
                        <div className="text-center py-10 text-red-500">
                            에러가 발생했습니다: {error.message}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto pb-20">
                    <h2 className="pl-4 font-semibold text-2xl py-4 md:py-8">IV 신규기능소개</h2>

                    <SearchSection
                        keywordRef={keywordRef}
                        keywordValue={keywordInput.value}
                        onKeywordChange={keywordInput.onChange}
                        onKeyPress={handleKeyPress}
                        onSearch={searchClick}
                        onReset={initClick}
                        loading={isLoading}
                    />

                    <div className="pt-4 pl-4 md:pt-4 md:pl-4">
                        <button
                            onClick={createClick}
                            className="w-[115px] h-10 bg-[#77829B] text-[#FFFFFF] rounded-[5px] text-[14px] md:w-[115px] md:h-10 cursor-pointer"
                        >
                            작성하기
                        </button>
                    </div>

                    <div className="mt-2 md:mt-4">
                        {/* 데스크톱 테이블 */}
                        <div className="hidden md:block">
                            <div className="border border-[#E1E1E1] rounded-[5px]">
                                <table className="w-full border-collapse">
                                    <thead>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <tr key={headerGroup.id} className="bg-[#F9FBFC] text-[14px]">
                                                {headerGroup.headers.map((header) => (
                                                    <th
                                                        key={header.id}
                                                        className="p-4 text-left"
                                                        style={{
                                                            width:
                                                                header.id === "RowNumber"
                                                                    ? "10%"
                                                                    : header.id === "prgName"
                                                                    ? "20%"
                                                                    : header.id === "title"
                                                                    ? "20%"
                                                                    : header.id === "writer"
                                                                    ? "10%"
                                                                    : "10%",
                                                        }}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={5}>
                                                    <ListItemLoader />
                                                </td>
                                            </tr>
                                        ) : table.getRowModel().rows.length > 0 ? (
                                            table.getRowModel().rows.map((row) => (
                                                <tr
                                                    key={row.id}
                                                    onClick={() => listItemClick(row.original.serial)}
                                                    className="hover:bg-slate-100 cursor-pointer transition-all"
                                                >
                                                    {row.getVisibleCells().map((cell) => (
                                                        <td
                                                            key={cell.id}
                                                            className="p-4 border-t border-[#E1E1E1]"
                                                        >
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center text-[16px]">
                                                    결과가 없습니다.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 모바일 테이블 */}
                        <div className="md:hidden">
                            {isLoading ? (
                                <MobileListItemLoader />
                            ) : table.getRowModel().rows.length > 0 ? (
                                <div>
                                    {table.getRowModel().rows.map((row) => (
                                        <div
                                            key={row.id}
                                            onClick={() => listItemClick(row.original.serial)}
                                            className="border border-[#E1E1E1] rounded-[5px] mb-[14px] p-4 cursor-pointer hover:bg-slate-100"
                                        >
                                            <div className="text-[#0340E6] font-semibold">
                                                {row.original.RowNumber}
                                            </div>
                                            <div className="pt-1 font-semibold">
                                                {SOLUTION_MAPPING[row.original.prgName] ||
                                                    row.original.prgName}
                                            </div>
                                            <div className="pt-1 text-ellipsis">
                                                {row.original.title}
                                            </div>
                                            <div className="pt-1 flex justify-between">
                                                <div>{row.original.writer}</div>
                                                <div>{row.original.wdate?.slice(0, 10)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="pl-2 pt-2 text-[16px]">결과가 없습니다.</div>
                            )}
                        </div>
                    </div>

                    <div className="py-5 flex justify-center">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                이전
                            </button>
                            {pageNumbers.map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-3 py-1 border rounded ${
                                        currentPage === pageNum
                                            ? "bg-[#A50A2E] text-white"
                                            : "bg-white"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                다음
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
