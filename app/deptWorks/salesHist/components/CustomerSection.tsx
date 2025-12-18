import React from "react";
import { SalesActivityItem } from "../types/Activity";
import CustomerListItemLoader from "./CustomerListItemLoader";
import Pagination from "@/public/components/Pagination";

interface CustomerSectionProps {
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

export default function CustomerSection({
    lists,
    loading,
    currentPage,
    totalCount,
    pageSize,
    onPageChange,
    onItemClick,
}: CustomerSectionProps) {
    const totalPages = Math.ceil(totalCount / pageSize);
    const canPreviousPage = currentPage > 0;
    const canNextPage = currentPage < totalPages - 1;

    return (
        <>
            <h3 className="pl-4 font-semibold text-lg pt-6">고객 지원 및 관리 활동</h3>
            <div>
                <table className="mt-2 table-auto w-full border-separate border-spacing-[14px] rounded md:border-spacing-0 md:border-[#E1E1E1] md:rounded-[5px] md:border text-sm">
                    <thead className="hidden md:border md:border-separate md:rounded-l-sm md:rounded-r-sm md:table-header-group">
                        <tr className="bg-[#F9FBFC] text-[14px]">
                            <th className="w-[12%] p-4 text-left">활동일자</th>
                            <th className="w-[8%] p-4 text-left">담당자</th>
                            <th className="w-[12%] p-4 text-left">영업S/W</th>
                            <th className="w-[14%] p-4 text-left">업체명</th>
                            <th className="w-[11%] p-4 text-left">지역</th>
                            <th className="w-[8%] p-4 text-left">유형</th>
                            <th className="w-[10%] p-4 text-left">시간(분)</th>
                            <th className="w-[25%] p-4 text-left">메모</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8}>
                                    <CustomerListItemLoader />
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
                                            <td className="p-4 text-left hidden md:border-t border-[#E1E1E1] md:table-cell">
                                                {list.prgName ?? ""}
                                            </td>
                                            <td className="max-w-[120px] p-4 text-left whitespace-nowrap overflow-hidden text-ellipsis hidden md:border-t border-[#E1E1E1] md:table-cell">
                                                {list.comName ?? ""}
                                            </td>
                                            <td className="p-4 text-left hidden md:border-t border-[#E1E1E1] md:table-cell">
                                                {list.areaName ?? ""}
                                            </td>
                                            <td className="p-4 text-left hidden md:border-t border-[#E1E1E1] md:table-cell">
                                                {list.salesType ?? ""}
                                            </td>
                                            <td className="p-4 text-center hidden md:border-t border-[#E1E1E1] md:table-cell">
                                                {list.saleHour ?? "0"}
                                            </td>
                                            <td className="max-w-[230px] p-4 text-left whitespace-nowrap overflow-hidden text-ellipsis hidden md:border-t border-[#E1E1E1]  md:table-cell">
                                                {list.specialMemo ?? ""}
                                            </td>

                                            {/* 모바일 */}
                                            <td
                                                colSpan={8}
                                                className="p-4 border rounded-[5px] md:hidden"
                                            >
                                                <div className="text-[#0340E6] font-semibold flex justify-between">
                                                    {truncate(list.saleDay ?? "", 12)}
                                                    <div className="font-semibold text-black text-ellipsis">
                                                        {list.comName ?? ""}
                                                    </div>
                                                </div>
                                                <div className="pt-2 flex justify-between">
                                                    <div className="">{list.prgName ?? ""}</div>
                                                    <div className="">
                                                        <div>{list.salesMan ?? ""}</div>
                                                    </div>
                                                </div>
                                                <div className="pt-2 flex justify-between">
                                                    <div>{list.salesType ?? ""}</div>
                                                    <div></div>
                                                </div>
                                                <div className="pt-4 flex justify-between">
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
            <div className="py-5 md:block">
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
