// components/SearchSection.tsx
import React from "react";
import { SearchSectionProps, SearchButtonsProps } from "@/app/shop/types/View";

export default function SearchSection({
    keywordRef,
    keywordValue,
    onKeywordChange,
    onKeyPress,
    onSearch,
    onReset,
    loading,
    isMobile,
    prgCode,
    onPrgCodeChange,
    prgItems,
    areaCode,
    onAreaCodeChange,
    areaItems,
    showAreaFilter,
}: SearchSectionProps) {
    if (isMobile) {
        return (
            <div className="w-full h-[108px] bg-[#F9FBFC] rounded-[5px] flex items-center md:hidden">
                <div className="w-full flex flex-col px-4 gap-2">
                    <div className="w-full flex justify-between">
                        <div className="flex-1">
                            <input
                                ref={keywordRef}
                                className="w-full appearance-none h-10 pl-4 text-sm focus:outline-none border border-[#E1E1E1] rounded-md transition-colors duration-300 bg-white disabled:bg-[#F9FBFC]"
                                placeholder="업체코드, 업체명, 사업자등록번호"
                                value={keywordValue}
                                onChange={onKeywordChange}
                                onKeyDown={onKeyPress}
                                disabled={loading}
                            />
                        </div>
                        <div className="flex ml-2">
                            <button
                                onClick={onSearch}
                                className="w-[40px] h-10 bg-[#A50A2E] rounded-[5px] mr-1"
                                disabled={loading}
                            >
                                <img className="mx-auto" src="/images/icon_search.png" alt="검색" />
                            </button>
                            <button
                                onClick={onReset}
                                className="w-[40px] h-10 border bg-white rounded-[5px]"
                                disabled={loading}
                            >
                                <img
                                    className="mx-auto"
                                    src="/images/icon_refresh.png"
                                    alt="초기화"
                                />
                            </button>
                        </div>
                    </div>

                    <div className="w-full flex">
                        <select
                            value={prgCode}
                            onChange={onPrgCodeChange}
                            className="w-[50%] h-10 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none text-sm transition-colors duration-300 bg-white disabled:bg-[#F9FBFC]"
                            disabled={loading}
                        >
                            <option value="">프로그램</option>
                            {prgItems.map((item) => (
                                <option key={item.code} value={item.code}>
                                    {item.codename}
                                </option>
                            ))}
                        </select>
                        {showAreaFilter && (
                            <select
                                value={areaCode}
                                onChange={onAreaCodeChange}
                                className="w-[100px] h-10 ml-2 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none text-sm transition-colors duration-300 bg-white disabled:bg-[#F9FBFC]"
                                disabled={loading}
                            >
                                <option value="">지사</option>
                                {areaItems.map((item) => (
                                    <option key={item.code} value={item.code}>
                                        {item.codename}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[88px] bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[140px] hidden md:flex items-center">
            <div className="pl-6 text-[14px]">
                <div className="flex">
                    <div>
                        <label className="font-semibold">프로그램</label>
                        <select
                            value={prgCode}
                            onChange={onPrgCodeChange}
                            className="ml-3 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[300px] md:h-12 transition-colors duration-300 md:bg-white disabled:bg-[#F9FBFC]"
                            disabled={loading}
                        >
                            <option value="">전체</option>
                            {prgItems.map((item) => (
                                <option key={item.code} value={item.code}>
                                    {item.codename}
                                </option>
                            ))}
                        </select>
                    </div>
                    {showAreaFilter && (
                        <div className="pl-6">
                            <label className="text-[14px] font-semibold">지사</label>
                            <select
                                value={areaCode}
                                onChange={onAreaCodeChange}
                                className="w-[100px] h-12 ml-3 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none transition-colors duration-300 md:bg-white disabled:bg-[#F9FBFC]"
                                disabled={loading}
                            >
                                <option value="">전체</option>
                                {areaItems.map((item) => (
                                    <option key={item.code} value={item.code}>
                                        {item.codename}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="flex items-center pl-6">
                        <div className="flex items-baseline">
                            <label className="font-semibold hidden md:block">검색</label>
                            <input
                                ref={keywordRef}
                                className="w-[100%] h-12 pl-6 text-sm focus:outline-none border border-[#E1E1E1] rounded-md md:w-[328px] md:ml-3 md:pl-4 md:h-12 transition-colors duration-300 bg-white disabled:bg-[#F9FBFC]"
                                placeholder="업체코드, 업체명, 사업자등록번호"
                                value={keywordValue}
                                onChange={onKeywordChange}
                                onKeyDown={onKeyPress}
                                disabled={loading}
                            />
                        </div>
                        <div className="flex justify-between pl-2">
                            <SearchButtons
                                onSearch={onSearch}
                                onReset={onReset}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SearchButtons({ onSearch, onReset, loading }: SearchButtonsProps) {
    return (
        <>
            <button
                onClick={onSearch}
                className="w-[48px] h-12 bg-[#A50A2E] rounded-[5px] ml-2 md:ml-0 cursor-pointer"
                disabled={loading}
                aria-label="검색"
            >
                <img className="mx-auto" src="/images/icon_search.png" alt="검색" />
            </button>
            <button
                onClick={onReset}
                className="w-[48px] h-12 border border-[#E1E1E1] bg-white rounded-[5px] ml-1 cursor-pointer"
                disabled={loading}
                aria-label="초기화"
            >
                <img className="mx-auto" src="/images/icon_refresh.png" alt="초기화" />
            </button>
        </>
    );
}
