"use client";

import React, { useState } from "react";
import { AsHistProps } from "@/app/shop/types/View";
import { truncate, formatDate } from "@/public/utils/utils";

export default function AsHist({ asHistItems }: AsHistProps) {
  const [selectedAsRow, setSelectedAsRow] = useState<number | null>(null);

  return (
    <>
      <div className="w-[92%] h-[58px] mt-4 rounded-tl-md rounded-tr-md mx-auto flex justify-between md:mx-0 md:w-full md:h-[58px] md:rounded-tl-md md:rounded-tr-md border-[#E1E1E1] border-0 border-t border-x">
        <h3 className="pl-4 font-semibold text-[16px] text-[#A50A2E] my-auto">A/S 접수 이력</h3>
      </div>

      {/* PC */}
      <div className="hidden md:block md:w-full md:h-[437px] md:border-[#E1E1E1] md:border rounded-b-md">
        <div className="pl-6 md:w-[98%] mt-5 md:h-[180px]">
          <div className="md:w-full mt-5 md:h-[165px] md:overflow-y-scroll rounded-md text-[14px]">
            <table className="table-auto w-full mx-auto border-collapse border-hidden text-[14px]">
              <thead className="w-full h-[48px]">
                <tr className="bg-[#F9FBFC]">
                  <th className="p-2 w-[120px] text-left">접수일</th>
                  <th className="w-[100px] text-left">프로그램</th>
                  <th className="w-[100px] text-left">A/S 구분</th>
                  <th className="w-[100px] text-left">접수자</th>
                </tr>
              </thead>
              <tbody>
                {asHistItems && asHistItems.length > 0 ? (
                  asHistItems.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`${
                        idx === selectedAsRow ? "bg-[#FFF6F8]" : "hover:bg-[#FFF6F8]"
                      } cursor-pointer`}
                      onClick={() => setSelectedAsRow(idx)}
                    >
                      <td className="p-2 table-cell border-collapse border-hidden rounded-l-md">
                        {truncate(formatDate(item.callDay || "", "short"), 11)}
                      </td>
                      <td className="table-cell">{item.prgName ?? ""}</td>
                      <td className="table-cell">{item.asKind ?? ""}</td>
                      <td className="table-cell border-collapse border-hidden rounded-r-md">
                        {item.callMan ?? ""}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="pl-2 pt-4 text-[16px]">
                      결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="pl-6 md:w-[98%] pt-2 md:h-[180px] text-[14px]">
          <table className="w-full border-collapse border-hidden">
            <thead className="w-full h-[48px]">
              <tr className="bg-[#F9FBFC]">
                <th className="p-2 text-left">문의내용</th>
                <th className="pl-4 text-left">처리내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="w-1/2 pl-4 p-2">
                  {selectedAsRow !== null ? asHistItems[selectedAsRow]?.asDescr : "-"}
                </td>
                <td className="w-1/2 pl-4 p-2">
                  {selectedAsRow !== null ? asHistItems[selectedAsRow]?.asOutDescr : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 모바일 */}
      <div className="w-[92%] h-[full] mx-auto border rounded-b-md md:hidden">
        <ul className="w-[full] pt-3 space-y-1">
          {asHistItems && asHistItems.length > 0 ? (
            asHistItems.map((item, idx) => (
              <ul className="cursor-pointer px-4 pt-1" key={idx}>
                <li
                  onClick={() => setSelectedAsRow(idx)}
                  className={`${
                    idx === selectedAsRow && "bg-[#FFF6F8]"
                  } w-[full] h-[48px] py-[13px] px-5 mb-4 flex justify-between text-[14px] rounded-md bg-[#F9FBFC]`}
                >
                  <div>{truncate(formatDate(item.callDay || "", "short"), 11)}</div>
                  <div>{item.prgName ?? ""}</div>
                </li>
                <li>
                  {selectedAsRow === idx ? (
                    <ul className="w-[full] px-4 pb-2 space-y-1">
                      <li className="flex justify-between text-[14px]">
                        <div className="text-black font-semibold">접수일</div>
                        <div>
                          {selectedAsRow !== null
                            ? truncate(
                                formatDate(asHistItems[selectedAsRow]?.callDay || "", "short"),
                                11
                              )
                            : "없음"}
                        </div>
                      </li>
                      <li className="flex justify-between text-[14px]">
                        <div className="text-black font-semibold">프로그램</div>
                        <div>
                          {selectedAsRow !== null ? asHistItems[selectedAsRow]?.prgName : "없음"}
                        </div>
                      </li>
                      <li className="flex justify-between text-[14px]">
                        <div className="text-black font-semibold">A/S구분</div>
                        <div>
                          {selectedAsRow !== null ? asHistItems[selectedAsRow]?.asKind : "없음"}
                        </div>
                      </li>
                      <li className="flex justify-between text-[14px]">
                        <div className="text-black font-semibold">접수자</div>
                        <div>
                          {selectedAsRow !== null ? asHistItems[selectedAsRow]?.callMan : "없음"}
                        </div>
                      </li>
                      <li className="flex justify-between pt-6 text-[14px]">
                        <div className="text-black font-semibold">문의내용</div>
                      </li>
                      <div className="text-[14px]">
                        {selectedAsRow !== null
                          ? asHistItems[selectedAsRow]?.asDescr ?? "없음"
                          : "없음"}
                      </div>
                      <li className="flex justify-between pt-6 text-[14px]">
                        <div className="text-black font-semibold">처리내용</div>
                      </li>
                      <div className="text-[14px] pb-6">
                        {selectedAsRow !== null ? asHistItems[selectedAsRow]?.asOutDescr : "없음"}
                      </div>
                      <li
                        className="w-[full] -m-4 h-[48px] rounded-md bg-[#F9F9F9]"
                        onClick={() => setSelectedAsRow(null)}
                      >
                        <img className="mx-auto" src={"/images/icon_arrow_up.png"} alt="^" />
                      </li>
                    </ul>
                  ) : (
                    ""
                  )}
                </li>
              </ul>
            ))
          ) : (
            <li className="pl-4 pb-4">결과가 없습니다.</li>
          )}
        </ul>
      </div>
    </>
  );
}
