"use client";

import React, { useState } from "react";
import { ShopAskHistProps } from "@/app/shop/types/View";
import { truncate, formatDate } from "@/public/utils/utils";

export default function ShopAskHist({ salesItems }: ShopAskHistProps) {
  const [selectedAsRow, setSelectedAsRow] = useState<number | null>(null);

  return (
    <>
      <div className="w-[92%] h-[58px] rounded-tl-md rounded-tr-md mx-auto mt-4 flex justify-between md:w-full md:h-[58px] md:mx-0 md:rounded-tl-md md:rounded-tr-md md:border-[#E1E1E1] border-t border-x border-0">
        <h3 className="pl-4 font-semibold text-[16px] text-[#A50A2E] my-auto">영업문의이력</h3>
      </div>

      {/* PC */}
      <div className="hidden md:block md:w-full md:rounded-bl-md md:rounded-br-md md:border-[#E1E1E1] md:border">
        <div className="pl-6 md:w-full mt-5 md:h-[180px]">
          <div className="md:w-[98%] mt-5 md:h-[165px] md:overflow-y-scroll rounded-md text-[14px]">
            <table className="table-auto w-full mx-auto border-collapse border-hidden text-[14px]">
              <thead className="p-2">
                <tr className="h-[48px] bg-[#F9FBFC] text-[14px]">
                  <th className="w-[30%] text-left p-2">접수일</th>
                  <th className="w-[20%] text-left">프로그램</th>
                  <th className="w-[15%] text-left">유형</th>
                  <th className="w-[20%] text-left">담당자</th>
                  <th className="w-[15%] text-left">상태</th>
                </tr>
              </thead>
              <tbody className="w-full">
                {salesItems && salesItems.length > 0 ? (
                  salesItems.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`${
                        idx === selectedAsRow ? "bg-[#FFF6F8]" : "hover:bg-[#FFF6F8]"
                      } cursor-pointer`}
                      onClick={() => setSelectedAsRow(idx)}
                    >
                      <td className="table-cell">{truncate(formatDate(item.salesSerial || "", "short"), 10)}</td>
                      <td className="table-cell pt-2">{item.prgName}</td>
                      <td className="table-cell">{item.salesType ? item.salesType : "-"}</td>
                      <td className="table-cell items-center">{item.callMan ?? ""}</td>
                      <td className="table-cell">{item.salesStateName ?? ""}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="pl-2 pt-2 text-[16px]">
                      결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-[100%] h-[180px] pl-6 text-[14px] rounded-md">
          <table className="w-[98%] border-collapse border-hidden">
            <thead className="w-full h-[48px]">
              <tr className="bg-[#F9FBFC]">
                <th className="p-2 text-left">문의내용</th>
                <th className="pl-4 text-left">처리내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="w-1/2 pl-1">
                  {selectedAsRow !== null ? salesItems[selectedAsRow]?.salesDescr : "-"}
                </td>
                <td className="w-1/2 pl-4">
                  {selectedAsRow !== null ? salesItems[selectedAsRow]?.salesOutDescr : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 모바일 */}
      <div className="w-[92%] h-[full] mx-auto border rounded-b-md md:hidden">
        <ul className="w-[full] px-4 pt-3 space-y-2">
          {salesItems && salesItems.length > 0 ? (
            salesItems.map((item, idx) => (
              <ul className="w-[full] px-4 pt-3 space-y-2" key={idx}>
                <li className="pt-[19px] flex justify-between text-[14px]">
                  <div className="text-black font-semibold">접수일</div>
                  <div>{truncate(formatDate(item.salesSerial || "", "short"), 10)}</div>
                </li>
                <li className="pt-[19px] flex justify-between text-[14px]">
                  <div className="text-black font-semibold">프로그램</div>
                  <div>{item.prgName}</div>
                </li>
                <li className="pt-[19px] flex justify-between text-[14px]">
                  <div className="text-black font-semibold">유형</div>
                  <div>{item.salesType ? item.salesType : "-"}</div>
                </li>
                <li className="pt-[19px] flex justify-between text-[14px]">
                  <div className="text-black font-semibold">담당자</div>
                  <div>{item.callMan ?? ""}</div>
                </li>
                <li className="pt-[19px] flex justify-between text-[14px]">
                  <div className="text-black font-semibold">상태</div>
                  <div>{item.salesStateName ?? ""}</div>
                </li>
                <li className="pt-[19px] flex justify-between text-[14px]">
                  <div className="text-black font-semibold">문의내용</div>
                  <div>{item.salesDescr ? item.salesDescr : "-"}</div>
                </li>
                <li className="pt-[19px] pb-4 border-b flex justify-between text-[14px]">
                  <div className="text-black font-semibold">처리결과</div>
                  <div>{item.salesOutDescr ? item.salesOutDescr : "-"}</div>
                </li>
              </ul>
            ))
          ) : (
            <li className="pb-4">결과가 없습니다.</li>
          )}
        </ul>
      </div>
    </>
  );
}
