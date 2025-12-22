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
import ListItemLoader from "@/app/homePage/ivInfo/components/ListItemLoader";
import MobileListItemLoader from "@/app/homePage/ivInfo/components/MobileListItemLoader";
import Pagination from "@/public/components/Pagination";
import { UserInfo } from "@/app/homePage/ivInfo/types/Create";
import { IvInfoItem } from "@/app/homePage/ivInfo/types/List";
import { useIvInfoList } from "@/app/homePage/ivInfo/hooks/useIvInfoList";

export default function IvInfoList(): React.ReactElement {
    const PAGE_SIZE = 10;
    const router = useRouter();

    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [, setResetTrigger] = useState<boolean>(false);

    const keywordInput = useInput("", (value: string) => value.length <= 50);
    const keywordRef = useRef<HTMLInputElement>(null);

    // React Query 사용
    const {
        data: queryData,
        isLoading,
        error,
        refetch,
    } = useIvInfoList({
        keyword: keywordInput.value,
        currentPage,
        pageSize: PAGE_SIZE,
        enabled: true,
    });

    // 데이터 추출
    const ivInfoLists = queryData?.data?.items || [];
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
    const columnHelper = createColumnHelper<IvInfoItem>();

    const columns = [
        columnHelper.accessor("RowNumber", {
            header: "번호",
            cell: (info) => <span className="text-[#0340E6] font-bold">{info.getValue()}</span>,
        }),
        columnHelper.accessor("subject", {
            header: "제목",
            cell: (info) => (
                <span className="max-w-[400px] whitespace-nowrap overflow-hidden text-ellipsis block">
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
                            <div className="pt-1">{row.writer}</div>
                            <div className="pt-1">{truncate(row.wdate, 12)}</div>
                        </div>
                    </div>
                );
            },
        }),
    ];

    // Tanstack Table 생성
    const table = useReactTable({
        data: ivInfoLists,
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
            if (currentPage !== 1) {
                setCurrentPage(1);
                return;
            }
            setResetTrigger((prev) => !prev);
            refetch();
        }
    }, [validateKeyword, currentPage, keywordInput.value, refetch]);

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
        if (currentPage !== 1) {
            setCurrentPage(1);
            return;
        }
        setResetTrigger((prev) => !prev);
        refetch();
    }, [keywordInput, currentPage, refetch]);

    const createClick = useCallback((): void => {
        router.push("/homePage/ivInfo/Create");
        saveStateToSessionStorage({
            ivInfo: { keyword: keywordInput.value, page: currentPage },
        });
    }, [router, keywordInput.value, currentPage]);

    const listItemClick = useCallback((serial: string): void => {
        router.push(`/homePage/ivInfo/View/${serial}`);
        saveStateToSessionStorage({
            ivInfo: { keyword: keywordInput.value, page: currentPage },
        });
    });

    const pageChange = useCallback((pageIndex: number): void => {
        setCurrentPage(pageIndex + 1);
    }, []);

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
            if (listState?.ivInfo) {
                keywordInput.setValue(listState.ivInfo.keyword);
                setCurrentPage(listState.ivInfo.page);
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
                    <h2 className="pl-4 font-semibold text-2xl md:py-8 py-4">공지사항</h2>

                    {/* 검색탭 */}
                    <div className="md:px-4 px-4">
                        <div className="flex flex-row justify-end">
                            <input
                                type="text"
                                id="keyword"
                                ref={keywordRef}
                                className="w-[300px] h-10 rounded-[5px] border border-[#E1E1E1] px-3 text-[14px] focus:outline-none focus:border-[#77829B]"
                                placeholder="검색어를 입력하세요"
                                value={keywordInput.value}
                                onChange={keywordInput.onChange}
                                onKeyDown={enterKeyPress}
                                maxLength={50}
                            />
                            <button
                                onClick={searchClick}
                                disabled={isLoading}
                                className="ml-2 w-[80px] h-10 bg-[#0340E6] text-[#FFFFFF] rounded-[5px] text-[14px] cursor-pointer disabled:bg-gray-400"
                            >
                                검색
                            </button>
                            <button
                                onClick={initClick}
                                disabled={isLoading}
                                className="ml-2 w-[80px] h-10 bg-[#77829B] text-[#FFFFFF] rounded-[5px] text-[14px] cursor-pointer disabled:bg-gray-400"
                            >
                                초기화
                            </button>
                        </div>
                    </div>

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
                                                            ? "8%"
                                                            : header.id === "subject"
                                                            ? "45%"
                                                            : header.id === "writer"
                                                            ? "15%"
                                                            : header.id === "wdate"
                                                            ? "17%"
                                                            : "15%",
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
                                                    colSpan={5}
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
                                                            {row.original.writer}
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
                                        <td colSpan={5} className="pl-2 pt-2 text-[16px]">
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
