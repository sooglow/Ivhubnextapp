"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import { useTsSerialList, useTsSerialCreate } from "../hooks/useTsSerial";
import { useInput } from "@/public/hooks/useInput";
import { useAlert } from "@/public/hooks/useAlert";
import ListItemLoader from "../components/ListItemLoader";
import MobileListItemLoader from "../components/MobileListItemLoader";
import UpdateTsSerialList from "../components/UpdateTsSerialList";
import SearchSection from "../components/SearchSection";
import { TsSerialListItem } from "../types/List";

export default function TsSerialList() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [open, setOpen] = useState(false);
    const [list, setList] = useState<any>({});

    const keywordInput = useInput("", (value: string) => value.length <= 50);
    const keywordRef = useRef<HTMLInputElement>(null);

    const truncate = (str: string, maxLength: number) => {
        return str?.length > maxLength ? str.substring(0, maxLength) : str;
    };

    const validateKeyword = useAlert([
        {
            test: () => keywordInput.value.length > 1,
            message: "검색어는 2자 이상 입력해 주세요.",
            ref: keywordRef,
        },
    ]);

    const { data: queryData, isLoading, refetch } = useTsSerialList(searchKeyword);

    const createMutation = useTsSerialCreate();

    const tsSerialList = queryData?.data || [];

    // Tanstack Table 컬럼 정의
    const columnHelper = createColumnHelper<TsSerialListItem>();

    const columns = [
        columnHelper.accessor("comSerial", {
            header: "업체코드",
            cell: (info) => (
                <span className="text-[#0340E6] font-bold">{info.getValue() ?? ""}</span>
            ),
        }),
        columnHelper.accessor("name", {
            header: "업체명",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("idNo", {
            header: "사업자등록번호",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("manName", {
            header: "담당자",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("areaName", {
            header: "구분",
            cell: (info) => info.getValue() ?? "",
        }),
        columnHelper.accessor("intDay", {
            header: "발급일자",
            cell: (info) => truncate(info.getValue() ?? "", 10),
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
                            {row.comSerial ?? ""}
                            <div className="font-semibold text-black text-ellipsis">
                                {truncate(row.intDay ?? "", 10)}
                            </div>
                        </div>
                        <div className="pt-1 flex justify-between">
                            <div className="pt-1">{row.name ?? ""}</div>
                            {row.areaName ? (
                                <div className="pt-1 text-center ">
                                    {row.areaName === "본사" ? (
                                        <div className="w-[75px] h-[28px] pt-[2px] bg-[#FFECF1] rounded-[5px]">
                                            {row.areaName}
                                        </div>
                                    ) : (
                                        <div className="w-[75px] h-[28px] pt-[2px] bg-[#E5F3FF] rounded-[5px]">
                                            {row.areaName}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                );
            },
        }),
    ];

    // Tanstack Table 생성
    const table = useReactTable({
        data: tsSerialList,
        columns: isMobile ? mobileColumns : columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleSearch = useCallback(() => {
        if (!validateKeyword()) return;
        setSearchKeyword(keywordInput.value);
    }, [validateKeyword, keywordInput.value]);

    const handleReset = useCallback(() => {
        keywordInput.setValue("");
        setSearchKeyword("");
    }, [keywordInput]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // 작성 클릭
    const createClick = () => {
        if (window.confirm("생성하시겠습니까?")) {
            createMutation.mutate(undefined, {
                onSuccess: (data) => {
                    if (data.result) {
                        alert("생성되었습니다.");
                        refetch();
                    } else {
                        alert(data.errMsg || "생성에 실패했습니다.");
                    }
                },
                onError: (error) => {
                    alert("생성 중 오류가 발생했습니다: " + error.message);
                },
            });
        }
    };

    // 게시판 목록 선택
    const handleRowClick = useCallback((listItem: TsSerialListItem) => {
        setOpen(true);
        setList(listItem);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        const listState = JSON.parse(sessionStorage.getItem("listState") || "{}")?.tsSerial;
        if (listState) {
            keywordInput.setValue(listState.keyword);
            setSearchKeyword(listState.keyword);
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
                    <h2 className="pl-4 font-semibold text-2xl py-4 md:py-8">국토부 시리얼 관리</h2>

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
                    />
                    <div className="pt-3 pl-4 md:pt-5 md:pl-4 ">
                        <button
                            onClick={createClick}
                            className="w-[115px] h-10 bg-[#77829B] text-[#FFFFFF] rounded-[5px] text-[14px] md:w-[115px] md:h-10"
                        >
                            추가생성
                        </button>
                    </div>

                    <table className="mt-2 md:mt-4 table-auto w-full border-separate border-spacing-[14px] rounded md:border-spacing-0 md:border-[#E1E1E1] md:rounded-[5px] md:border ">
                        <thead className="hidden md:border md:border-separate md:rounded-l-sm md:rounded-r-sm md:table-header-group">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="bg-[#F9FBFC] text-[14px]">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="p-4 text-left whitespace-nowrap"
                                            style={{
                                                width:
                                                    header.id === "comSerial"
                                                        ? "10%"
                                                        : header.id === "name"
                                                        ? "30%"
                                                        : header.id === "idNo"
                                                        ? "25%"
                                                        : header.id === "manName"
                                                        ? "15%"
                                                        : header.id === "areaName"
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
                                    <td colSpan={6}>
                                        {isMobile ? <MobileListItemLoader /> : <ListItemLoader />}
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        onClick={() => handleRowClick(row.original)}
                                        className="hover:bg-slate-100 cursor-pointer transition-all"
                                    >
                                        {!isMobile ? (
                                            row.getVisibleCells().map((cell) => (
                                                <td
                                                    key={cell.id}
                                                    className={`p-4 hidden md:border-t md:border-[#E1E1E1] md:table-cell ${
                                                        cell.column.id === "comSerial"
                                                            ? "whitespace-nowrap"
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
                                                className="p-4 border border-[#E1E1E1] rounded-[5px] md:hidden"
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
                    <UpdateTsSerialList list={list} open={open} setOpen={setOpen} />
                </div>
            </main>
        </div>
    );
}
