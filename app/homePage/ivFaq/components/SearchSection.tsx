import React from "react";
import { SOLUTION } from "@/public/constants/solution";

interface SearchSectionProps {
    keywordRef: React.RefObject<HTMLInputElement | null>;
    keywordValue: string;
    kindValue: string;
    onKeywordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKindChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onSearch: () => void;
    onReset: () => void;
    loading: boolean;
}

export default function SearchSection({
    keywordRef,
    keywordValue,
    kindValue,
    onKeywordChange,
    onKindChange,
    onKeyPress,
    onSearch,
    onReset,
    loading,
}: SearchSectionProps) {
    return (
        <>
            {/* 데스크톱 검색탭 */}
            <div className="w-full h-[88px] bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[140px] hidden md:flex items-center">
                <div className="flex pl-6 text-[14px]">
                    <div className="flex items-baseline">
                        <label className="font-semibold hidden md:block">검색</label>
                        <input
                            ref={keywordRef}
                            className="w-[100%] h-12 pl-6 text-sm focus:outline-none border border-[#E1E1E1] rounded-md md:w-[420px] md:ml-12 md:pl-4 md:h-12 bg-white disabled:bg-[#F9FBFC]"
                            placeholder="제목"
                            value={keywordValue}
                            onChange={onKeywordChange}
                            onKeyDown={onKeyPress}
                            disabled={loading}
                        />
                    </div>
                    <div className="flex justify-between pl-2">
                        <button
                            onClick={onSearch}
                            className="w-[48px] h-12 bg-[#A50A2E] rounded-[5px] cursor-pointer"
                            disabled={loading}
                        >
                            <img className="mx-auto" src="/images/icon_search.png" alt="검색" />
                        </button>
                        <button
                            onClick={onReset}
                            className="w-[48px] border border-[#E1E1E1] bg-white rounded-[5px] h-12 ml-1 cursor-pointer"
                            disabled={loading}
                        >
                            <img className="mx-auto" src="/images/icon_refresh.png" alt="초기화" />
                        </button>
                        <select
                            value={kindValue}
                            onChange={onKindChange}
                            className="ml-2 pl-3 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[150px] md:h-12 md:bg-white"
                            disabled={loading}
                        >
                            {SOLUTION.map((item) => (
                                <option key={item.solutionCode} value={item.solutionCode}>
                                    {item.solutionName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* 모바일 검색탭 */}
            <div className="w-full h-[120px] bg-[#F9FBFC] rounded-[5px] flex items-center md:hidden">
                <div className="w-[100%] px-4">
                    <div className="flex">
                        <div className="w-[100%]">
                            <input
                                ref={keywordRef}
                                className="w-[100%] appearance-none h-12 pl-4 text-sm focus:outline-none border border-[#E1E1E1] rounded-md bg-white disabled:bg-[#F9FBFC]"
                                placeholder="제목"
                                value={keywordValue}
                                onChange={onKeywordChange}
                                onKeyDown={onKeyPress}
                                disabled={loading}
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={onSearch}
                                className="w-[48px] h-12 bg-[#A50A2E] rounded-[5px] ml-2 cursor-pointer"
                                disabled={loading}
                            >
                                <img className="mx-auto" src="/images/icon_search.png" alt="검색" />
                            </button>
                            <button
                                onClick={onReset}
                                className="w-[48px] h-12 border border-[#E1E1E1] bg-white rounded-[5px] ml-1 cursor-pointer"
                                disabled={loading}
                            >
                                <img className="mx-auto" src="/images/icon_refresh.png" alt="초기화" />
                            </button>
                        </div>
                    </div>
                    <div className="mt-2">
                        <select
                            value={kindValue}
                            onChange={onKindChange}
                            className="w-[40%] block h-12 pl-4 border border-[#E1E1E1] bg-white rounded-md appearance-none select_shop focus:outline-none"
                            disabled={loading}
                        >
                            {SOLUTION.map((item) => (
                                <option key={item.solutionCode} value={item.solutionCode}>
                                    {item.solutionName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
}
