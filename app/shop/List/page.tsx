"use client";

import { useShopList } from "@/app/shop/hooks/useShopList";
import { useCodeList } from "@/app/shop/hooks/useCodeList";
import { ShopItem } from "@/app/shop/types/List";
import SearchSection from "@/app/shop/components/SearchSection";
import ListItemLoader from "@/app/shop/components/ListItemLoader";
import MobileListItemLoader from "@/app/shop/components/MobileListItemLoader";
import Pagination from "@/public/components/Pagination";
import { useAlert } from "@/public/hooks/useAlert";
import { useInput } from "@/public/hooks/useInput";
import { useUserData } from "@/public/hooks/useUserData";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

export default function ShopList(): React.ReactElement {
    const PAGE_SIZE = 10;
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [prgCode, setPrgCode] = useState<string>("");
    const [areaCode, setAreaCode] = useState<string>("");
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const keywordInput = useInput("", (value: string) => value.length <= 50);
    const keywordRef = useRef<HTMLInputElement>(null);
    const userData = useUserData();

    // Code lists 조회
    const { data: prgCodeData } = useCodeList("prgcode");
    const { data: areaCodeData } = useCodeList("areacode");

    const prgItems = prgCodeData?.data?.items || [];
    const areaItems = areaCodeData?.data?.items || [];

    // 관리자 여부 확인 (deptCode가 "03"이면 관리자)
    const isAdmin = userData?.deptCode === "03";

    // React Query 사용
    const { data: queryData, isLoading } = useShopList(
        searchKeyword,
        currentPage,
        PAGE_SIZE,
        prgCode,
        areaCode
    );

    // 데이터 추출
    const shopLists = queryData?.data?.items || [];
    const totalCount = queryData?.data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const validateKeyword = useAlert([
        {
            test: () => keywordInput.value.length === 0 || keywordInput.value.length >= 2,
            message: "검색어는 2자 이상 입력해 주세요.",
            ref: keywordRef,
        },
    ]);

    // Tanstack Table 컬럼 정의
    const columnHelper = createColumnHelper<ShopItem>();

    const columns = [
        columnHelper.accessor("comCode", {
            header: "업체코드",
            cell: (info) => (
                <span className="text-[#0340E6] font-bold">{info.getValue() ?? ""}</span>
            ),
        }),
        columnHelper.accessor("area", {
            header: "지역",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("comName", {
            header: "업체명",
            cell: (info) => (
                <span className="max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap text-black">
                    {info.getValue() ?? ""}
                </span>
            ),
        }),
        columnHelper.accessor("boss", {
            header: "대표자",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("idno", {
            header: "사업자등록번호",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("hp", {
            header: "전화번호",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("areaName", {
            header: "담당지사",
            cell: (info) => {
                const areaName = info.getValue();
                return areaName === "본사" ? (
                    <div className="w-[75px] h-[28px] pt-[2px] bg-[#FFECF1] rounded-[5px] text-center">
                        {areaName}
                    </div>
                ) : (
                    <div className="w-[75px] h-[28px] pt-[2px] bg-[#E5F3FF] rounded-[5px] text-center">
                        {areaName}
                    </div>
                );
            },
        }),
    ];

    const table = useReactTable({
        data: shopLists,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(totalCount / PAGE_SIZE),
        state: {
            pagination: {
                pageIndex: currentPage - 1,
                pageSize: PAGE_SIZE,
            },
        },
    });

    const handleSearch = useCallback(() => {
        if (!validateKeyword()) return;
        setSearchKeyword(keywordInput.value);
        setCurrentPage(1);
    }, [validateKeyword, keywordInput.value]);

    const handleReset = useCallback(() => {
        keywordInput.setValue("");
        setSearchKeyword("");
        setPrgCode("");
        setAreaCode("");
        setCurrentPage(1);
    }, [keywordInput]);

    const handlePrgCodeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setPrgCode(e.target.value);
    }, []);

    const handleAreaCodeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setAreaCode(e.target.value);
    }, []);

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                handleSearch();
            }
        },
        [handleSearch]
    );

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto pb-20">
                    <h2 className="pl-4 font-semibold text-2xl md:py-8 py-4">업체 관리</h2>

                    {/* 검색 영역 */}
                    <SearchSection
                        keywordRef={keywordRef}
                        keywordValue={keywordInput.value}
                        onKeywordChange={keywordInput.onChange}
                        onKeyPress={handleKeyPress}
                        onSearch={handleSearch}
                        onReset={handleReset}
                        loading={isLoading}
                        isMobile={isMobile}
                        prgCode={prgCode}
                        onPrgCodeChange={handlePrgCodeChange}
                        prgItems={prgItems}
                        areaCode={areaCode}
                        onAreaCodeChange={handleAreaCodeChange}
                        areaItems={areaItems}
                        showAreaFilter={isAdmin}
                    />

                    <div className="mt-2 md:mt-4">
                        {/* 데스크탑 테이블 */}
                        <div className="hidden md:block">
                            <div className="border border-[#E1E1E1] rounded-[5px]">
                                <table className="w-full border-collapse">
                                    <thead>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <tr
                                                key={headerGroup.id}
                                                className="bg-[#F9FBFC] text-[14px]"
                                            >
                                                {headerGroup.headers.map((header) => (
                                                    <th
                                                        key={header.id}
                                                        className="p-4 text-left"
                                                        style={{
                                                            width:
                                                                header.id === "comCode"
                                                                    ? "13%"
                                                                    : header.id === "area"
                                                                    ? "14%"
                                                                    : header.id === "comName"
                                                                    ? "20%"
                                                                    : header.id === "boss"
                                                                    ? "13%"
                                                                    : header.id === "idno"
                                                                    ? "15%"
                                                                    : header.id === "hp"
                                                                    ? "15%"
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
                                                <td colSpan={7}>
                                                    <ListItemLoader />
                                                </td>
                                            </tr>
                                        ) : table.getRowModel().rows.length > 0 ? (
                                            table.getRowModel().rows.map((row) => (
                                                <tr
                                                    key={row.id}
                                                    onClick={() => {
                                                        router.push(
                                                            `/shop/View/${row.original.comCode}`
                                                        );
                                                    }}
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
                                                <td colSpan={7} className="p-4 text-center">
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
                                            onClick={() => {
                                                router.push(`/shop/View/${row.original.comCode}`);
                                            }}
                                            className="border rounded-[5px] mb-2 cursor-pointer hover:bg-slate-100"
                                        >
                                            <div className="p-4">
                                                <div className="flex justify-between">
                                                    <span className="text-[#0340E6] font-bold">
                                                        {row.original.comCode}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {row.original.area}
                                                    </span>
                                                </div>
                                                <div className="pt-1 font-semibold">
                                                    {row.original.comName}
                                                </div>
                                                <div className="pt-1 text-sm text-gray-600">
                                                    {row.original.boss} | {row.original.hp}
                                                </div>
                                                <div className="pt-1 text-sm text-gray-500">
                                                    {row.original.idno}
                                                </div>
                                                <div className="pt-2 flex justify-end">
                                                    {row.original.areaName === "본사" ? (
                                                        <div className="w-[75px] h-[28px] pt-[2px] bg-[#FFECF1] rounded-[5px] text-center text-sm">
                                                            {row.original.areaName}
                                                        </div>
                                                    ) : (
                                                        <div className="w-[75px] h-[28px] pt-[2px] bg-[#E5F3FF] rounded-[5px] text-center text-sm">
                                                            {row.original.areaName}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4">결과가 없습니다.</div>
                            )}
                        </div>
                    </div>

                    {/* 페이지네이션 */}
                    <div className="py-5">
                        <Pagination
                            currentPage={currentPage - 1}
                            totalPages={totalPages}
                            onPageChange={useCallback(
                                (pageIndex: number) => setCurrentPage(pageIndex + 1),
                                []
                            )}
                            canPreviousPage={table.getCanPreviousPage()}
                            canNextPage={table.getCanNextPage()}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
