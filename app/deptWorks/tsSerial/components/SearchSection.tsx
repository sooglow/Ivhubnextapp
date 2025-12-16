import React from "react";

interface SearchSectionProps {
    keywordRef: React.RefObject<HTMLInputElement | null>;
    keywordValue: string;
    onKeywordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onSearch: () => void;
    onReset: () => void;
    loading: boolean;
    isMobile: boolean;
}

export default function SearchSection({
    keywordRef,
    keywordValue,
    onKeywordChange,
    onKeyPress,
    onSearch,
    onReset,
    loading,
    isMobile,
}: SearchSectionProps) {
    if (isMobile) {
        return (
            <div className="w-full h-[88px] bg-[#F9FBFC] rounded-[5px] flex items-center md:hidden">
                <div className="w-[100%] flex justify-between px-4">
                    <div className="w-[100%]">
                        <input
                            className="w-[100%] appearance-none h-12 pl-4 text-sm focus:outline-none border border-[#E1E1E1] rounded-md bg-white disabled:bg-[#F9FBFC]"
                            placeholder="업체명"
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
            </div>
        );
    }

    return (
        <div className="w-full h-[100px] bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[140px] md:flex items-center hidden">
            <div className="flex pl-4 md:pl-6 text-[14px]">
                <div className="w-full flex items-baseline">
                    <label className="font-semibold hidden md:block">검색</label>
                    <input
                        ref={keywordRef}
                        className="w-[236px] h-12 pl-4 md:pl-6 text-sm focus:outline-none border border-[#E1E1E1] rounded-md md:w-[328px] md:ml-12 md:h-12 bg-white disabled:bg-[#F9FBFC]"
                        placeholder="업체명"
                        value={keywordValue}
                        onChange={onKeywordChange}
                        onKeyDown={onKeyPress}
                        disabled={loading}
                    />
                </div>
                <div className="flex pl-2">
                    <button
                        onClick={onSearch}
                        className="w-[48px] h-12 bg-[#A50A2E] rounded-[5px] md:w-[48px] md:h-12 cursor-pointer"
                        disabled={loading}
                    >
                        <img className="mx-auto" src="/images/icon_search.png" alt="검색" />
                    </button>
                    <button
                        onClick={onReset}
                        className="w-[48px] border border-[#E1E1E1] bg-white rounded-[5px] md:w-[48px] md:h-12 ml-1 cursor-pointer"
                        disabled={loading}
                    >
                        <img className="mx-auto" src="/images/icon_refresh.png" alt="초기화" />
                    </button>
                </div>
            </div>
        </div>
    );
}
