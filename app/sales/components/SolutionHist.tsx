"use client";

import { useState } from "react";
import { SalesComPrgItem } from "@/app/sales/types/View";

interface SolutionHistProps {
    salesComPrgItems: SalesComPrgItem[];
}

export default function SolutionHist({ salesComPrgItems }: SolutionHistProps) {
    const [selectedAsRow, setSelectedAsRow] = useState<number | null>(null);

    return (
        <>
            <div className="w-[92%] h-[58px] mx-auto mt-4 md:mt-4 flex justify-between rounded-tl-md rounded-tr-md border-[#E1E1E1] md:w-full md:h-[58px] md:mx-0 md:rounded-tl-md md:rounded-tr-md md:border-[#E1E1E1] border-0 border-x border-t">
                <p className="pl-4 md:pl-4 font-semibold text-[16px] text-[#A50A2E] my-auto">
                    솔루션 사용현황
                </p>
            </div>
            {/* pc */}
            <div className="hidden md:block md:w-full md:rounded-bl-md md:rounded-br-md md:border-[#E1E1E1] md:border-[1px]">
                <div className="mt-3 w-full pb-3">
                    <table className="table-auto md:w-[95%] mx-auto text-[14px]">
                        <thead className="p-2">
                            <tr className="h-[48px] bg-[#F9FBFC]">
                                <th className="text-left p-2">프로그램</th>
                                <th className="text-left">사용상태</th>
                                <th className="text-left">등록일</th>
                                <th className="text-left">최종로그인</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesComPrgItems && salesComPrgItems.length > 0 ? (
                                salesComPrgItems.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="table-cell p-2">{item.prgName}</td>
                                        <td className="table-cell">
                                            {item.luseName ? item.luseName : "-"}
                                        </td>
                                        <td className="table-cell">{item.luseDt ?? ""}</td>
                                        <td className="table-cell">{item.ssoDay}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="pl-2 pt-2 text-[14px]">
                                        신규업체 입니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 모바일 */}
            <div className="w-[92%] h-[full] mx-auto border rounded-b-md md:hidden py-2">
                <ul className="w-[full] space-y-2">
                    {salesComPrgItems && salesComPrgItems.length > 0 ? (
                        salesComPrgItems.map((item, idx) => (
                            <ul className="w-[full] px-4 pt-2 space-y-2" key={idx}>
                                <li
                                    onClick={() => setSelectedAsRow(idx)}
                                    className={`w-[full] h-[48px] py-[13px] px-5 flex justify-between text-[14px] rounded-md cursor-pointer ${
                                        idx === selectedAsRow ? "bg-[#FFF6F8]" : "bg-[#F9FBFC]"
                                    }`}
                                >
                                    <div>{item.prgName}</div>
                                    <div>{item.luseDt}</div>
                                </li>
                                {selectedAsRow === idx && (
                                    <ul className="w-[full]">
                                        <li className="pt-[19px] px-4 flex justify-between text-[14px]">
                                            <div className="text-black font-semibold">
                                                사용프로그램
                                            </div>
                                            <div>{item.prgName}</div>
                                        </li>
                                        <li className="pt-[19px] px-4 flex justify-between text-[14px]">
                                            <div className="text-black font-semibold">사용상태</div>
                                            <div>{item.luseName}</div>
                                        </li>
                                        <li className="pt-[19px] px-4 flex justify-between text-[14px]">
                                            <div className="text-black font-semibold">등록일</div>
                                            <div>{item.luseDt}</div>
                                        </li>
                                        <li className="pt-[19px] px-4 flex justify-between text-[14px] pb-6">
                                            <div className="text-black font-semibold">
                                                최종로그인
                                            </div>
                                            <div>{item.ssoDay}</div>
                                        </li>
                                        <li className="w-full h-[48px] px-4 rounded-md bg-[#F9F9F9]">
                                            <img
                                                className="mx-auto cursor-pointer"
                                                src={"/images/icon_arrow_up.png"}
                                                alt="^"
                                                onClick={() => setSelectedAsRow(null)}
                                            />
                                        </li>
                                    </ul>
                                )}
                            </ul>
                        ))
                    ) : (
                        <li className="pb-1 text-[14px]">신규업체 입니다.</li>
                    )}
                </ul>
            </div>
        </>
    );
}
