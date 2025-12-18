import React from "react";

interface SearchSectionProps {
    keywordValue: string;
    onKeywordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    saleDay1: string;
    saleDay2: string;
    onSaleDay1Change: (value: string) => void;
    onSaleDay2Change: (value: string) => void;
    onSearch: () => void;
    onReset: () => void;
    loading?: boolean;
}

export default function SearchSection({
    keywordValue,
    onKeywordChange,
    onKeyPress,
    saleDay1,
    saleDay2,
    onSaleDay1Change,
    onSaleDay2Change,
    onSearch,
    onReset,
    loading = false,
}: SearchSectionProps) {
    return (
        <div className="w-full h-[150px] bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[168px] flex items-center">
            {/* 데스크톱 검색탭 */}
            <div className="pl-6 text-[14px] hidden md:block">
                <div className="flex items-baseline text-[14px]">
                    <label className="font-semibold hidden md:block">조회기간</label>
                    <input
                        type="date"
                        className="md:w-[300px] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 ml-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                        value={saleDay1}
                        onChange={(e) => onSaleDay1Change(e.target.value)}
                        disabled={loading}
                    />
                    <input
                        type="date"
                        className="md:w-[300px] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm ml-4"
                        value={saleDay2}
                        onChange={(e) => onSaleDay2Change(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="w-[90%] pt-2 flex">
                    <div className="flex items-baseline">
                        <label className="md:pb-3 pt-2 text-[14px] font-semibold hidden md:block">
                            검색
                        </label>
                        <input
                            className="w-[100%] hidden h-12 pl-6 md:ml-[38px] text-sm focus:outline-none border border-[#E1E1E1] rounded-md md:w-[300px] md:pl-4 md:h-12 md:block bg-white disabled:bg-[#F9FBFC]"
                            placeholder="업체명,업체코드"
                            value={keywordValue}
                            onChange={onKeywordChange}
                            onKeyDown={onKeyPress}
                            disabled={loading}
                        />
                    </div>
                    <div className="flex pl-2">
                        <button
                            onClick={onSearch}
                            className="w-[48px] h-12 bg-[#A50A2E] rounded-[5px] hidden md:w-[48px] md:h-12 md:block"
                            disabled={loading}
                        >
                            <img className="mx-auto" src="/images/icon_search.png" alt="검색" />
                        </button>
                        <button
                            onClick={onReset}
                            className="w-[48px] border border-[#E1E1E1] ml-1 bg-white rounded-[5px] hidden md:block md:w-[48px] md:h-12"
                            disabled={loading}
                        >
                            <img className="mx-auto" src="/images/icon_refresh.png" alt="초기화" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 모바일 검색탭 */}
            <div className="w-full h-[120px] bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[140px] flex md:hidden items-center">
                <div className="w-full md:hidden text-[14px]">
                    <div className="flex justify-between w-full px-4">
                        {/* 시작 날짜 */}
                        <div className="flex-1 mr-2">
                            <input
                                type="date"
                                className="w-full bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none text-sm"
                                value={saleDay1}
                                onChange={(e) => onSaleDay1Change(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        {/* 종료 날짜 */}
                        <div className="flex-1 ml-2">
                            <input
                                type="date"
                                className="w-full bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none text-sm"
                                value={saleDay2}
                                onChange={(e) => onSaleDay2Change(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="w-[100%] flex justify-between px-4 pt-4">
                        <div className="w-[100%]">
                            <input
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
                                className="w-[48px] h-12 bg-[#A50A2E] rounded-[5px] ml-2"
                                disabled={loading}
                            >
                                <img className="mx-auto" src="/images/icon_search.png" alt="검색" />
                            </button>
                            <button
                                onClick={onReset}
                                className="w-[48px] h-12 border border-[#E1E1E1] bg-white rounded-[5px] ml-1"
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
                </div>
            </div>
        </div>
    );
}
