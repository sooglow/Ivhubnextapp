"use client";

import React, { useState, useEffect, useRef } from "react";
import { UsePrgInfoProps } from "@/app/shop/types/View";
import { userInfo as UserInfo } from "@/public/types/user";
import { parseJWT, truncate } from "@/public/utils/utils";
import { useInput } from "@/public/hooks/useInput";
import { useLoading } from "@/public/contexts/LoadingContext";

export default function UsePrgInfo({ usedPrgItems }: UsePrgInfoProps) {
  const [selectedAsRow, setSelectedAsRow] = useState<number | null>(null);
  const [selectedPrgCode, setSelectedPrgCode] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
  const { dispatch } = useLoading();

  // 수정사항 길이제한 설정
  const userMaxLen = (value: string) => value.length <= 10;
  const tsIDMaxLen = (value: string) => value.length <= 10;
  const tsPasswordMaxLen = (value: string) => value.length <= 12;

  // input 관련 커스텀 훅 설정
  const userMaxInput = useInput(0, userMaxLen);
  const tsIDInput = useInput("", tsIDMaxLen);
  const tsPasswordInput = useInput("", tsPasswordMaxLen);

  // input 관련 ref
  const userMaxRef = useRef<HTMLInputElement>(null);
  const tsIDRef = useRef<HTMLInputElement>(null);
  const tsPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (usedPrgItems && usedPrgItems.length > 0) {
      setSelectedAsRow(0);
    }
  }, [usedPrgItems]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tokenItem = localStorage.getItem("atKey");
      const token = tokenItem ? JSON.parse(tokenItem)?.token : null;
      const payload = parseJWT(token);
      setUserInfo(payload as UserInfo);
    }
  }, []);

  useEffect(() => {
    if (selectedAsRow !== null && usedPrgItems[selectedAsRow]) {
      const data = usedPrgItems[selectedAsRow];
      setSelectedPrgCode(data.prgCode || "");
      userMaxInput.setValue(data.userMax || "");

      if (data.tsUserInfo) {
        const [userId, password] = data.tsUserInfo.split(" - ");
        const tsUserId = userId?.trim() || "";
        const tsPassword = password?.trim() || "";

        tsIDInput.setValue(tsUserId);
        tsPasswordInput.setValue(tsPassword);
      } else {
        tsIDInput.setValue("");
        tsPasswordInput.setValue("");
      }
    }
    // eslint-disable-next-line
  }, [selectedAsRow, usedPrgItems]);

  const onPopup = () => {
    if (selectedAsRow === null) return;
    const popupComCode = usedPrgItems[selectedAsRow]?.comCode;
    const popupPrgCode = usedPrgItems[selectedAsRow]?.prgCode;
    window.open(
      `http://as.intravan.co.kr/help/HelpUserMgr.aspx?comCode=${popupComCode}&prgCode=${popupPrgCode}`,
      "_blank",
      "width=800,height=600"
    );
  };

  const onMobilePopup = () => {
    if (selectedAsRow === null) return;
    const popupComCode = usedPrgItems[selectedAsRow]?.comCode;
    const popupPrgCode = usedPrgItems[selectedAsRow]?.prgCode;
    window.open(
      `http://as.intravan.co.kr/help/HelpUserMobMgr.aspx?comCode=${popupComCode}&prgCode=${popupPrgCode}`,
      "_blank",
      "width=800,height=600"
    );
  };

  const serverBtnClick = async () => {
    if (selectedAsRow === null) {
      alert("선택된 프로그램이 없습니다.");
      return;
    }

    const comCode = usedPrgItems[selectedAsRow]?.comCode;
    const prgCode = usedPrgItems[selectedAsRow]?.prgCode;

    if (!comCode || !prgCode) {
      alert("업체코드 또는 프로그램코드가 없습니다.");
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(`/api/serverData?comCode=${comCode}&prgCode=${prgCode}`);
      const result = await response.json();

      if (result.result && result.data) {
        const data = result.data;
        const customSdate = data.customSdate.substring(0, 10) || "-";
        const customEdate = data.customEdate.substring(0, 10) || "-";
        const historySdate = data.historySdate.substring(0, 10) || "-";
        const historyEdate = data.historyEdate.substring(0, 10) || "-";

        const message =
          "1. 고객데이터:총 " +
          (data.customCnt !== null ? data.customCnt : 0) +
          "건\n" +
          customSdate +
          " ~ " +
          customEdate +
          "\n2. 매출데이터:총 " +
          (data.historyCnt !== null ? data.historyCnt : 0) +
          "건\n" +
          historySdate +
          " ~ " +
          historyEdate;
        alert(message);
      } else if (result.result && result.data === null) {
        alert("서버 데이터가 없습니다.");
      } else {
        alert(result.errMsg || "서버 데이터 조회에 실패했습니다.");
      }
    } catch (error: any) {
      alert("네트워크 오류가 발생했습니다: " + error.message);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const editBtnClick = async () => {
    if (!window.confirm("수정하시겠습니까?")) {
      return;
    }

    if (selectedAsRow === null) {
      alert("선택된 프로그램이 없습니다.");
      return;
    }

    try {
      const response = await fetch("/api/shop/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comCode: usedPrgItems[selectedAsRow]?.comCode,
          prgCode: usedPrgItems[selectedAsRow]?.prgCode,
          limit: userMaxInput.value || null,
          tsUserId: tsIDInput.value || "",
          tsPassword: tsPasswordInput.value || "",
        }),
      });

      const data = await response.json();

      if (!data.result) {
        alert(data.errMsg || "수정에 실패했습니다.");
        return;
      }

      alert("수정되었습니다.");
      window.location.reload();
    } catch (error: any) {
      alert("네트워크 오류가 발생했습니다: " + error.message);
    }
  };

  return (
    <>
      {/* PC */}
      <div className="text-[15px]">
        <div className="mt-4 hidden md:flex justify-between md:w-full md:h-[58px] md:rounded-tl-md md:rounded-tr-md md:border-[#E1E1E1] md:border-0 md:border-t md:border-x">
          <h3 className="pl-4 font-semibold text-[16px] text-[#A50A2E] my-auto">
            사용 프로그램 정보
          </h3>
          <div className="pr-4 my-auto">
            {userInfo.areaCode === "30000" &&
              (selectedPrgCode === "101" || selectedPrgCode === "202") && (
                <button
                  className="w-[102px] h-[40px] text-white rounded-md bg-[#77829B] cursor-pointer"
                  onClick={onPopup}
                >
                  사용자 관리
                </button>
              )}

            {userInfo.areaCode === "30000" &&
              (selectedPrgCode === "516" ||
                selectedPrgCode === "519" ||
                selectedPrgCode === "250") && (
                <button
                  className="w-[145px] h-[40px] ml-2 text-white rounded-md bg-[#77829B] cursor-pointer"
                  onClick={onMobilePopup}
                >
                  모바일 사용자 관리
                </button>
              )}

            {(selectedPrgCode === "100" ||
              selectedPrgCode === "101" ||
              selectedPrgCode === "105" ||
              selectedPrgCode === "201" ||
              selectedPrgCode === "202" ||
              selectedPrgCode === "204") && (
              <button
                onClick={serverBtnClick}
                className="w-[128px] h-[40px] ml-2 text-white rounded-md bg-[#77829B] cursor-pointer"
              >
                서버데이터 확인
              </button>
            )}

            {userInfo.areaCode === "30000" && (
              <button
                onClick={editBtnClick}
                className="w-[59px] h-[40px] ml-2 text-white rounded-md bg-[#A50A2E] cursor-pointer"
              >
                저장
              </button>
            )}
          </div>
        </div>
        <div className="hidden md:flex md:w-full md:h-[313px] md:rounded-bl-md md:rounded-br-md md:border-[#E1E1E1] md:border-[1px]">
          <div className="w-[50%] h-[256px] mt-3 ml-1">
            <div className="w-full h-[250px] mt-3 ml-4 rounded-md overflow-y-scroll overflow-x-hidden">
              <table className="w-full text-[14px] table-auto border-collapse border-hidden">
                <thead className="w-full h-[48px]">
                  <tr className="bg-[#F9FBFC]">
                    <th className="w-[35%] text-left p-2">프로그램</th>
                    <th className="w-[35%] text-left">청구금액</th>
                    <th className="w-[30%] text-left">사용상태</th>
                  </tr>
                </thead>
                <tbody className="w-full">
                  {usedPrgItems &&
                    usedPrgItems.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`${
                          idx === selectedAsRow ? "bg-[#FFF6F8]" : "hover:bg-[#FFF6F8]"
                        } cursor-pointer`}
                        onClick={() => setSelectedAsRow(idx)}
                      >
                        <td className="table-cell p-2">{item.prgName ?? ""}</td>
                        <td className="table-cell">
                          {item.billPrice ? item.billPrice.toLocaleString() : ""}
                        </td>
                        <td className="table-cell">{item.stateName ?? ""}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-[45%] h-[280px] mt-5 ml-8 bg-[#F9FBFC] text-[14px] rounded-md">
            <ul className="space-x-4 space-y-4 md:pt-[20px] md:w-[97%]">
              <li className="ml-4 flex justify-between items-center">
                <div className="">
                  <label className=" font-semibold">설치일자</label>
                  <label className="pl-10">
                    {truncate(
                      selectedAsRow !== null ? usedPrgItems[selectedAsRow]?.installDay || "-" : "-",
                      11
                    )}
                  </label>
                </div>
                <div className="w-1/2 pl-10 h-12">
                  {userMaxInput.value !== "" && userMaxInput.value > -1 && (
                    <>
                      <label className="font-semibold">사용대수</label>
                      <input
                        ref={userMaxRef}
                        type="text"
                        className="bg-transparent bg-white w-[100px] h-[48px] border border-[#E1E1E1] rounded-md p-[10px] ml-2 focus:outline-none text-right"
                        value={userMaxInput.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            userMaxInput.onChange(e);
                          }
                        }}
                        disabled={userInfo.areaCode !== "30000"}
                      />
                    </>
                  )}
                </div>
              </li>
              <li className="ml-4 flex justify-between items-baseline">
                <div className="w-1/2">
                  <label className=" font-semibold">담당지사</label>
                  <label className="pl-10">
                    {selectedAsRow !== null ? usedPrgItems[selectedAsRow]?.areaName || "-" : "-"}
                  </label>
                </div>
                <div className="w-1/2 pl-10">
                  <label className=" font-semibold">담당자</label>
                  <label className="pl-6">
                    {selectedAsRow !== null ? usedPrgItems[selectedAsRow]?.registMan || "-" : "-"}
                  </label>
                </div>
              </li>
              <li className="ml-4 flex justify-between">
                <div className="">
                  <label className=" font-semibold">국토부 정보</label>
                  <input
                    ref={tsIDRef}
                    className="ml-6 pl-4 bg-transparent bg-white w-[144px] h-[48px] border border-[#E1E1E1] rounded-md focus:outline-none"
                    defaultValue={tsIDInput.value}
                    onChange={tsIDInput.onChange}
                    disabled={userInfo.areaCode !== "30000"}
                  ></input>
                  <input
                    ref={tsPasswordRef}
                    className="ml-2 pl-4 bg-transparent bg-white w-[144px] h-[48px] border border-[#E1E1E1] rounded-md focus:outline-none"
                    defaultValue={tsPasswordInput.value}
                    onChange={tsPasswordInput.onChange}
                    disabled={userInfo.areaCode !== "30000"}
                  ></input>
                </div>
              </li>
              <li className="ml-4 flex">
                <label className="whitespace-nowrap font-semibold">메모</label>
                <div className="w-full h-[85px] overflow-scroll overflow-x-hidden ml-4">
                  <label className="">
                    {selectedAsRow !== null ? usedPrgItems[selectedAsRow]?.memo || "" : ""}
                  </label>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 모바일 */}
      <div className="w-[92%] h-[58px] mt-4 border-0 border-x border-t rounded-tl-md rounded-tr-md mx-auto flex justify-between md:hidden">
        <h3 className="pl-4 font-semibold text-[16px] text-[#A50A2E] my-auto">
          사용 프로그램 정보
        </h3>
      </div>
      <div className="w-[92%] h-[full] mx-auto border rounded-b-md md:hidden">
        <ul className="w-[full] pt-4 space-y-1">
          {usedPrgItems && usedPrgItems.length > 0 ? (
            usedPrgItems.map((item, idx) => (
              <ul className="cursor-pointer px-4 pb-2" key={idx}>
                <li
                  onClick={() => setSelectedAsRow(idx)}
                  className={`${
                    idx === selectedAsRow && "bg-[#FFF6F8]"
                  } w-[full] h-[48px] py-[13px] px-5 mb-4 flex justify-between text-[14px] rounded-md bg-[#F9FBFC]`}
                >
                  <div>{item.comCode ?? ""}</div>
                  <div>{truncate(item.prgName || "", 12)}</div>
                </li>
                {selectedAsRow === idx && (
                  <ul className="w-[full] space-y-2">
                    <li className="px-4 flex justify-between text-[14px] pt-4">
                      <div className="text-black font-semibold">업체코드</div>
                      <div className="font-semibold text-[#0340E6]">
                        {selectedAsRow !== null ? usedPrgItems[selectedAsRow]?.comCode : "-"}
                      </div>
                    </li>
                    <li className="px-4 flex justify-between text-[14px] pt-6">
                      <div className="text-black font-semibold">설치일자</div>
                      <div>
                        {truncate(
                          selectedAsRow !== null
                            ? usedPrgItems[selectedAsRow]?.installDay || "-"
                            : "-",
                          12
                        )}
                      </div>
                    </li>
                    <li className="px-4 flex justify-between text-[14px] pt-6">
                      <div className="text-black font-semibold">담당지사</div>
                      <div>
                        {selectedAsRow !== null ? usedPrgItems[selectedAsRow]?.areaName || "" : ""}
                      </div>
                    </li>
                    <li className="px-4 flex justify-between text-[14px] pt-6">
                      <div className="text-black font-semibold">담당자</div>
                      <div>
                        {selectedAsRow !== null ? usedPrgItems[selectedAsRow]?.registMan || "" : ""}
                      </div>
                    </li>
                    {userMaxInput.value !== "" && userMaxInput.value > -1 && (
                      <li className="px-4 flex justify-between text-[14px] pt-6">
                        <label className="font-semibold">사용대수</label>
                        <input
                          ref={userMaxRef}
                          className="mx-4 bg-transparent bg-white w-[48px] h-[48px] border border-[#E1E1E1] rounded-md pl-[16px] focus:outline-none"
                          value={userMaxInput.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              userMaxInput.onChange(e);
                            }
                          }}
                          disabled={userInfo.areaCode !== "30000"}
                        />
                      </li>
                    )}
                    <li className="px-4 flex justify-between text-[14px] pt-6">
                      <label className="font-semibold">국토부정보</label>
                    </li>
                    <div className="mx-4 flex justify-between">
                      <input
                        ref={tsIDRef}
                        className="pl-4 bg-transparent bg-white w-[48%] h-[48px] border border-[#E1E1E1] rounded-md focus:outline-none"
                        defaultValue={tsIDInput.value}
                        onChange={tsIDInput.onChange}
                        disabled={userInfo.areaCode !== "30000"}
                      />
                      <input
                        ref={tsPasswordRef}
                        className="ml-2 pl-4 bg-transparent bg-white w-[48%] h-[48px] border border-[#E1E1E1] rounded-md focus:outline-none"
                        defaultValue={tsPasswordInput.value}
                        onChange={tsPasswordInput.onChange}
                        disabled={userInfo.areaCode !== "30000"}
                      />
                    </div>
                    <li className="px-4 flex justify-between text-[14px] pt-6">
                      <label className="font-semibold">메모</label>
                    </li>
                    <div className="text-[14px] px-4 pb-2">
                      {selectedAsRow !== null ? usedPrgItems[selectedAsRow]?.memo || "-" : ""}
                    </div>

                    {userInfo.areaCode === "30000" &&
                      (selectedPrgCode === "101" || selectedPrgCode === "202") && (
                        <button
                          className="w-[33%] h-[40px] px-4 text-white rounded-md bg-[#77829B] cursor-pointer"
                          onClick={onPopup}
                        >
                          사용자 관리
                        </button>
                      )}

                    {userInfo.areaCode === "30000" &&
                      (selectedPrgCode === "516" ||
                        selectedPrgCode === "519" ||
                        selectedPrgCode === "250") && (
                        <button
                          className="w-[33%] h-[40px] ml-1 text-white rounded-md bg-[#77829B] cursor-pointer"
                          onClick={onMobilePopup}
                        >
                          모바일 사용자 관리
                        </button>
                      )}

                    {(selectedPrgCode === "100" ||
                      selectedPrgCode === "101" ||
                      selectedPrgCode === "105" ||
                      selectedPrgCode === "201" ||
                      selectedPrgCode === "202" ||
                      selectedPrgCode === "204") && (
                      <button
                        onClick={serverBtnClick}
                        className="w-[33%] h-[40px] ml-1 text-white rounded-md bg-[#77829B] cursor-pointer"
                      >
                        데이터확인
                      </button>
                    )}

                    {userInfo.areaCode === "30000" && (
                      <button
                        onClick={editBtnClick}
                        className="w-[30%] h-[40px] ml-1 text-white rounded-md bg-[#A50A2E] cursor-pointer"
                      >
                        저장
                      </button>
                    )}

                    <li
                      className="w-full h-[48px] rounded-md bg-[#F9F9F9] cursor-pointer"
                      onClick={() => setSelectedAsRow(null)}
                    >
                      <img className="mx-auto" src={"/images/icon_arrow_up.png"} alt="^" />
                    </li>
                  </ul>
                )}
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
