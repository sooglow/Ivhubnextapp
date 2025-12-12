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
import { useMaintenanceList } from "../hooks/useMaintenance";
import { useInput } from "@/public/hooks/useInput";
import { useAlert } from "@/public/hooks/useAlert";
import { saveStateToSessionStorage } from "@/public/utils/utils";
import Pagination from "@/public/components/Pagination";
import ListItemLoader from "../components/ListItemLoader";
import MobileListItemLoader from "../components/MobileListItemLoader";
import SearchSection from "../components/SearchSection";
import { MaintenanceListItem } from "../types/List";
import axios from "axios";

export default function MaintenanceList() {
    const router = useRouter();
    const PAGE_SIZE = 10;

    const [currentPage, setCurrentPage] = useState(1);
    const [comCode, setComCode] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [mItems, setMItems] = useState<{ code: string; codename: string }[]>([]);

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
    } = useMaintenanceList(comCode, currentPage, PAGE_SIZE);

    const maintenanceList = queryData?.data || [];
    const totalCount = queryData?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    // Tanstack Table 컬럼 정의
    const columnHelper = createColumnHelper<MaintenanceListItem>();

    const columns = [
        columnHelper.accessor((row, index) => index + 1 + (currentPage - 1) * PAGE_SIZE, {
            id: "rowNumber",
            header: "번호",
            cell: (info) => <span className="text-[#0340E6] font-bold">{info.getValue()}</span>,
        }),
        columnHelper.accessor("asDay", {
            header: "접수일",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("asComName", {
            header: "계약업체",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("subject", {
            header: "제목",
            cell: (info) => (
                <span className="max-w-[403px] whitespace-nowrap overflow-hidden text-ellipsis block">
                    {info.getValue() ?? ""}
                </span>
            ),
        }),
        columnHelper.accessor("userId", {
            header: "처리자",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("result", {
            header: "상태",
            cell: (info) => info.getValue() ?? "",
        }),
    ];

    // 모바일용 컬럼 정의
    const mobileColumns = [
        columnHelper.accessor((row) => row, {
            id: "mobileView",
            header: "",
            cell: (info) => {
                const row = info.getValue();
                const index = info.row.index + 1 + (currentPage - 1) * PAGE_SIZE;
                return (
                    <div className="p-4">
                        <div className="w-full text-[#0340E6] font-semibold">{index}</div>
                        <div className="pt-1 font-semibold text-ellipsis flex justify-between">
                            <div>{row.subject ?? ""}</div>
                            <div className="whitespace-nowrap">{row.userId ?? ""}</div>
                        </div>
                        <div className="pt-1 font-semibold text-ellipsis"></div>
                        <div className="pt-1 flex justify-between">
                            <div className="pt-1">{row.asComName ?? ""}</div>
                            <div className="pt-1">{row.asDay ?? ""}</div>
                        </div>
                    </div>
                );
            },
        }),
    ];

    // Tanstack Table 생성
    const table = useReactTable({
        data: maintenanceList,
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
        setComCode("");
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
            router.push(`/deptWorks/maintenance/View/${serial}`);
            saveStateToSessionStorage({
                maintenance: {
                    keyword: keywordInput.value,
                    comCode: comCode,
                    page: currentPage,
                },
            });
        },
        [router, keywordInput.value, comCode, currentPage]
    );

    const handleCreate = useCallback(() => {
        router.push("/deptWorks/maintenance/Create");
        saveStateToSessionStorage({
            maintenance: {
                keyword: keywordInput.value,
                comCode: comCode,
                page: currentPage,
            },
        });
    }, [router, keywordInput.value, comCode, currentPage]);

    const pageChange = useCallback((pageIndex: number) => {
        setCurrentPage(pageIndex + 1);
    }, []);

    const handleComCodeChange = useCallback((newComCode: string) => {
        setComCode(newComCode);
        setCurrentPage(1);
    }, []);

    // 유지보수계약업체 목록 가져오기
    useEffect(() => {
        const fetchMItems = async () => {
            try {
                const response = await axios.get("/api/code?Kind=mcode");
                if (response.data.result) {
                    setMItems(response.data.data.items || []);
                }
            } catch (error) {
                console.error("Error fetching mcode:", error);
            }
        };

        fetchMItems();
    }, []);

    // 모바일 감지 및 상태 복원
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        const listState = JSON.parse(sessionStorage.getItem("listState") || "{}")?.maintenance;

        if (listState) {
            keywordInput.setValue(listState.keyword || "");
            setSearchKeyword(listState.keyword || "");
            setComCode(listState.comCode || "");
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
                    <h2 className="pl-4 font-semibold text-2xl py-4 md:py-8">
                        유지보수 계약업체A/S
                    </h2>

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
                        comCode={comCode}
                        comItems={mItems}
                        onComCodeChange={handleComCodeChange}
                    />

                    {/* 작성 버튼 */}
                    <div className="pt-4 pl-4 md:pt-5 md:pl-4">
                        <button
                            onClick={handleCreate}
                            className="w-[115px] h-10 bg-[#77829B] text-[#FFFFFF] rounded-[5px] text-[14px] md:w-[115px] md:h-10"
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
                                                className="p-4 text-left whitespace-nowrap"
                                                style={{
                                                    width:
                                                        header.id === "rowNumber"
                                                            ? "10%"
                                                            : header.id === "asDay"
                                                            ? "15%"
                                                            : header.id === "asComName"
                                                            ? "10%"
                                                            : header.id === "subject"
                                                            ? "40%"
                                                            : header.id === "userId"
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
                                        <td colSpan={6}>
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
                                                handleRowClick(row.original.serial)
                                            }
                                            className="hover:bg-slate-100 cursor-pointer transition-all"
                                        >
                                            {!isMobile ? (
                                                row.getVisibleCells().map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        className={`p-4 hidden md:border-t md:border-[#E1E1E1] md:table-cell ${
                                                            cell.column.id === "rowNumber"
                                                                ? "whitespace-nowrap"
                                                                : cell.column.id === "asDay"
                                                                ? "text-left whitespace-nowrap"
                                                                : cell.column.id === "asComName"
                                                                ? "text-left whitespace-nowrap"
                                                                : cell.column.id === "subject"
                                                                ? "max-w-[403px] text-left whitespace-nowrap overflow-hidden text-ellipsis"
                                                                : "text-left whitespace-nowrap"
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
                                                    colSpan={6}
                                                    className="p-4 border rounded-[5px] md:hidden"
                                                >
                                                    {row
                                                        .getVisibleCells()
                                                        .map((cell) =>
                                                            flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )
                                                        )}
                                                </td>
                                            )}
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
