"use client";

import React, { useEffect, useState } from "react";
import { parseJWT } from "@/public/utils/utils";
import { userInfo as UserInfo } from "@/public/types/user";
import KakaoMap from "./KakaoMap";
import { BasicInfoProps } from "@/app/shop/types/View";

export default function BasicInfo({
  shop,
  shortInfo,
  aiBtnClick,
  listClick,
  jmtBtnClick,
  saveBtnClick,
}: BasicInfoProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

  const startNavigation = () => {
    if (
      window.confirm("카카오네비앱이 설치된 경우 목적지로 설정이 가능합니다. \n계속하시겠습니까?")
    ) {
      // @ts-ignore
      if (window.Kakao && window.Kakao.Navi) {
        // @ts-ignore
        window.Kakao.Navi.start({
          name: shop.comName,
          x: shop.lon,
          y: shop.lat,
          coordType: "wgs84",
        });
      }
    }
  };

  const openNaverMap = () => {
    const appName = "kr.co.intravan.ivhub";
    const url = `nmap://route/public?slat=&slng=&sname=&dlat=${shop.lat}&dlng=${
      shop.lon
    }&dname=${encodeURIComponent(shop.comName)}&appname=${appName}`;

    window.open(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("클립보드에 복사되었습니다.");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tokenItem = localStorage.getItem("atKey");
      const token = tokenItem ? JSON.parse(tokenItem)?.token : null;
      const payload = parseJWT(token);
      setUserInfo(payload as UserInfo);
    }
  }, []);
  return (
    <>
      {/* 헤더 영역 */}
      <div className="w-[92%] h-[58px] mx-auto mt-4 md:mt-0 flex justify-between rounded-tl-md rounded-tr-md border-[#E1E1E1] md:w-full md:h-[58px] md:mx-0 md:rounded-tl-md md:rounded-tr-md md:border-[#E1E1E1] border-x border-t border-0">
        <p className="pl-4 md:pl-4 font-semibold text-[16px] text-[#A50A2E] my-auto">
          업체기본정보
        </p>
        <div className="pr-4 my-auto hidden md:block">
          {shortInfo && (
            <button
              className="w-[122px] h-[40px] rounded-md text-white bg-[#77829B] cursor-pointer"
              onClick={() => copyToClipboard(shortInfo)}
            >
              정보요약
            </button>
          )}

          {aiBtnClick && (
            <button
              className="w-[122px] h-[40px] ml-2 text-white rounded-md bg-[#77829B] cursor-pointer"
              onClick={aiBtnClick}
            >
              AI 업체요약
            </button>
          )}

          {jmtBtnClick && (
            <button
              className="w-[152px] h-[40px] ml-2 text-white rounded-md bg-[#77829B] cursor-pointer"
              onClick={jmtBtnClick}
            >
              정비맛집 관리자
            </button>
          )}

          {saveBtnClick && userInfo.deptCode === "01" && (
            <button
              className="w-[122px] h-[40px] ml-2 text-white rounded-md bg-[#77829B] cursor-pointer"
              onClick={() => saveBtnClick(shop.comCode, shop.comName)}
            >
              영업활동 기록
            </button>
          )}

          {listClick && (
            <button
              className="w-[122px] h-[40px] ml-2 text-white rounded-md bg-[#A50A2E] cursor-pointer"
              onClick={listClick}
            >
              목록으로
            </button>
          )}
        </div>
      </div>

      {/* 데스크톱 내용 영역 */}
      <div className="md:w-full md:rounded-bl-md md:rounded-br-md md:border-[#E1E1E1] md:border hidden md:block">
        <div className="mx-auto">
          <ul className="space-y-6 md:pl-8 md:mt-[40px] md:w-full md:text-sm">
            <li className="flex justify-between items-center">
              <div className="w-1/4">
                <label className="font-semibold">업체코드</label>
              </div>
              <div className="w-1/2">
                <label className="font-semibold text-[#0340E6]">{shop?.comCode ?? ""}</label>

                <i
                  className="fa-regular fa-copy cursor-pointer pl-2 text-[18px]"
                  onClick={() => copyToClipboard(shop?.comCode ?? "")}
                ></i>
              </div>

              <div className="w-1/4">
                <label className="font-semibold">담당자 (지사)</label>
              </div>
              <div className="w-1/2">
                <label>{shop?.registMan ?? ""}</label>
                <label className="pl-2">{"(" + (shop?.areaName ?? "") + ")"}</label>
              </div>
            </li>

            <li className="flex justify-between items-center">
              <div className="w-1/4">
                <label className="font-semibold">상호</label>
              </div>
              <div className="w-1/2">
                <label>{shop?.comName ?? ""}</label>
                <i
                  className="fa-regular fa-copy cursor-pointer pl-2 text-[18px]"
                  onClick={() => copyToClipboard(shop?.comName ?? "")}
                ></i>
              </div>
              <div className="w-1/4">
                <label className="font-semibold">사업자등록번호</label>
              </div>
              <div className="w-1/2">
                <label>{shop?.idno ?? ""}</label>
                <i
                  className="fa-regular fa-copy cursor-pointer pl-2 text-[18px]"
                  onClick={() => copyToClipboard(shop?.idno ?? "")}
                ></i>
              </div>
            </li>

            <li className="flex justify-between items-center">
              <div className="w-1/4">
                <label className="font-semibold">대표자</label>
              </div>
              <div className="w-1/2">
                <label>{shop?.boss ?? ""}</label>
              </div>

              <div className="w-1/4">
                <label className="font-semibold">전화번호</label>
              </div>
              <div className="w-1/2">
                <label>
                  <label className="text-[#0340E6] font-semibold">tel:</label>
                  {shop?.tel ? shop?.tel : "-"}
                </label>
                <label className="pl-3">
                  <label className="text-[#0340E6] font-semibold">hp:</label>
                  {shop?.hp ? shop?.hp : "-"}
                </label>
              </div>
            </li>

            <li className="flex justify-between items-center">
              <div className="w-1/4 flex justify-between">
                <label className="font-semibold">체인점</label>
              </div>
              <div className="w-1/2">
                <label>{shop?.homeName ? shop?.homeName : "-"}</label>
              </div>
              <div className="w-1/4">
                <label className="font-semibold">팩스번호</label>
              </div>
              <div className="w-1/2">
                <label>{shop?.fax ? shop?.fax : "-"}</label>
              </div>
            </li>

            <li className="w-full flex justify-between items-center">
              <div className="w-1/4">
                <label className="font-semibold">주소</label>
              </div>
              <div className="w-full pr-[560px]">
                <label>{shop?.address ? shop?.address : "-"}</label>
                {shop?.address ? (
                  <i
                    className="fa-regular fa-copy cursor-pointer pl-2 text-[18px]"
                    onClick={() => copyToClipboard(shop?.address ?? "")}
                  ></i>
                ) : null}
              </div>
            </li>

            <li className="flex justify-between">
              <div className="w-1/4">
                <label className="font-semibold">특별관리업체메모</label>
              </div>
              <div className="w-1/2">
                <label>{shop?.vipComMemo ? shop?.vipComMemo : "-"}</label>
              </div>
              <div className="w-1/4">
                <label className="font-semibold">주의요지업체메모</label>
              </div>
              <div className="w-1/2">
                <label>{shop?.blackComMemo ? shop?.blackComMemo : "-"}</label>
              </div>
            </li>

            <li className="flex justify-between">
              <div className="w-1/4">
                <label className="font-semibold">대표자_HP</label>
              </div>
              <div className="w-1/2">
                <label>{shop?.hp01 ? shop?.hp01 : "-"}</label>
              </div>
              <div className="w-1/4">
                <label className="font-semibold">경리담당_HP</label>
              </div>
              <div className="w-1/2">
                <label>{shop?.hp02 ? shop?.hp02 : "-"}</label>
              </div>
            </li>

            <li className="flex justify-between">
              <div className="w-1/4">
                <label className="font-semibold">담당자1_HP</label>
              </div>
              <div className="w-1/2">
                <label>{shop?.hp03 ? shop?.hp03 : "-"}</label>
              </div>
              <div className="w-1/4">
                <label className="font-semibold">담당자2_HP</label>
              </div>
              <div className="w-1/2">
                <label>{shop?.hp04 ? shop?.hp04 : "-"}</label>
              </div>
            </li>

            {shop?.lat ? (
              <li className="flex text-[14px]">
                <div className="text-black font-semibold">
                  <label className="font-semibold">업체 목적지 설정</label>
                </div>
                <div className="pl-[78px]">
                  <button
                    className="w-[48px] h-[48px] ml-2 rounded-xl bg-[#F2FDFF] shadow-md cursor-pointer"
                    onClick={startNavigation}
                  >
                    <img
                      src="/images/button_kakao map.png"
                      alt="카카오네비"
                      className="w-full h-full object-contain"
                    />
                  </button>
                  <button
                    className="w-[48px] h-[48px] ml-2 rounded-xl bg-[#F2FDFF] shadow-md cursor-pointer"
                    onClick={() =>
                      window.open(
                        `http://map.naver.com/index.nhn?enc=utf8&level=2&lng=${
                          shop?.lon ?? ""
                        }&lat=${shop?.lat ?? ""}&pinTitle=${shop?.comName ?? ""}&pinType=SITE`
                      )
                    }
                  >
                    <img
                      src="/images/button_naver map.jpg"
                      alt="네이버"
                      className="w-full h-full object-contain"
                    />
                  </button>
                </div>
              </li>
            ) : (
              ""
            )}

            <li className="flex justify-between">
              <div className="w-1/2 flex justify-between">
                <div className="w-1/2">
                  <label className="font-semibold">업체 지도</label>
                </div>
              </div>
            </li>

            <li className="pt-2 pb-8">
              {shop?.lat && shop?.lon ? <KakaoMap lat={shop.lat} lon={shop.lon} /> : ""}
            </li>
          </ul>
        </div>
      </div>

      {/* 모바일 내용 영역 */}
      <div className="w-[92%] h-[full] mx-auto border border-[#E1E1E1] rounded-b-md md:hidden">
        <ul className="w-[full] px-4 pt-3 space-y-2">
          <li className="flex-row justify-between">
            <label className="w-full font-semibold text-[16px]">
              {shop?.comName ?? ""}
              <img
                src={"/img/icon_copy.png"}
                alt="copy"
                className="w-[32px] h-[32px] inline cursor-pointer ml-2"
                onClick={() => copyToClipboard(shop?.comCode ?? "")}
              />
            </label>
          </li>
          <li className="pt-[19px] flex justify-between text-[14px]">
            <div className="text-[#0340E6] font-semibold">{shop?.comCode ?? ""}</div>
            <div>{shop?.areaName ?? ""}</div>
          </li>
          <li className="pt-[30px] flex justify-between text-[14px]">
            <div className="text-black font-semibold">사업자등록번호</div>
            <div>{shop?.idno ?? ""}</div>
          </li>
          <li className="pt-4 flex justify-between text-[14px]">
            <div className="text-black font-semibold">대표자</div>
            <div>{shop?.boss ?? ""}</div>
          </li>
          <li className="pt-4 flex justify-between text-[14px]">
            <div className="text-black font-semibold">전화번호</div>
            <div>{shop?.tel ?? ""}</div>
          </li>
          <li className="pt-4 flex justify-between text-[14px]">
            <div className="text-black font-semibold">체인점</div>
            <div>{shop?.homeName ? shop?.homeName : "-"}</div>
          </li>
          <li className="pt-4 flex justify-between text-[14px]">
            <div className="text-black font-semibold">팩스번호</div>
            <div>{shop?.fax ? shop?.fax : "-"}</div>
          </li>
          <li className="pt-4 flex justify-between text-[14px]">
            <div className="text-black font-semibold">주소</div>
          </li>
          <li className="flex justify-between text-[14px]">
            <div>{shop?.address ? shop?.address : "-"}</div>
          </li>
          <li className="pt-4 flex justify-between text-[14px]">
            <div className="text-black font-semibold">특별관리업체 메모</div>
          </li>
          <li className="flex justify-between text-[14px]">
            <div>{shop?.vipComMemo ? shop?.vipComMemo : "-"}</div>
          </li>
          <li className="pt-4 flex justify-between text-[14px]">
            <div className="text-black font-semibold">주의요지업체 메모</div>
          </li>
          <li className="flex justify-between text-[14px]">
            <div>{shop?.blackComMemo ? shop?.blackComMemo : "-"}</div>
          </li>
          <li className="pt-4 flex justify-between text-[14px]">
            <div className="text-black font-semibold">대표자 H·P</div>
            <div>{shop?.hp01 ? shop?.hp01 : "-"}</div>
          </li>
          <li className="pt-4 flex justify-between text-[14px]">
            <div className="text-black font-semibold">경리담당 H·P</div>
            <div>{shop?.hp02 ? shop?.hp02 : "-"}</div>
          </li>
          <li className="pt-4 flex justify-between text-[14px]">
            <div className="text-black font-semibold">담당자1 H·P</div>
            <div>{shop?.hp03 ? shop?.hp03 : "-"}</div>
          </li>
          <li className="pt-4 flex justify-between text-[14px]">
            <div className="text-black font-semibold">담당자2 H·P</div>
            <div>{shop?.hp04 ? shop?.hp04 : "-"}</div>
          </li>
          {shop?.lat ? (
            <li className="pt-4 flex justify-between text-[14px] pb-4">
              <div className="text-black font-semibold">
                <label className="font-semibold">업체 목적지 설정</label>
              </div>
              <div className="flex">
                <button
                  className="w-[48px] h-[48px] rounded-xl bg-[#F2FDFF] shadow-md cursor-pointer"
                  onClick={startNavigation}
                >
                  <img
                    src="/images/button_kakao map.png"
                    alt="카카오네비"
                    className="w-full h-full object-contain"
                  />
                </button>
                <button
                  className="w-[48px] h-[48px] ml-2 rounded-xl bg-[#F2FDFF] shadow-md cursor-pointer"
                  onClick={openNaverMap}
                >
                  <img
                    src="/images/button_naver map.jpg"
                    alt="네이버"
                    className="w-full h-full object-contain"
                  />
                </button>
              </div>
            </li>
          ) : (
            ""
          )}
        </ul>
      </div>
    </>
  );
}
