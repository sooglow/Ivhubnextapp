// components/SearchSection.tsx
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

// 검색 버튼 컴포넌트
interface SearchButtonsProps {
    onSearch: () => void;
    onReset: () => void;
    loading: boolean;
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
                            ref={keywordRef}
                            className="w-[100%] appearance-none h-12 pl-4 text-sm focus:outline-none border border-[#E1E1E1] rounded-md"
                            placeholder="제목"
                            value={keywordValue}
                            onChange={onKeywordChange}
                            onKeyDown={onKeyPress}
                            disabled={loading}
                        />
                    </div>
                    <SearchButtons onSearch={onSearch} onReset={onReset} loading={loading} />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[88px] bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[140px] hidden md:flex items-center">
            <div className="flex pl-6 text-[14px]">
                <div className="flex items-baseline">
                    <label className="font-semibold hidden md:block">검색</label>
                    <input
                        ref={keywordRef}
                        className="w-[100%] h-12 pl-6 text-sm focus:outline-none border border-[#E1E1E1] rounded-md md:w-[420px] md:ml-12 md:pl-4 md:h-12"
                        placeholder="제목"
                        value={keywordValue}
                        onChange={onKeywordChange}
                        onKeyDown={onKeyPress}
                        disabled={loading}
                    />
                </div>
                <div className="flex justify-between pl-2">
                    <SearchButtons onSearch={onSearch} onReset={onReset} loading={loading} />
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
