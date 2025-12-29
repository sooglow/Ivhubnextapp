"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import { useAlert } from "@/public/hooks/useAlert";
import { useInput } from "@/public/hooks/useInput";
import { parseJWT, saveStateToSessionStorage, truncate } from "@/public/utils/utils";
import ListItemLoader from "@/app/deptWorks/asCase/components/ListItemLoader";
import MobileListItemLoader from "@/app/deptWorks/asCase/components/MobileListItemLoader";
import Pagination from "@/public/components/Pagination";
import { UserInfo } from "@/app/deptWorks/asCase/types/Create";
import SearchSection from "@/app/deptWorks/asCase/components/SearchSection";
import { AsCaseItem } from "@/app/deptWorks/asCase/types/List";
import { useAsCaseList } from "@/app/deptWorks/asCase/hooks/useAsCaseList";
import { useQuery } from "@tanstack/react-query";

export default function AsCaseList(): React.ReactElement {
    const PAGE_SIZE = 10;
    const router = useRouter();

    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [prgCode, setPrgCode] = useState<string>("");
    const [prgItems, setPrgItems] = useState<any[]>([]);

    const keywordInput = useInput("", (value: string) => value.length <= 50);
    const keywordRef = useRef<HTMLInputElement>(null);

    // 프로그램 코드 목록 조회
    const { data: prgData } = useQuery({
        queryKey: ["prgCode"],
        queryFn: async () => {
            const response = await fetch("/api/code?Kind=prgcode");
            return response.json();
        },
    });

    useEffect(() => {
        if (prgData?.result && prgData?.data?.items) {
            setPrgItems(prgData.data.items);
        }
    }, [prgData]);

    // React Query 사용
    const {
        data: queryData,
        isLoading,
        error,
    } = useAsCaseList({
        prgCode: prgCode,
        keyword: searchKeyword,
        currentPage,
        pageSize: PAGE_SIZE,
        enabled: true,
    });

    // 데이터 추출
    const asCaseLists = queryData?.data?.items || [];
    const totalCount = queryData?.data?.totalCount || 0;

    const validateKeyword = useAlert([
        {
            test: () => keywordInput.value.length === 0 || keywordInput.value.length >= 2,
            message: "검색어는 2자 이상 입력해 주세요.",
            ref: keywordRef,
        },
    ]);

    // 에러 처리
    useEffect(() => {
        if (error) {
            console.error("API Error:", error);
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
        }
    }, [error]);

    // Tanstack Table 컬럼 정의
    const columnHelper = createColumnHelper<AsCaseItem>();

    const columns = [
        columnHelper.accessor("RowNumber", {
            header: "번호",
            cell: (info) => <span className="text-[#0340E6] font-bold">{info.getValue()}</span>,
        }),
        columnHelper.accessor("prgName", {
            header: "솔루션",
            cell: (info) => (
                <span className="max-w-[100px] whitespace-nowrap  text-ellipsis block">
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor("asName", {
            header: "유형",
            cell: (info) => info.getValue() || "-",
        }),
        columnHelper.accessor("subject", {
            header: "제목",
            cell: (info) => (
                <span className="max-w-[220px] whitespace-nowrap overflow-hidden text-ellipsis block">
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor("writer", {
            header: "작성자",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("wdate", {
            header: "작성일",
            cell: (info) => truncate(info.getValue(), 11),
        }),
        columnHelper.accessor("visited", {
            header: "조회수",
            cell: (info) => info.getValue(),
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
                        <div className="text-[#0340E6] font-semibold">{row.RowNumber}</div>
                        <div className="pt-1 font-semibold text-ellipsis">{row.subject}</div>
                        <div className="pt-1 flex justify-between">
                            <div className="pt-1">{row.prgName}</div>
                            <div className="pt-1">{truncate(row.wdate, 12)}</div>
                        </div>
                    </div>
                );
            },
        }),
    ];

    // Tanstack Table 생성
    const table = useReactTable({
        data: asCaseLists,
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

    const searchClick = useCallback((): void => {
        if (keywordInput.value === "" || validateKeyword()) {
            setSearchKeyword(keywordInput.value);
            if (currentPage !== 1) {
                setCurrentPage(1);
            }
        }
    }, [validateKeyword, currentPage, keywordInput.value]);

    const enterKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>): void => {
            if (e.key === "Enter") {
                searchClick();
            }
        },
        [searchClick]
    );

    const initClick = useCallback((): void => {
        keywordInput.setValue("");
        setSearchKeyword("");
        setPrgCode("");
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [keywordInput, currentPage]);

    const createClick = useCallback((): void => {
        router.push("/deptWorks/asCase/Create");
        saveStateToSessionStorage({
            asCase: { keyword: keywordInput.value, prgCode: prgCode, page: currentPage },
        });
    }, [router, keywordInput.value, prgCode, currentPage]);

    const listItemClick = useCallback(
        (serial: string): void => {
            router.push(`/deptWorks/asCase/View/${serial}`);
            saveStateToSessionStorage({
                asCase: { keyword: keywordInput.value, prgCode: prgCode, page: currentPage },
            });
        },
        [router, keywordInput.value, prgCode, currentPage]
    );

    const pageChange = useCallback((pageIndex: number): void => {
        setCurrentPage(pageIndex + 1);
    }, []);

    const handlePrgCodeChange = useCallback(
        (newPrgCode: string): void => {
            if (newPrgCode !== prgCode) {
                setPrgCode(newPrgCode);
                setCurrentPage(1);
            }
        },
        [prgCode]
    );

    // 모바일 감지
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // 초기화 및 상태 복원
    useEffect(() => {
        if (typeof window !== "undefined") {
            const tokenItem = localStorage.getItem("atKey");
            const token = tokenItem ? JSON.parse(tokenItem)?.token : null;
            const payload = parseJWT(token);
            if (payload) {
                setUserInfo(payload);
            }

            const listStateItem = sessionStorage.getItem("listState");
            const listState = listStateItem ? JSON.parse(listStateItem) : null;
            if (listState?.asCase) {
                keywordInput.setValue(listState.asCase.keyword);
                setPrgCode(listState.asCase.prgCode);
                setCurrentPage(listState.asCase.page);
                sessionStorage.removeItem("listState");
            } else {
                setCurrentPage(1);
            }
        }
    }, []);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto pb-20">
                    <h2 className="pl-4 font-semibold text-2xl md:py-8 py-4">상담사례</h2>

                    {/* 검색탭 */}
                    <SearchSection
                        keywordRef={keywordRef}
                        keywordValue={keywordInput.value}
                        onKeywordChange={keywordInput.onChange}
                        onKeyPress={enterKeyPress}
                        onSearch={searchClick}
                        onReset={initClick}
                        loading={isLoading}
                        isMobile={isMobile}
                        prgCode={prgCode}
                        prgItems={prgItems}
                        onPrgCodeChange={handlePrgCodeChange}
                    />

                    <div className="pt-5 pl-4 md:pt-5 md:pl-4">
                        <button
                            onClick={createClick}
                            className="w-[115px] h-10 bg-[#77829B] text-[#FFFFFF] rounded-[5px] text-[14px] md:w-[115px] md:h-10 cursor-pointer"
                        >
                            작성하기
                        </button>
                    </div>

                    <div>
                        <table className="mt-2 md:mt-4 table-auto w-full border-separate border-spacing-[14px] rounded md:border-spacing-0 md:border-[#E1E1E1] md:rounded-[5px] md:border">
                            <thead className="hidden md:border md:border-separate md:rounded-l-sm md:rounded-r-sm md:table-header-group">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className="bg-[#F9FBFC] text-[14px]">
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className={`p-4 ${
                                                    header.id === "visited"
                                                        ? "text-center"
                                                        : "text-left"
                                                }`}
                                                style={{
                                                    width:
                                                        header.id === "RowNumber"
                                                            ? "6%"
                                                            : header.id === "prgName"
                                                            ? "15%"
                                                            : header.id === "asName"
                                                            ? "17%"
                                                            : header.id === "subject"
                                                            ? "31%"
                                                            : header.id === "writer"
                                                            ? "10%"
                                                            : header.id === "wdate"
                                                            ? "12%"
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
                                            onClick={() => listItemClick(row.original.serial)}
                                            className="hover:bg-slate-100 cursor-pointer transition-all"
                                        >
                                            {!isMobile ? (
                                                row.getVisibleCells().map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        className={`p-4 hidden md:border-t md:border-[#E1E1E1] md:table-cell ${
                                                            cell.column.id === "visited"
                                                                ? "text-center"
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
                                                    colSpan={7}
                                                    className="p-4 border rounded-[5px] md:hidden"
                                                >
                                                    <div className="text-[#0340E6] font-semibold">
                                                        {row.original.RowNumber}
                                                    </div>
                                                    <div className="pt-1 font-semibold text-ellipsis">
                                                        {row.original.subject}
                                                    </div>
                                                    <div className="pt-1 flex justify-between">
                                                        <div className="pt-1">
                                                            {row.original.prgName}
                                                        </div>
                                                        <div className="pt-1">
                                                            {truncate(row.original.wdate, 12)}
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="pl-2 pt-2 text-[16px]">
                                            결과가 없습니다
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
