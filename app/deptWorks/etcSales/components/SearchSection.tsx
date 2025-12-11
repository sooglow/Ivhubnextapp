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
    state: string;
    stateItems: { statusCode: string; statusName: string }[];
    onStateChange: (state: string) => void;
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
    state,
    stateItems,
    onStateChange,
}: SearchSectionProps) {
    if (isMobile) {
        return (
            <div className="w-full h-[88px] bg-[#F9FBFC] rounded-[5px] flex items-center md:hidden">
                <div className="w-full flex justify-between px-4">
                    <div className="w-full">
                        <input
                            ref={keywordRef}
                            className="w-full appearance-none h-12 pl-4 text-sm focus:outline-none border border-[#E1E1E1] rounded-md bg-white"
                            placeholder="매출처명"
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
                            className="w-[48px] h-12 border bg-white rounded-[5px] ml-1"
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
        <div className="w-full h-[88px] bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[140px] md:flex items-center hidden">
            <div className="flex pl-6 text-[14px]">
                <div className="flex items-baseline">
                    <label className="font-semibold hidden md:block">검색</label>
                    <input
                        ref={keywordRef}
                        className="w-full hidden h-12 pl-6 text-sm focus:outline-none border border-[#E1E1E1] rounded-md md:w-[300px] md:ml-12 md:pl-4 md:h-12 md:block bg-white"
                        placeholder="매출처명"
                        value={keywordValue}
                        onChange={onKeywordChange}
                        onKeyDown={onKeyPress}
                        disabled={loading}
                    />
                </div>
                <div className="flex justify-between pl-2">
                    <button
                        onClick={onSearch}
                        className="w-[48px] h-12 bg-[#A50A2E] rounded-[5px] hidden md:block cursor-pointer"
                        disabled={loading}
                    >
                        <img className="mx-auto" src="/images/icon_search.png" alt="검색" />
                    </button>
                    <button
                        onClick={onReset}
                        className="w-[48px] border border-[#E1E1E1] ml-2 bg-white rounded-[5px] hidden md:block md:h-12 cursor-pointer "
                        disabled={loading}
                    >
                        <img className="mx-auto" src="/images/icon_refresh.png" alt="초기화" />
                    </button>
                </div>
                <select
                    value={state}
                    onChange={(e) => onStateChange(e.target.value)}
                    className="hidden md:block h-12 pl-4 md:ml-6 md:pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[200px] md:h-12 md:bg-white"
                    disabled={loading}
                >
                    {stateItems.map((item) => (
                        <option key={item.statusCode} value={item.statusCode}>
                            {item.statusName}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
