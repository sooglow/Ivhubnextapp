import React from "react";
import { SalesInquiryItem } from "../types/List";
import { SALES_STATUS } from "../constants/salesStatus";
import ListItemLoader from "./ListItemLoader";
import MobileListItemLoader from "./MobileListItemLoader";

interface SalesInquirySectionProps {
    lists: SalesInquiryItem[];
    loading: boolean;
    expandedIndex: number | null;
    onToggleExpand: (index: number) => void;
    onStateChange: (index: number, newState: string, item: SalesInquiryItem) => void;
    onCreateFromInquiry: (item: SalesInquiryItem) => void;
    isMobile: boolean;
}

const truncate = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
        return str.slice(0, maxLength);
    }
    return str;
};

export default function SalesInquirySection({
    lists,
    loading,
    expandedIndex,
    onToggleExpand,
    onStateChange,
    onCreateFromInquiry,
    isMobile,
}: SalesInquirySectionProps) {
    return (
        <div className="md:border-[#E1E1E1] mt-4 mx-4 md:mx-0">
            <div className="md:border-[#E1E1E1] h-[400px] md:h-[360px] overflow-y-scroll border border-[#E1E1E1] rounded-[5px]">
                <table className="table-auto w-full border-separate border-spacing-[14px] md:border-0 rounded md:border-spacing-0 md:border-[#E1E1E1] md:rounded-[5px] text-sm">
                    <thead className="hidden md:border md:border-separate md:rounded-l-sm md:rounded-r-sm md:table-header-group">
                        <tr className="bg-[#F9FBFC] text-[14px]">
                            <th className="w-[12%] px-4 py-2 text-left whitespace-nowrap">
                                접수일자
                            </th>
                            <th className="w-[13%] px-4 py-2 text-left">솔루션명</th>
                            <th className="w-[12%] px-4 py-2 text-left">업체명</th>
                            <th className="w-[14%] px-4 py-2 text-left">연락처</th>
                            <th className="w-[15%] px-4 py-2 text-left">지역</th>
                            <th className="w-[6%] px-4 py-2 text-left">지사</th>
                            <th className="w-[9%] px-4 py-2 text-left">담당자</th>
                            <th className="w-[9%] px-4 py-2 text-center">유형</th>
                            <th className="w-[5%] px-4 py-2 text-center">상태</th>
                            <th className="w-[5%] px-4 py-2 text-center">작성</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={10}>
                                    {isMobile ? <MobileListItemLoader /> : <ListItemLoader />}
                                </td>
                            </tr>
                        ) : lists && lists.length > 0 ? (
                            lists.map((list, idx) => (
                                <React.Fragment key={idx}>
                                    <tr
                                        className="transition-all hover:bg-slate-100 cursor-pointer"
                                        onClick={() => onToggleExpand(idx)}
                                    >
                                        <td className="px-4 text-[#0340E6] font-bold hidden md:border-t last:rounded-bl-md md:table-cell">
                                            {truncate(list.callDay ?? "", 12)}
                                        </td>
                                        <td className="px-4 text-left hidden md:border-t md:table-cell">
                                            {list.prgName ?? ""}
                                        </td>
                                        <td className="max-w-[120px] p-4 text-left whitespace-nowrap overflow-hidden text-ellipsis hidden md:border-t md:table-cell">
                                            {list.comName ?? ""}
                                        </td>
                                        <td className="max-w-[115px] px-4 text-left whitespace-nowrap overflow-hidden text-ellipsis hidden md:border-t md:table-cell">
                                            {list.comTel ?? ""}
                                        </td>
                                        <td className="px-4 text-left hidden md:border-t md:table-cell overflow-hidden text-ellipsis">
                                            {list.area ?? ""}
                                        </td>
                                        <td className="px-4 text-left hidden md:border-t md:table-cell">
                                            {list.areaName ?? ""}
                                        </td>
                                        <td className="px-4 text-left hidden md:border-t md:table-cell">
                                            {list.salesMan ?? ""}
                                        </td>
                                        <td className="px-4 text-center hidden md:border-t md:table-cell">
                                            {list.salesType ?? ""}
                                        </td>
                                        <td
                                            className="px-4 text-left hidden md:border-t md:table-cell"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <select
                                                value={list.salesState}
                                                onChange={(e) => onStateChange(idx, e.target.value, list)}
                                                className="hidden md:block h-12 pl-4 md:ml-4md:pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[100px] md:h-8 cursor-pointer"
                                            >
                                                {SALES_STATUS.map((item) => (
                                                    <option key={item.statusCode} value={item.statusCode}>
                                                        {item.statusName}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="w-[20%] p-4 text-left hidden md:border-t md:table-cell">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onCreateFromInquiry(list);
                                                }}
                                                className="hover:bg-[#A50A2E] cursor-pointer w-[50px] h-10 bg-[#77829B] text-[#FFFFFF] rounded-[5px] text-[14px] md:w-[60px] md:h-8"
                                            >
                                                신규
                                            </button>
                                        </td>
                                        {/* 모바일 */}
                                        <td colSpan={10} className="p-4 border rounded-[5px] md:hidden">
                                            <div className="text-[#0340E6] font-semibold flex justify-between">
                                                {truncate(list.callDay ?? "", 12)}
                                                <div className="font-semibold text-black text-ellipsis">
                                                    {list.comName ?? ""}
                                                </div>
                                            </div>
                                            <div className="pt-1 flex justify-between">
                                                <div className="pt-1">{list.prgName ?? ""}</div>
                                                {list.salesType ?? ""}
                                            </div>
                                            <div className="pt-1 flex justify-between">
                                                <select
                                                    value={list.salesState}
                                                    onChange={(e) => onStateChange(idx, e.target.value, list)}
                                                    className="pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[100px] h-8 cursor-pointer"
                                                >
                                                    {SALES_STATUS.map((item) => (
                                                        <option key={item.statusCode} value={item.statusCode}>
                                                            {item.statusName}
                                                        </option>
                                                    ))}
                                                </select>
                                                {list.salesMan ?? ""}
                                            </div>
                                            <div className="text-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onCreateFromInquiry(list);
                                                    }}
                                                    className="hover:bg-[#A50A2E] cursor-pointer mt-2 w-[100px] h-10 bg-[#77829B] text-[#FFFFFF] rounded-[5px] text-[14px]"
                                                >
                                                    신규
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {list && (
                                        <tr
                                            className={`transition-all text-sm ${
                                                expandedIndex === idx ? "" : "hidden"
                                            }`}
                                        >
                                            <td
                                                className="w-full px-4 py-1 text-left md:border-t md:table-cell flex flex-col"
                                                colSpan={10}
                                            >
                                                <div className="flex">
                                                    <label className="whitespace-nowrap">영업문의:</label>
                                                    <p className="pl-1">{list.salesDescr ?? ""}</p>
                                                </div>
                                                <div className="pt-1">
                                                    <label className="whitespace-nowrap">본사문의:</label>
                                                    <p className="pl-1">{list.headOpin ?? ""}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className="pl-2 pt-2 text-[16px]">
                                    결과가없습니다
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
