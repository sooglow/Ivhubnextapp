"use client";

import ListItemLoader from "@/app/info/info/components/ListItemLoader";
import MobileListItemLoader from "@/app/info/info/components/MobileListItemLoader";
import SearchSection from "@/app/info/info/components/SearchSection";
import { useSolutionInfoList } from "@/app/info/solutionInfo/hooks/useSolutionInfoList";
import { SolutionInfoItem } from "@/app/info/solutionInfo/types/List";
import Pagination from "@/public/components/Pagination";
import { useAlert } from "@/public/hooks/useAlert";
import { useInput } from "@/public/hooks/useInput";
import { parseJWT, saveStateToSessionStorage, truncate } from "@/public/utils/utils";
import { JWTPayload } from "@/public/types/user";
import PreViewUrl from "@/app/info/solutionInfo/components/PreViewUrl";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

export default function SolutionInfoList(): React.ReactElement {
  const PAGE_SIZE = 10;
  const ADMIN_DEPT_CODE = "03";
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<JWTPayload>({} as JWTPayload);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [, setResetTrigger] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [preViewUrl, setPreViewUrl] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const keywordInput = useInput("", (value: string) => value.length <= 50);
  const keywordRef = useRef<HTMLInputElement>(null);

  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useSolutionInfoList({
    keyword: keywordInput.value,
    currentPage,
    pageSize: PAGE_SIZE,
    enabled: isMounted,
  });

  const solutionLists = queryData?.data?.items || [];
  const totalCount = queryData?.data?.totalCount || 0;

  const validateKeyword = useAlert([
    {
      test: () => keywordInput.value.length === 0 || keywordInput.value.length >= 2,
      message: "검색어는 2자 이상 입력해 주세요.",
      ref: keywordRef,
    },
  ]);

  // Tanstack Table 컬럼 정의
  const columnHelper = createColumnHelper<SolutionInfoItem>();

  const columns = [
    columnHelper.accessor("RowNumber", {
      header: "번호",
      cell: (info) => <span className="text-[#0340E6] font-bold">{info.getValue()}</span>,
    }),
    columnHelper.accessor((row) => row, {
      id: "period",
      header: "기간",
      cell: (info) => {
        const row = info.getValue();
        return (
          <span>
            {truncate(row.sday, 12)} ~ {truncate(row.eday, 12)}
          </span>
        );
      },
    }),
    columnHelper.accessor("subject", {
      header: "제목",
      cell: (info) => (
        <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("memo", {
      header: "선별공지",
      cell: (info) => info.getValue() || "",
    }),
    columnHelper.accessor("solution", {
      header: "솔루션",
      cell: (info) => info.getValue() || "",
    }),
    columnHelper.accessor("statename", {
      header: "상태",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("preViewUrl", {
      header: "미리보기",
      cell: (info) => (
        <div className="text-center">
          <i
            className="fa-solid fa-magnifying-glass cursor-pointer hover:text-[#A50A2E]"
            onClick={(e) => iconClick(e, info.getValue())}
          />
        </div>
      ),
    }),
  ];

  // Tanstack Table 생성
  const table = useReactTable({
    data: solutionLists,
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
    router.push("/info/solutionInfo/Create");
    saveStateToSessionStorage({
      solutionInfo: { keyword: keywordInput.value, page: currentPage },
    });
  }, [router, keywordInput.value, currentPage]);

  const listItemClick = useCallback(
    (item: SolutionInfoItem): void => {
      if (userInfo.deptCode === ADMIN_DEPT_CODE) {
        router.push(`/info/solutionInfo/Edit/${item.num}`);
      } else {
        if (item.preViewUrl) {
          setPreViewUrl(item.preViewUrl);
          setOpen(true);
        }
      }
    },
    [router, userInfo.deptCode]
  );

  const iconClick = useCallback((e: React.MouseEvent, previewUrl: string): void => {
    e.stopPropagation();
    setPreViewUrl(previewUrl);
    setOpen(true);
  }, []);

  const pageChange = useCallback((pageIndex: number): void => {
    setCurrentPage(pageIndex + 1);
    setPreViewUrl("");
  }, []);

  const isAdmin = userInfo.deptCode === ADMIN_DEPT_CODE;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // 에러 처리
  useEffect(() => {
    if (error) {
      console.error("API Error:", error);
      alert("데이터를 불러오는 중 오류가 발생했습니다.");
    }
  }, [error]);

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
      if (listState?.solutionInfo) {
        keywordInput.setValue(listState.solutionInfo.keyword);
        setCurrentPage(listState.solutionInfo.page);
        sessionStorage.removeItem("listState");
      } else {
        setCurrentPage(1);
      }
      setIsMounted(true);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="w-full flex-grow">
        <div className="max-w-6xl mx-auto pb-20">
          <h2 className="pl-4 font-semibold text-2xl md:py-8 py-4">솔루션 공지사항</h2>

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
                className="w-[115px] h-10 bg-[#77829B] text-[#FFFFFF] rounded-[5px] text-[14px] md:w-[115px] md:h-10 cursor-pointer"
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
                      <tr key={headerGroup.id} className="bg-[#F9FBFC] text-[14px]">
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className={`p-4 ${
                              header.id === "preViewUrl" ? "text-center" : "text-left"
                            }`}
                            style={{
                              width:
                                header.id === "RowNumber"
                                  ? "8%"
                                  : header.id === "period"
                                  ? "25%"
                                  : header.id === "subject"
                                  ? "25%"
                                  : header.id === "memo"
                                  ? "12%"
                                  : header.id === "solution"
                                  ? "10%"
                                  : header.id === "statename"
                                  ? "10%"
                                  : "10%",
                            }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
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
                          onClick={() => listItemClick(row.original)}
                          className="hover:bg-slate-100 cursor-pointer transition-all"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="p-4 border-t border-[#E1E1E1]">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
              ) : solutionLists.length > 0 ? (
                <div>
                  {solutionLists.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => listItemClick(item)}
                      className="border rounded-[5px] mb-2 cursor-pointer hover:bg-slate-100 p-4"
                    >
                      <div className="flex justify-between text-[#0340E6] font-semibold">
                        {item.RowNumber}
                      </div>
                      <div className="pt-1 font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.subject}
                      </div>
                      <div className="pt-4 flex justify-between">
                        <div className="pt-1">
                          {truncate(item.sday, 12)} ~ {truncate(item.eday, 12)}
                        </div>
                        <div>{item.solution || ""}</div>
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
              currentPage={table.getState().pagination.pageIndex}
              totalPages={totalPages}
              onPageChange={pageChange}
              canPreviousPage={table.getCanPreviousPage()}
              canNextPage={table.getCanNextPage()}
            />
          </div>

          {/* 미리보기 모달 */}
          <PreViewUrl preViewUrl={preViewUrl} open={open} setOpen={setOpen} />
        </div>
      </main>
    </div>
  );
}
