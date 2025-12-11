// components/SearchSection.tsx
import { SearchSectionProps } from "@/app/sales/types/List";

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
    salesMan,
    onSalesManChange,
    manItems,
    state,
    onStateChange,
    showAreaFilter,
}: SearchSectionProps) {
    if (isMobile) {
        return (
            <div className="w-full h-[108px] bg-[#F9FBFC] rounded-[5px] flex flex-col justify-center md:hidden px-4 gap-3">
                <div className="w-full flex justify-between">
                    <div className="flex-1">
                        <input
                            ref={keywordRef}
                            className="w-full appearance-none h-10 pl-4 text-sm focus:outline-none border border-[#E1E1E1] rounded-md bg-white"
                            placeholder="업체코드, 업체명"
                            value={keywordValue}
                            onChange={onKeywordChange}
                            onKeyDown={onKeyPress}
                            disabled={loading}
                        />
                    </div>
                    <div className="flex ml-2">
                        <button
                            onClick={onSearch}
                            className="w-[48px] h-10 bg-[#A50A2E] rounded-[5px] mr-1"
                            disabled={loading}
                        >
                            <img className="mx-auto" src={"/images/icon_search.png"} alt="검색" />
                        </button>
                        <button
                            onClick={onReset}
                            className="w-[48px] h-10 border bg-white rounded-[5px]"
                            disabled={loading}
                        >
                            <img
                                className="mx-auto"
                                src={"/images/icon_refresh.png"}
                                alt="초기화"
                            />
                        </button>
                    </div>
                </div>

                <div className="w-full flex gap-2 overflow-x-auto">
                    {/* 상태 select */}
                    <div className="flex flex-col min-w-0">
                        <select
                            value={state}
                            onChange={onStateChange}
                            className="w-[100px] h-10 pl-2 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none bg-white text-sm"
                            disabled={loading}
                        >
                            <option value="">전체</option>
                            <option value="0">대기</option>
                            <option value="1">진행</option>
                            <option value="2">취소</option>
                            <option value="3">납예</option>
                            <option value="4">납품</option>
                        </select>
                    </div>

                    <div className="flex flex-col min-w-0">
                        <select
                            value={salesMan}
                            onChange={onSalesManChange}
                            className="w-[100px] h-10 pl-2 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none bg-white text-sm"
                            disabled={loading}
                        >
                            <option value="">담당자</option>
                            {manItems.map((item) => (
                                <option key={item.code} value={item.codename}>
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
        <div className="w-full bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[168px] md:flex items-center hidden">
            <div className="pl-6 text-[14px]">
                <div className="flex">
                    <div>
                        <label className="font-semibold">프로그램</label>
                        <select
                            value={prgCode}
                            onChange={onPrgCodeChange}
                            className="ml-3 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[300px] md:h-12 md:bg-white"
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
                    {showAreaFilter ? (
                        <div className="pl-6">
                            <label className="font-semibold">지사</label>
                            <select
                                value={areaCode}
                                onChange={onAreaCodeChange}
                                className="ml-3 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[150px] md:h-12 md:bg-white"
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
                    ) : (
                        ""
                    )}
                    <div className="pl-6">
                        <label className="font-semibold">담당자</label>
                        <select
                            value={salesMan}
                            onChange={onSalesManChange}
                            className="ml-3 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[150px] md:h-12 md:bg-white"
                            disabled={loading}
                        >
                            <option value="">전체</option>
                            {manItems.map((item) => (
                                <option key={item.code} value={item.codename}>
                                    {item.codename}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="pl-6">
                        <label className="font-semibold">처리상태</label>
                        <select
                            value={state}
                            onChange={onStateChange}
                            className="ml-3 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[108px] md:h-12 md:bg-white"
                            disabled={loading}
                        >
                            <option value="">전체</option>
                            <option value="0">대기</option>
                            <option value="1">진행</option>
                            <option value="2">취소</option>
                            <option value="3">납예</option>
                            <option value="4">납품</option>
                        </select>
                    </div>
                </div>
                <div className="flex pt-6">
                    <div className="flex items-baseline">
                        <label className="font-semibold hidden md:block">검색</label>
                        <input
                            ref={keywordRef}
                            className="w-[100%] h-12 pl-4 text-sm focus:outline-none border border-[#E1E1E1] rounded-md md:w-[300px] md:ml-[38px] md:pl-4 md:h-12 bg-white"
                            placeholder="업체명"
                            value={keywordValue}
                            onChange={onKeywordChange}
                            onKeyDown={onKeyPress}
                            disabled={loading}
                        />
                    </div>
                    <div className="flex justify-between pl-2">
                        <button
                            onClick={onSearch}
                            className="w-[48px] h-12 bg-[#A50A2E] rounded-[5px] md:w-[48px] md:h-12 cursor-pointer"
                            disabled={loading}
                        >
                            <img className="mx-auto" src={"/images/icon_search.png"} alt="검색" />
                        </button>
                        <button
                            onClick={onReset}
                            className="w-[48px] border border-[#E1E1E1] bg-white rounded-[5px] hidden md:block md:w-[48px] md:h-12 md:ml-1 cursor-pointer"
                            disabled={loading}
                        >
                            <img
                                className="mx-auto"
                                src={"/images/icon_refresh.png"}
                                alt="초기화"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
