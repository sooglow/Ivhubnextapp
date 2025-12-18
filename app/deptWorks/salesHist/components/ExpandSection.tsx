import React from "react";
import { SalesActivityItem } from "../types/Activity";
import ExpandListItemLoader from "./ExpandListItemLoader";
import Pagination from "@/public/components/Pagination";

interface ExpandSectionProps {
    lists: SalesActivityItem[];
    loading: boolean;
    currentPage: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onItemClick: (item: SalesActivityItem) => void;
}

const truncate = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
        return str.slice(0, maxLength);
    }
    return str;
};

export default function ExpandSection({
    lists,
    loading,
    currentPage,
    totalCount,
    pageSize,
    onPageChange,
    onItemClick,
}: ExpandSectionProps) {
    const totalPages = Math.ceil(totalCount / pageSize);
    const canPreviousPage = currentPage > 0;
    const canNextPage = currentPage < totalPages - 1;

    return (
        <>
            <h3 className="pl-4 font-semibold text-lg pt-6">성장 및 확장 활동</h3>
            <div>
                <table className="mt-2 table-auto w-full border-separate border-spacing-[14px] rounded md:border-spacing-0 md:border-[#E1E1E1] md:rounded-[5px] md:border text-sm">
                    <thead className="hidden md:border md:border-separate md:rounded-l-sm md:rounded-r-sm md:table-header-group">
                        <tr className="bg-[#F9FBFC] text-[14px]">
                            <th className="w-[12%] p-4 text-left">납품일자</th>
                            <th className="w-[8%] p-4 text-left">담당자</th>
                            <th className="w-[12%] p-4 text-left">납품S/W</th>
                            <th className="w-[12%] p-4 text-left">업체명</th>
                            <th className="w-[10%] p-4 text-left">유형</th>
                            <th className="w-[6%] p-4 text-right">대수</th>
                            <th className="w-[10%] p-4 text-right">월사용료</th>
                            <th className="w-[10%] p-4 text-right">설치비</th>
                            <th className="w-[10%] p-4 text-right">추가설치비</th>
                            <th className="w-[10%] p-4 text-right">업그레이드비</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={10}>
                                    <ExpandListItemLoader />
                                </td>
                            </tr>
                        ) : lists && lists.length > 0 ? (
                            lists.map((list, idx) => {
                                return (
                                    <React.Fragment key={idx}>
                                        <tr
                                            onClick={() => onItemClick(list)}
                                            className="hover:bg-slate-100 cursor-pointer transition-all"
                                        >
                                            <td className="p-4 text-[#0340E6] font-bold hidden md:border-t border-[#E1E1E1] last:rounded-bl-md md:table-cell">
                                                {list.saleDay ?? ""}
                                            </td>
                                            <td className="p-4 text-left hidden md:border-t border-[#E1E1E1] md:table-cell">
                                                {list.salesMan ?? ""}
                                            </td>
                                            <td className="max-w-[120px] p-4 text-left whitespace-nowrap overflow-hidden text-ellipsis hidden md:border-t border-[#E1E1E1] md:table-cell">
                                                {list.prgName ?? ""}
                                            </td>
                                            <td className="max-w-[120px] p-4 text-left whitespace-nowrap overflow-hidden text-ellipsis hidden md:border-t border-[#E1E1E1] md:table-cell">
                                                {list.comName ?? ""}
                                            </td>
                                            <td className="p-4 text-left hidden md:border-t border-[#E1E1E1] md:table-cell">
                                                {list.salesType ?? ""}
                                            </td>
                                            <td className="p-4 text-right hidden md:border-t border-[#E1E1E1] md:table-cell">
                                                {list.userMax ? list.userMax.toLocaleString() : "0"}
                                            </td>
                                            <td className="p-4 text-right hidden md:border-t border-[#E1E1E1] md:table-cell">
                                                {list.billPrice
                                                    ? list.billPrice.toLocaleString()
                                                    : "0"}
                                            </td>
                                            <td className="p-4 text-right hidden md:border-t border-[#E1E1E1] md:table-cell">
                                                {list.installPrice
                                                    ? list.installPrice.toLocaleString()
                                                    : "0"}
                                            </td>
                                            <td className="p-4 text-right hidden md:border-t border-[#E1E1E1] md:table-cell">
                                                {list.installPriceAdd
                                                    ? list.installPriceAdd.toLocaleString()
                                                    : "0"}
                                            </td>
                                            <td className="p-4 text-right hidden md:border-t border-[#E1E1E1] md:table-cell">
                                                {list.upgradePrice
                                                    ? list.upgradePrice.toLocaleString()
                                                    : "0"}
                                            </td>

                                            {/* 모바일 */}
                                            <td
                                                colSpan={10}
                                                className="p-4 border border-[#E1E1E1] rounded-[5px] md:hidden"
                                            >
                                                <div className="text-[#0340E6] font-semibold flex justify-between">
                                                    {truncate(list.saleDay ?? "", 12)}
                                                    <div className="font-semibold text-black text-ellipsis">
                                                        {list.comName ?? ""}
                                                    </div>
                                                </div>
                                                <div className="pt-2 flex justify-between">
                                                    <div className="">{list.prgName ?? ""}</div>
                                                    {list.salesType ?? ""}
                                                </div>
                                                <div className="pt-2 flex justify-between">
                                                    <div>
                                                        <label>대수: </label>
                                                        {list.userMax ? list.userMax : "0"}
                                                    </div>
                                                    {list.salesMan ?? ""}
                                                </div>
                                                <div className="pt-4 flex justify-between">
                                                    메모:{" "}
                                                    {list.specialMemo ? list.specialMemo : "없음"}
                                                </div>
                                            </td>
                                        </tr>

                                        <tr className="transition-all">
                                            <td
                                                colSpan={10}
                                                className="pl-4 p-0 md:p-4 text-left whitespace-nowrap md:border-t border-[#E1E1E1] text-sm"
                                            >
                                                <div className="hidden md:block">
                                                    메모:{" "}
                                                    {list.specialMemo ? list.specialMemo : "없음"}
                                                </div>
                                            </td>
                                        </tr>
                                    </React.Fragment>
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
            </div>
            <div className="md:py-5 md:block">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    canPreviousPage={canPreviousPage}
                    canNextPage={canNextPage}
                />
            </div>
        </>
    );
}
