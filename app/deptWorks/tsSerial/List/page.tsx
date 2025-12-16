"use client";

import { useState, useEffect, useRef } from "react";
import { useTsSerialList, useTsSerialCreate } from "../hooks/useTsSerial";
import { useInput } from "@/public/hooks/useInput";
import { useAlert } from "@/public/hooks/useAlert";
import ListItemLoader from "../components/ListItemLoader";
import MobileListItemLoader from "../components/MobileListItemLoader";
import UpdateTsSerialList from "../components/UpdateTsSerialList";

export default function TsSerialList() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [windowWidth, setWindowWidth] = useState(0);
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

    const lists = queryData?.data || [];

    // 검색 버튼
    const searchClick = () => {
        if (validateKeyword()) {
            setSearchKeyword(keywordInput.value);
            refetch();
        }
    };

    //엔터후 검색
    const KeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            searchClick();
        }
    };

    // 초기화 버튼
    const initClick = () => {
        keywordInput.setValue("");
        setSearchKeyword("");
        refetch();
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
    const listItemClick = (listItem: any) => {
        setOpen(true);
        setList(listItem);
    };

    useEffect(() => {
        const listState = JSON.parse(sessionStorage.getItem("listState") || "{}")?.tsSerial;
        // 상태유지를 위한 로직
        if (listState) {
            keywordInput.setValue(listState.keyword);
            setSearchKeyword(listState.keyword);
            // 상태유지 값 사용 후 삭제
            sessionStorage.removeItem("listState");
        }

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto pb-20">
                    <h2 className="pl-4 font-semibold text-2xl py-4 md:py-8">국토부 시리얼 관리</h2>

                    <div className="w-full h-[100px] bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[140px] md:flex items-center hidden">
                        <div className="flex pl-4 md:pl-6 text-[14px] ">
                            <div className="w-full flex items-baseline ">
                                <label className="font-semibold hidden md:block">검색</label>
                                <input
                                    ref={keywordRef}
                                    className="w-[236px] h-12 pl-4 md:pl-6 text-sm focus:outline-none border border-[#E1E1E1] rounded-md md:w-[328px] md:ml-12  md:h-12"
                                    placeholder="업체명"
                                    value={keywordInput.value}
                                    onChange={keywordInput.onChange}
                                    onKeyDown={KeyPress}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex pl-2">
                                <button
                                    onClick={searchClick}
                                    className="w-[48px] h-12 bg-[#A50A2E] rounded-[5px] md:w-[48px] md:h-12 "
                                    disabled={isLoading}
                                >
                                    <img
                                        className="mx-auto"
                                        src={"/img/icon_search.png"}
                                        alt="검색"
                                    />
                                </button>
                                <button
                                    onClick={initClick}
                                    className="w-[48px] border bg-white rounded-[5px] md:w-[48px] md:h-12 ml-1"
                                    disabled={isLoading}
                                >
                                    <img
                                        className="mx-auto"
                                        src={"/img/icon_refresh.png"}
                                        alt="초기화"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 모바일 검색탭 */}
                    <div className="w-full h-[88px]  bg-[#F9FBFC] rounded-[5px] flex items-center md:hidden ">
                        <div className="w-[100%] flex justify-between px-4">
                            <div className="w-[100%]">
                                <input
                                    className="w-[100%] appearance-none h-12 pl-4 text-sm focus:outline-none border border-[#E1E1E1] rounded-md "
                                    placeholder="제목"
                                    value={keywordInput.value}
                                    onChange={keywordInput.onChange}
                                    onKeyDown={KeyPress}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    onClick={searchClick}
                                    className="w-[48px] h-12 bg-[#A50A2E] rounded-[5px] ml-2"
                                    disabled={isLoading}
                                >
                                    <img
                                        className="mx-auto"
                                        src={"/img/icon_search.png"}
                                        alt="검색"
                                    />
                                </button>
                                <button
                                    onClick={initClick}
                                    className="w-[48px] h-12 border bg-white rounded-[5px] ml-1"
                                    disabled={isLoading}
                                >
                                    <img
                                        className="mx-auto"
                                        src={"/img/icon_refresh.png"}
                                        alt="초기화"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="pt-3 pl-4 md:pt-5 md:pl-4 ">
                        <button
                            onClick={createClick}
                            className="w-[115px] h-10 bg-[#77829B] text-[#FFFFFF] rounded-[5px] text-[14px] md:w-[115px] md:h-10"
                        >
                            추가생성
                        </button>
                    </div>
                    <div>
                        <table className="md:mt-4 table-auto w-full border-separate border-spacing-[14px] rounded md:border-spacing-0 md:border-[#E1E1E1] md:rounded-[5px] md:border ">
                            <thead className="hidden md:border md:border-separate md:rounded-l-sm md:rounded-r-sm md:table-header-group bg-[#F9FBFC] text-[14px]">
                                <tr className="bg-[#F9FBFC] text-[14px] w-full">
                                    <th className="w-[10%] p-4 text-left whitespace-nowrap ">
                                        업체코드
                                    </th>
                                    <th className="w-[30%] p-4  text-left ">업체명</th>
                                    <th className="w-[25%] p-4 text-left ">사업자등록번호</th>
                                    <th className="w-[15%] p-4 text-left ">담당자</th>
                                    <th className="w-[10%] p-4 text-left">구분</th>
                                    <th className="w-[10%] p-4 text-left">발급일자</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading === true ? (
                                    <tr>
                                        <td colSpan={6}>
                                            {windowWidth >= 768 ? (
                                                <ListItemLoader />
                                            ) : (
                                                <MobileListItemLoader />
                                            )}
                                        </td>
                                    </tr>
                                ) : lists.length > 0 ? (
                                    lists.map((listItem, idx) => {
                                        return (
                                            <tr
                                                key={idx}
                                                onClick={() => listItemClick(listItem)}
                                                className="hover:bg-slate-100 cursor-pointer  transition-all "
                                            >
                                                <td className="p-4 whitespace-nowrap text-[#0340E6] font-bold hidden md:border-t last:rounded-bl-md md:table-cell">
                                                    {listItem.comSerial ?? ""}
                                                </td>
                                                <td className="p-4 text-left hidden md:border-t md:table-cell whitespace-nowrap">
                                                    {listItem.name ?? ""}
                                                </td>
                                                <td className="p-4 text-left hidden md:border-t md:table-cell whitespace-nowrap">
                                                    {listItem.idNo ?? ""}
                                                </td>
                                                <td className="p-4 text-left hidden md:border-t md:table-cell whitespace-nowrap">
                                                    {listItem.manName ?? ""}
                                                </td>
                                                <td className="p-4 text-left hidden md:border-t md:table-cell whitespace-nowrap">
                                                    {listItem.areaName ?? ""}
                                                </td>
                                                <td className="p-4 text-left hidden md:border-t md:table-cell whitespace-nowrap">
                                                    {truncate(listItem.intDay, 10)}
                                                </td>

                                                {/* 모바일 */}
                                                <td
                                                    colSpan={7}
                                                    className="p-4 border rounded-[5px] md:hidden"
                                                >
                                                    <div className="text-[#0340E6] font-semibold flex justify-between">
                                                        {listItem.comSerial ?? ""}
                                                        <div className=" font-semibold text-black text-ellipsis">
                                                            {truncate(listItem.intDay, 10)}
                                                        </div>
                                                    </div>
                                                    <div className="pt-1 flex justify-between">
                                                        <div className="pt-1">
                                                            {listItem.name ?? ""}
                                                        </div>
                                                        {listItem.areaName ? (
                                                            <div className="pt-1 text-center ">
                                                                {listItem.areaName === "본사" ? (
                                                                    <div className="w-[75px] h-[28px] pt-[2px] bg-[#FFECF1] rounded-[5px]">
                                                                        {listItem.areaName}
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-[75px] h-[28px] pt-[2px] bg-[#E5F3FF] rounded-[5px]">
                                                                        {listItem.areaName}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="pl-2 pt-2 text-[16px]">
                                            결과가없습니다
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <UpdateTsSerialList list={list} open={open} setOpen={setOpen} />
                    </div>
                </div>
            </main>
        </div>
    );
}
