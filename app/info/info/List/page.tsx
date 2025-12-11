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
import { useAppContext } from "@/public/contexts/Context";
import { parseJWT, saveStateToSessionStorage, truncate } from "@/public/utils/utils";
import ListItemLoader from "@/app/info/info/components/ListItemLoader";
import MobileListItemLoader from "@/app/info/info/components/MobileListItemLoader";
import Pagination from "@/public/components/Pagination";
import { UserInfo } from "@/app/info/info/types/Create";
import SearchSection from "@/app/info/info/components/SearchSection";
import { InfoItem } from "@/app/info/info/types/List";
import { useInfoList } from "@/app/info/info/hooks/useInfoList";

export default function InfoList(): React.ReactElement {
    const PAGE_SIZE = 10;
    const ADMIN_DEPT_CODE = "03";
    const router = useRouter();
    const { setCurrentInfoSerial } = useAppContext();

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
    } = useInfoList({
        keyword: keywordInput.value,
        currentPage,
        pageSize: PAGE_SIZE,
        userid: userInfo.userId || "",
        areacode: userInfo.areaCode || "",
        enabled: !!userInfo.userId,
    });

    // 데이터 추출
    const infoLists = queryData?.data?.items || [];
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
    const columnHelper = createColumnHelper<InfoItem>();

    const columns = [
        columnHelper.accessor("RowNumber", {
            header: "번호",
            cell: (info) => <span className="text-[#0340E6] font-bold">{info.getValue()}</span>,
        }),
        columnHelper.accessor("subject", {
            header: "제목",
            cell: (info) => (
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
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
                        <div className="flex justify-between text-[#0340E6] font-semibold">
                            {row.RowNumber}
                        </div>
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
        data: infoLists,
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
            refetch(); // 수동 refetch
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
        refetch(); // 수동 refetch
    }, [keywordInput, currentPage, refetch]);

    const createClick = useCallback((): void => {
        router.push("/info/info/Create");
        saveStateToSessionStorage({
            info: { keyword: keywordInput.value, page: currentPage },
        });
    }, [router, keywordInput.value, currentPage]);

    const listItemClick = useCallback(
        (serial: string): void => {
            // URL에 serial 포함해서 이동
            router.push(`/info/info/View/${serial}`);
            saveStateToSessionStorage({
                info: { keyword: keywordInput.value, page: currentPage },
            });
        },
        [router, keywordInput.value, currentPage]
    );

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
            if (listState?.info) {
                console.log(listState.info);
                keywordInput.setValue(listState.info.keyword);
                setCurrentPage(listState.info.page);
                sessionStorage.removeItem("listState");
            } else {
                setCurrentPage(1);
            }
        }
    }, []);

    const isAdmin = userInfo.deptCode === ADMIN_DEPT_CODE;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto pb-20">
                    <h2 className="pl-4 font-semibold text-2xl md:py-8 py-4">공지사항</h2>

                    {/* 검색탭 */}
                    <SearchSection
                        keywordRef={keywordRef}
                        keywordValue={keywordInput.value}
                        onKeywordChange={keywordInput.onChange}
                        onKeyPress={enterKeyPress}
                        onSearch={searchClick}
                        onReset={initClick}
                        loading={isLoading} // React Query의 isLoading 사용
                        isMobile={isMobile}
                    />

                    {isAdmin && (
                        <div className="pt-5 pl-4 md:pt-5 md:pl-4">
                            <button
                                onClick={createClick}
                                className="w-[115px] h-10 bg-[#77829B] text-[#FFFFFF] rounded-[5px] text-[14px] md:w-[115px] md:h-10"
                            >
                                작성하기
                            </button>
                        </div>
                    )}

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
                                                                header.id === "rowNumber"
                                                                    ? "10%"
                                                                    : header.id === "subject"
                                                                    ? "45%"
                                                                    : header.id === "writer"
                                                                    ? "15%"
                                                                    : header.id === "wdate"
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
                                                <td colSpan={5}>
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
                                                <td colSpan={5} className="p-4 text-center">
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
                                            className="border rounded-[5px] mb-2 cursor-pointer hover:bg-slate-100"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <div key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4">결과가 없습니다.</div>
                            )}
                        </div>
                    </div>

                    {/* 페이지네이션 */}
                    <Pagination
                        currentPage={table.getState().pagination.pageIndex}
                        totalPages={totalPages}
                        onPageChange={pageChange}
                        canPreviousPage={table.getCanPreviousPage()}
                        canNextPage={table.getCanNextPage()}
                    />
                </div>
            </main>
        </div>
    );
}
