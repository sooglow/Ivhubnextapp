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
    prgCode: string;
    prgItems: any[];
    onPrgCodeChange: (prgCode: string) => void;
}

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
    prgCode,
    prgItems,
    onPrgCodeChange,
}: SearchSectionProps) {
    if (isMobile) {
        return (
            <div className="w-full h-[120px] bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[140px] flex md:hidden items-center">
                <div className="w-full md:hidden text-[14px] px-4">
                    <div className="flex">
                        <div className="w-[100%]">
                            <input
                                ref={keywordRef}
                                className="w-[100%] appearance-none block h-12 pl-4 text-sm focus:outline-none border border-[#E1E1E1] rounded-md"
                                placeholder="제목"
                                value={keywordValue}
                                onChange={onKeywordChange}
                                onKeyDown={onKeyPress}
                                disabled={loading}
                            />
                        </div>
                        <div className="flex justify-between">
                            <SearchButtons
                                onSearch={onSearch}
                                onReset={onReset}
                                loading={loading}
                            />
                        </div>
                    </div>
                    <div className="mt-2">
                        <select
                            value={prgCode}
                            onChange={(e) => onPrgCodeChange(e.target.value)}
                            className="w-[65%] block h-12 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none bg-white disabled:bg-[#F9FBFC]"
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
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[150px] bg-[#F9FBFC] rounded-[5px] md:w-full hidden md:h-[140px] md:flex items-center">
            <div className="flex pl-6 text-[14px]">
                <div className="flex items-baseline">
                    <label className="font-semibold hidden md:block">검색</label>
                    <input
                        ref={keywordRef}
                        className="w-[100%] hidden h-12 pl-6 text-sm focus:outline-none border border-[#E1E1E1] rounded-md md:w-[300px] md:ml-12 md:pl-4 md:h-12 md:block md:bg-white disabled:bg-[#F9FBFC]"
                        placeholder="제목, 작성자"
                        value={keywordValue}
                        onChange={onKeywordChange}
                        onKeyDown={onKeyPress}
                        disabled={loading}
                    />
                </div>
                <div className="flex justify-between pl-2">
                    <SearchButtons onSearch={onSearch} onReset={onReset} loading={loading} />
                </div>
                <select
                    value={prgCode}
                    onChange={(e) => onPrgCodeChange(e.target.value)}
                    className="hidden md:block h-12 pl-4 md:ml-6 md:pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[200px] md:h-12 md:bg-white disabled:bg-[#F9FBFC]"
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
        </div>
    );
}

function SearchButtons({ onSearch, onReset, loading }: SearchButtonsProps) {
    return (
        <>
            <button
                onClick={onSearch}
                className="w-[48px] h-12 bg-[#A50A2E] rounded-[5px] hidden md:w-[48px] md:h-12 md:block cursor-pointer"
                disabled={loading}
                aria-label="검색"
            >
                <img className="mx-auto" src="/images/icon_search.png" alt="검색" />
            </button>
            <button
                onClick={onReset}
                className="w-[48px] border border-[#E1E1E1] ml-2 bg-white rounded-[5px] hidden md:block md:w-[48px] md:h-12 cursor-pointer"
                disabled={loading}
                aria-label="초기화"
            >
                <img className="mx-auto" src="/images/icon_refresh.png" alt="초기화" />
            </button>
        </>
    );
}
