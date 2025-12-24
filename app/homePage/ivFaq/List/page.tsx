"use client";

import ListItemLoader from "@/app/homePage/ivFaq/components/ListItemLoader";
import MobileListItemLoader from "@/app/homePage/ivFaq/components/MobileListItemLoader";
import SearchSection from "@/app/homePage/ivFaq/components/SearchSection";
import { useIvFaqList } from "@/app/homePage/ivFaq/hooks/useIvFaqList";
import { UserInfo } from "@/app/homePage/ivFaq/types/Create";
import { IvFaqItem } from "@/app/homePage/ivFaq/types/List";
import Pagination from "@/public/components/Pagination";
import { SOLUTION } from "@/public/constants/solution";
import { useAlert } from "@/public/hooks/useAlert";
import { useInput } from "@/public/hooks/useInput";
import { parseJWT, saveStateToSessionStorage, truncate } from "@/public/utils/utils";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

export default function IvFaqList(): React.ReactElement {
    const PAGE_SIZE = 10;
    const router = useRouter();

    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [kind, setKind] = useState<string>("AUTO7");
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [, setResetTrigger] = useState<boolean>(false);

    const keywordInput = useInput("", (value: string) => value.length <= 50);
    const keywordRef = useRef<HTMLInputElement>(null);

    const {
        data: queryData,
        isLoading,
        error,
        refetch,
    } = useIvFaqList({
        kind,
        keyword: keywordInput.value,
        currentPage,
        pageSize: PAGE_SIZE,
        enabled: true,
    });

    const ivFaqLists = queryData?.data?.items || [];
    const totalCount = queryData?.data?.totalCount || 0;

    const validateKeyword = useAlert([
        {
            test: () => keywordInput.value.length === 0 || keywordInput.value.length >= 2,
            message: "검색어는 2자 이상 입력해 주세요.",
            ref: keywordRef,
        },
    ]);

    useEffect(() => {
        if (error) {
            console.error("API Error:", error);
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
        }
    }, [error]);

    const columnHelper = createColumnHelper<IvFaqItem>();

    const columns = [
        columnHelper.accessor("RowNumber", {
            header: "번호",
            cell: (info) => <span className="text-[#0340E6] font-bold">{info.getValue()}</span>,
        }),
        columnHelper.accessor("kind", {
            header: "솔루션",
            cell: (info) => (
                <span>
                    {SOLUTION.find((solution) => solution.solutionCode === info.getValue())
                        ?.solutionName || ""}
                </span>
            ),
        }),
        columnHelper.accessor("title", {
            header: "제목",
            cell: (info) => (
                <span className="max-w-[680px] whitespace-nowrap overflow-hidden text-ellipsis block">
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor("update_dt", {
            header: "작성일",
            cell: (info) => truncate(info.getValue(), 11),
        }),
    ];

    const table = useReactTable({
        data: ivFaqLists,
        columns: columns,
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
        setKind("AUTO7");
        if (currentPage !== 1) {
            setCurrentPage(1);
            return;
        }
        setResetTrigger((prev) => !prev);
        refetch();
    }, [keywordInput, currentPage, refetch]);

    const createClick = useCallback((): void => {
        router.push("/homePage/ivFaq/Create");
        saveStateToSessionStorage({
            ivFaq: { keyword: keywordInput.value, kind, page: currentPage },
        });
    }, [router, keywordInput.value, kind, currentPage]);

    const listItemClick = useCallback(
        (serial: string): void => {
            router.push(`/homePage/ivFaq/Edit/${serial}`);
            saveStateToSessionStorage({
                ivFaq: { keyword: keywordInput.value, kind, page: currentPage },
            });
        },
        [router, keywordInput.value, kind, currentPage]
    );

    const pageChange = useCallback((pageIndex: number): void => {
        setCurrentPage(pageIndex + 1);
    }, []);

    const handleKindChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>): void => {
            const newKind = e.target.value;
            if (newKind !== kind) {
                setKind(newKind);
                if (currentPage !== 1) {
                    setCurrentPage(1);
                }
            }
        },
        [kind, currentPage]
    );

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
            if (listState?.ivFaq) {
                keywordInput.setValue(listState.ivFaq.keyword);
                setKind(listState.ivFaq.kind);
                setCurrentPage(listState.ivFaq.page);
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
                    <h2 className="pl-4 font-semibold text-2xl py-4 md:py-8">IV 자주하는 질문</h2>
                    <SearchSection
                        keywordRef={keywordRef}
                        keywordValue={keywordInput.value}
                        kindValue={kind}
                        onKeywordChange={keywordInput.onChange}
                        onKindChange={handleKindChange}
                        onKeyPress={enterKeyPress}
                        onSearch={searchClick}
                        onReset={initClick}
                        loading={isLoading}
                    />
                    <div className="pt-5 pl-4 md:pt-5 md:pl-4">
                        <button
                            onClick={createClick}
                            className="w-[115px] h-10 bg-[#77829B] text-[#FFFFFF] rounded-[5px] text-[14px] md:w-[115px] md:h-10 cursor-pointer"
                        >
                            작성하기
                        </button>
                    </div>
                    <div className="mt-2 md:mt-4">
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
                                                                header.id === "RowNumber"
                                                                    ? "10%"
                                                                    : header.id === "kind"
                                                                    ? "10%"
                                                                    : header.id === "title"
                                                                    ? "60%"
                                                                    : "20%",
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
                                                <td colSpan={4}>
                                                    <ListItemLoader />
                                                </td>
                                            </tr>
                                        ) : table.getRowModel().rows.length > 0 ? (
                                            table.getRowModel().rows.map((row) => (
                                                <tr
                                                    key={row.id}
                                                    onClick={() =>
                                                        listItemClick(row.original.serial)
                                                    }
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
                                                <td colSpan={4} className="p-4 text-center">
                                                    결과가 없습니다.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="md:hidden">
                            {isLoading ? (
                                <MobileListItemLoader />
                            ) : table.getRowModel().rows.length > 0 ? (
                                <div>
                                    {table.getRowModel().rows.map((row) => (
                                        <div
                                            key={row.id}
                                            onClick={() => listItemClick(row.original.serial)}
                                            className="border border-[#E1E1E1] rounded-[5px] mb-2 p-4 cursor-pointer hover:bg-slate-100"
                                        >
                                            <div className="text-[#0340E6] font-semibold">
                                                {row.original.RowNumber}
                                            </div>
                                            <div className="pt-1 font-semibold text-ellipsis">
                                                {row.original.title}
                                            </div>
                                            <div className="pt-1 flex justify-between">
                                                <div className="pt-1">
                                                    {SOLUTION.find(
                                                        (solution) =>
                                                            solution.solutionCode ===
                                                            row.original.kind
                                                    )?.solutionName || ""}
                                                </div>
                                                <div className="pt-1">
                                                    {truncate(row.original.update_dt, 11)}
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
