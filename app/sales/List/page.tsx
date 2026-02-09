"use client";

import { useSalesList } from "@/app/sales/hooks/useSalesList";
import { useCodeList } from "@/app/shop/hooks/useCodeList";
import { SalesItem } from "@/app/sales/types/List";
import SearchSection from "@/app/sales/components/SearchSection";
import Pagination from "@/public/components/Pagination";
import { useAlert } from "@/public/hooks/useAlert";
import { useInput } from "@/public/hooks/useInput";
import { useUserData } from "@/public/hooks/useUserData";
import { saveStateToSessionStorage } from "@/public/utils/utils";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ListItemLoader from "@/app/shop/components/ListItemLoader";
import axiosInstance from "@/public/lib/axiosInstance";

export default function SalesList(): React.ReactElement {
    const PAGE_SIZE = 10;
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [prgCode, setPrgCode] = useState<string>("");
    const [areaCode, setAreaCode] = useState<string>("");
    const [salesMan, setSalesMan] = useState<string>("");
    const [state, setState] = useState<string | number>(0);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const keywordInput = useInput("", (value: string) => value.length <= 50);
    const keywordRef = useRef<HTMLInputElement>(null);
    const userData = useUserData();

    // Code lists 조회
    const { data: prgCodeData } = useCodeList("prgcode");
    const { data: areaCodeData } = useCodeList("areacode");
    const { data: manCodeData } = useCodeList("sales_man", areaCode || "30000");

    const prgItems = prgCodeData?.data?.items || [];
    const areaItems = areaCodeData?.data?.items || [];
    const manItems = manCodeData?.data?.items || [];

    // 관리자 여부 확인
    const isAdmin = userData?.deptCode === "03";

    // React Query 사용
    const { data: queryData, isLoading } = useSalesList(
        prgCode,
        areaCode,
        salesMan,
        state,
        searchKeyword,
        currentPage,
        PAGE_SIZE
    );

    // 데이터 추출
    const salesLists = queryData?.data?.items || [];
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
    const columnHelper = createColumnHelper<SalesItem>();

    const columns = [
        columnHelper.accessor("callDay", {
            header: "접수일",
            cell: (info) => (
                <span className="text-[#0340E6] font-bold">
                    {info.getValue()?.substring(0, 10) ?? ""}
                </span>
            ),
        }),
        columnHelper.accessor("area", {
            header: "지역",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("comName", {
            header: "업체명",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("salesArea", {
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
        columnHelper.accessor("salesMan", {
            header: "담당자",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("salesType", {
            header: "유형",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("salesStateName", {
            header: "상태",
            cell: (info) => info.getValue() ?? "",
        }),
    ];

    const table = useReactTable({
        data: salesLists,
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

    // 이벤트 핸들러
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
        setSalesMan("");
        setState("0");
        setCurrentPage(1);
    }, [keywordInput]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleRowClick = (salesSerial: string) => {
        router.push(`/sales/View/${salesSerial}`);

        saveStateToSessionStorage({
            sales: {
                keyword: keywordInput.value,
                page: currentPage,
                areaCode: areaCode,
                prgCode: prgCode,
                salesMan: salesMan,
                state: state,
            },
        });
    };

    // 엑셀 내보내기
    const handleExcel = useCallback(async () => {
        try {
            const response = await axiosInstance.get(
                `${process.env.NEXT_PUBLIC_API_URL}/Sales/ExportXls?PrgCode=${prgCode}&AreaCode=${areaCode}&SalesMan=${salesMan}&State=${state}&Keyword=${keywordInput.value}`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "SalesList.zip");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("엑셀 내보내기 오류:", error);
            alert("엑셀 내보내기에 실패했습니다.");
        }
    }, [prgCode, areaCode, salesMan, state, keywordInput.value]);

    // 지사 변경 시 담당자 초기화
    useEffect(() => {
        setSalesMan("");
    }, [areaCode]);

    // 모바일 감지
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // 초기화 및 상태 복원
    useEffect(() => {
        const listState = JSON.parse(sessionStorage.getItem("listState") || "{}")?.sales;

        if (listState) {
            keywordInput.setValue(listState.keyword || "");
            setSearchKeyword(listState.keyword || "");
            setPrgCode(listState.prgCode || "");
            setAreaCode(listState.areaCode || "");
            setSalesMan(listState.salesMan || "");
            setState(listState.state || "0");
            setCurrentPage(listState.page || 1);
            sessionStorage.removeItem("listState");
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto pb-20">
                    <h2 className="pl-4 font-semibold text-2xl md:py-8 py-4">영업문의</h2>

                    {/* 검색탭 */}
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
                        onPrgCodeChange={(e) => setPrgCode(e.target.value)}
                        prgItems={prgItems}
                        areaCode={areaCode}
                        onAreaCodeChange={(e) => setAreaCode(e.target.value)}
                        areaItems={areaItems}
                        salesMan={salesMan}
                        onSalesManChange={(e) => setSalesMan(e.target.value)}
                        manItems={manItems}
                        state={state}
                        onStateChange={(e) => setState(e.target.value)}
                        showAreaFilter={isAdmin}
                    />

                    {/* 엑셀 내보내기 버튼 */}
                    <div className="flex justify-start mt-2 md:mt-4 px-4 md:px-0 md:pl-4">
                        <button
                            onClick={handleExcel}
                            className="w-[115px] h-10 bg-[#77829B] text-[#FFFFFF] rounded-[5px] text-[14px] md:w-[115px] md:h-10 cursor-pointer"
                        >
                            엑셀 내보내기
                        </button>
                    </div>

                    {/* 테이블 */}
                    <div className="mt-2 md:mt-4">
                        <table className="table-auto w-full border-separate border-spacing-[14px] rounded md:border-spacing-0 md:border-[#E1E1E1] md:rounded-[5px] md:border">
                            <thead className="hidden md:table-header-group">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className="bg-[#F9FBFC] text-[14px]">
                                        {headerGroup.headers.map((header, idx) => (
                                            <th
                                                key={header.id}
                                                className="p-4 pl-6 text-left"
                                                style={{
                                                    width:
                                                        idx === 0
                                                            ? "15%"
                                                            : idx === 1
                                                            ? "15%"
                                                            : idx === 2
                                                            ? "28%"
                                                            : idx === 3
                                                            ? "12%"
                                                            : idx === 4
                                                            ? "10%"
                                                            : idx === 5
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
                                        <td colSpan={7}>
                                            <ListItemLoader />
                                        </td>
                                    </tr>
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="pl-2 pt-2 text-[16px]">
                                            결과가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            onClick={() => handleRowClick(row.original.salesSerial)}
                                            className="hover:bg-slate-100 cursor-pointer transition-all border-b"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td
                                                    key={cell.id}
                                                    className="p-4 pl-6 text-left hidden md:border-t md:border-[#E1E1E1] md:table-cell"
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            ))}
                                            {/* 모바일 */}
                                            <td
                                                colSpan={7}
                                                className="p-4 border rounded-[5px] md:hidden"
                                            >
                                                <div className="flex justify-between">
                                                    <div className="text-[#0340E6] font-semibold">
                                                        {row.original.comName ?? ""}
                                                    </div>
                                                    <div className="text-center">
                                                        {row.original.salesArea === "본사" ? (
                                                            <div className="w-[75px] h-[28px] pt-[2px] bg-[#FFECF1] rounded-[5px]">
                                                                {row.original.salesArea}
                                                            </div>
                                                        ) : (
                                                            <div className="w-[75px] h-[28px] pt-[2px] bg-[#E5F3FF] rounded-[5px]">
                                                                {row.original.salesArea}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="pt-1 flex justify-between">
                                                    <div>담당자: {row.original.salesMan ?? ""}</div>
                                                    <div className="pr-1">
                                                        {row.original.area ?? ""}
                                                    </div>
                                                </div>
                                                <div className="pt-1 flex justify-between">
                                                    <div>{row.original.salesStateName ?? ""}</div>
                                                    <div>
                                                        {row.original.callDay?.substring(0, 10) ??
                                                            ""}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* 페이지네이션 */}
                        {totalPages > 0 && (
                            <div className="mt-4">
                                <Pagination
                                    currentPage={currentPage - 1}
                                    totalPages={totalPages}
                                    onPageChange={(pageIndex) => setCurrentPage(pageIndex + 1)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
