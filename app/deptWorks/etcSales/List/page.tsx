"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import { useEtcSalesList } from "../hooks/useEtcSalesList";
import { useInput } from "@/public/hooks/useInput";
import { useAlert } from "@/public/hooks/useAlert";
import { saveStateToSessionStorage } from "@/public/utils/utils";
import Pagination from "@/public/components/Pagination";
import ListItemLoader from "../components/ListItemLoader";
import MobileListItemLoader from "../components/MobileListItemLoader";
import SearchSection from "../components/SearchSection";
import { EtcSalesItem } from "../types/List";

const ETCSALES_STATUS = [
    { statusCode: "", statusName: "전체" },
    { statusCode: "0", statusName: "접수" },
    { statusCode: "1", statusName: "발주" },
    { statusCode: "2", statusName: "수령" },
    { statusCode: "3", statusName: "발송" },
    { statusCode: "4", statusName: "입금대기" },
    { statusCode: "5", statusName: "결제완결" },
];

export default function EtcSalesList() {
    const router = useRouter();
    const PAGE_SIZE = 10;

    const [currentPage, setCurrentPage] = useState(1);
    const [state, setState] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    const keywordInput = useInput("", (value: string) => value.length <= 50);
    const keywordRef = useRef<HTMLInputElement>(null);

    const validateKeyword = useAlert([
        {
            test: () => keywordInput.value.length === 0 || keywordInput.value.length >= 2,
            message: "검색어는 2자 이상 입력해 주세요.",
            ref: keywordRef,
        },
    ]);

    const {
        data: queryData,
        isLoading,
        refetch,
    } = useEtcSalesList(state, searchKeyword, currentPage, PAGE_SIZE);

    const etcSalesList = queryData?.data?.items || [];
    const totalCount = queryData?.data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    // Tanstack Table 컬럼 정의
    const columnHelper = createColumnHelper<EtcSalesItem>();

    const columns = [
        columnHelper.accessor("recDay", {
            header: "접수일",
            cell: (info) => (
                <span className="text-[#0340E6] font-bold">
                    {info.getValue()?.substring(0, 10)}
                </span>
            ),
        }),
        columnHelper.accessor("area", {
            header: "지역",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("comName", {
            header: "매출처명",
            cell: (info) => (
                <span className="max-w-[230px] whitespace-nowrap overflow-hidden text-ellipsis block">
                    {info.getValue() ?? ""}
                </span>
            ),
        }),
        columnHelper.accessor("kind", {
            header: "구분",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("qty", {
            header: "수량",
            cell: (info) => (info.getValue() ? info.getValue().toLocaleString() : ""),
        }),
        columnHelper.accessor("inTotal", {
            header: "입금액",
            cell: (info) => (info.getValue() ? info.getValue().toLocaleString() : ""),
        }),
        columnHelper.accessor("misu", {
            header: "미수액",
            cell: (info) => (info.getValue() ? info.getValue().toLocaleString() : ""),
        }),
        columnHelper.accessor("state", {
            header: "상태",
            cell: (info) => {
                const stateValue = info.getValue();
                return stateValue === "0"
                    ? "접수"
                    : stateValue === "1"
                    ? "발주"
                    : stateValue === "2"
                    ? "수령"
                    : stateValue === "3"
                    ? "발송"
                    : stateValue === "4"
                    ? "입금대기"
                    : stateValue === "5"
                    ? "결제완결"
                    : "";
            },
        }),
    ];

    // 모바일용 컬럼 정의
    const mobileColumns = [
        columnHelper.accessor((row) => row, {
            id: "mobileView",
            header: "",
            cell: (info) => {
                const row = info.getValue();
                return (
                    <div className="p-4">
                        <div className="text-[#0340E6] font-semibold flex justify-between">
                            {row.recDay?.substring(0, 12)}
                            <div className="pt-1 font-semibold text-black text-ellipsis">
                                {row.area ?? ""}
                            </div>
                        </div>
                        <div className="pt-1 flex justify-between">
                            <div className="pt-1">{row.comName ?? ""}</div>
                            <div className="pt-1">{row.kind ?? ""}</div>
                        </div>
                    </div>
                );
            },
        }),
    ];

    // Tanstack Table 생성
    const table = useReactTable({
        data: etcSalesList,
        columns: isMobile ? mobileColumns : columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(totalCount / PAGE_SIZE),
        state: {
            pagination: {
                pageIndex: currentPage - 1,
                pageSize: PAGE_SIZE,
            },
        },
        onPaginationChange: (updater) => {
            const newPagination =
                typeof updater === "function"
                    ? updater({ pageIndex: currentPage - 1, pageSize: PAGE_SIZE })
                    : updater;
            setCurrentPage(newPagination.pageIndex + 1);
        },
    });

    const handleSearch = useCallback(() => {
        if (!validateKeyword()) return;
        setSearchKeyword(keywordInput.value);
        setCurrentPage(1);
        refetch();
    }, [validateKeyword, keywordInput.value, refetch]);

    const handleReset = useCallback(() => {
        keywordInput.setValue("");
        setSearchKeyword("");
        setState("");
        setCurrentPage(1);
        refetch();
    }, [keywordInput, refetch]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleRowClick = useCallback(
        (serial: string) => {
            router.push(`/deptWorks/etcSales/Edit/${serial}`);
            saveStateToSessionStorage({
                etcSales: {
                    keyword: keywordInput.value,
                    state: state,
                    page: currentPage,
                },
            });
        },
        [router, keywordInput.value, state, currentPage]
    );

    const handleCreate = useCallback(() => {
        router.push("/deptWorks/etcSales/Create");
        saveStateToSessionStorage({
            etcSales: {
                keyword: keywordInput.value,
                state: state,
                page: currentPage,
            },
        });
    }, [router, keywordInput.value, state, currentPage]);

    const pageChange = useCallback((pageIndex: number) => {
        setCurrentPage(pageIndex + 1);
    }, []);

    const handleStateChange = useCallback((newState: string) => {
        setState(newState);
        setCurrentPage(1);
    }, []);

    // 모바일 감지 및 상태 복원
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        const listState = JSON.parse(sessionStorage.getItem("listState") || "{}")?.etcSales;

        if (listState) {
            keywordInput.setValue(listState.keyword || "");
            setSearchKeyword(listState.keyword || "");
            setState(listState.state || "");
            setCurrentPage(listState.page || 1);
            sessionStorage.removeItem("listState");
        }

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto pb-20">
                    <h2 className="pl-4 font-semibold text-2xl py-4 md:py-8">통장,양식지 접수</h2>

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
                        state={state}
                        stateItems={ETCSALES_STATUS}
                        onStateChange={handleStateChange}
                    />

                    {/* 작성 버튼 */}
                    <div className="pt-4 pl-4 md:pt-5 md:pl-4">
                        <button
                            onClick={handleCreate}
                            className="w-[115px] h-10 bg-[#77829B] text-[#FFFFFF] rounded-[5px] text-[14px] md:w-[115px] md:h-10 cursor-pointer"
                        >
                            작성하기
                        </button>
                    </div>

                    {/* 테이블 */}
                    <div>
                        <table className="mt-2 md:mt-4 table-auto w-full border-separate border-spacing-[14px] rounded md:border-spacing-0 md:border-[#E1E1E1] md:rounded-[5px] md:border">
                            <thead className="hidden md:border md:border-separate md:rounded-l-sm md:rounded-r-sm md:table-header-group">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className="bg-[#F9FBFC] text-[14px]">
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className={`p-4 ${
                                                    header.id === "qty" ||
                                                    header.id === "inTotal" ||
                                                    header.id === "misu"
                                                        ? "text-right"
                                                        : "text-left"
                                                }`}
                                                style={{
                                                    width:
                                                        header.id === "recDay"
                                                            ? "15%"
                                                            : header.id === "area"
                                                            ? "15%"
                                                            : header.id === "comName"
                                                            ? "20%"
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
                                        <td colSpan={8}>
                                            {isMobile ? (
                                                <MobileListItemLoader />
                                            ) : (
                                                <ListItemLoader />
                                            )}
                                        </td>
                                    </tr>
                                ) : table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            onClick={() =>
                                                handleRowClick(row.original.etcSalesSerial)
                                            }
                                            className="hover:bg-slate-100 cursor-pointer transition-all"
                                        >
                                            {!isMobile ? (
                                                row.getVisibleCells().map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        className={`p-4 hidden md:border-t md:border-[#E1E1E1] md:table-cell ${
                                                            cell.column.id === "qty" ||
                                                            cell.column.id === "inTotal" ||
                                                            cell.column.id === "misu"
                                                                ? "text-right"
                                                                : "text-left"
                                                        }`}
                                                    >
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </td>
                                                ))
                                            ) : (
                                                <td
                                                    colSpan={8}
                                                    className="border rounded-[5px] md:hidden"
                                                >
                                                    <div className="text-[#0340E6] font-semibold flex justify-between">
                                                        {row.original.recDay?.substring(0, 12)}
                                                        <div className="pt-1 font-semibold text-black text-ellipsis">
                                                            {row.original.area ?? ""}
                                                        </div>
                                                    </div>
                                                    <div className="pt-1 flex justify-between">
                                                        <div className="pt-1">
                                                            {row.original.comName ?? ""}
                                                        </div>
                                                        <div className="pt-1">
                                                            {row.original.kind ?? ""}
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="pl-2 pt-2 text-[16px]">
                                            결과가없습니다
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="py-5 md:block">
                        <Pagination
                            currentPage={table.getState().pagination.pageIndex}
                            totalPages={totalPages}
                            onPageChange={pageChange}
                            canPreviousPage={table.getCanPreviousPage()}
                            canNextPage={table.getCanNextPage()}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
