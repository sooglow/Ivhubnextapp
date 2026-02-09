"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseJWT } from "@/public/utils/utils";
import { userInfo as UserInfo } from "@/public/types/user";
import { useShopView } from "@/app/shop/hooks/useShopView";
import { useLoading } from "@/public/contexts/LoadingContext";
import BasicInfo from "@/app/shop/components/BasicInfo";
import ShopAskHist from "@/app/shop/components/ShopAskHist";
import AsHist from "@/app/shop/components/AsHist";
import UsePrgInfo from "@/app/shop/components/UsePrgInfo";

interface Props {
    params: Promise<{ comCode: string }>;
}

export default function ShopView({ params }: Props) {
    const router = useRouter();
    const { dispatch } = useLoading();
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [comCode, setComCode] = useState<string>("");
    const [tabIndex, setTabIndex] = useState(0);
    const [menuIndex, setMenuIndex] = useState(0);

    // React Query로 데이터 조회
    const { data: queryData, isLoading } = useShopView(comCode);
    const shopDetail = queryData?.data || null;
    const shop = shopDetail?.comInfo || null;

    // SSO 관련 state
    const [ssoLoading, setSsoLoading] = useState(false);
    const [ssoRes, setSsoRes] = useState<any>(null);
    const [ssoError, setSsoError] = useState<Error | null>(null);

    // 이벤트 핸들러
    const listClick = () => {
        router.push("/shop/List");
    };

    const editClick = () => {
        // 수정 기능은 추후 구현
        alert("수정 기능은 추후 구현 예정입니다.");
    };

    const aiBtnClick = () => {
        if (
            window.confirm(
                "AI 업체 요약 기능은 다수 시간이 소요되며 클라이언트 솔루션 이용업체에 대한 분석은 불가능합니다.\n\n예상소요시간 : 1~2분\n\n계속 진행 하시겠습니까?"
            )
        ) {
            // AI 업체 요약 기능은 추후 구현
            alert("AI 업체 요약 기능은 추후 구현 예정입니다.");
        }
    };

    const jmtBtnClick = async () => {
        if (!shop?.comCode) {
            alert("업체 정보가 없습니다.");
            return;
        }

        setSsoLoading(true);
        setSsoError(null);

        try {
            const response = await fetch(`/api/sso?comCode=${shop.comCode}`);
            const data = await response.json();
            setSsoRes({ data });
        } catch (error) {
            setSsoError(error as Error);
        } finally {
            setSsoLoading(false);
        }
    };

    const saveBtnClick = (comCode: string, comName: string) => {
        // 영업활동 기록 기능은 추후 구현
        alert("영업활동 기록 기능은 추후 구현 예정입니다.");
    };

    // 모바일 탭 버튼 클릭 핸들러
    const basicInfoBtnClick = () => {
        setTabIndex(0);
        setMenuIndex(0);
    };

    const shopAskBtnClick = () => {
        setTabIndex(1);
        setMenuIndex(1);
    };

    const asHistBtnClick = () => {
        setTabIndex(2);
        setMenuIndex(2);
    };

    const usePrgBtnClick = () => {
        setTabIndex(3);
        setMenuIndex(3);
    };

    // shortInfo 생성
    const shortInfo = shop
        ? `업체코드: ${shop.comCode}\n담당자: ${shop.areaName}\n상호: ${
              shop.comName
          }\n사업자등록번호: ${shop.idno}\n대표자: ${shop.boss}\n전화번호: ${
              shop.tel || shop.hp
          }\n주소: ${shop.address}`
        : "";

    // 관리자 여부 확인 (deptCode가 "03"이면 관리자)
    const isAdmin = userInfo?.deptCode === "03";

    // URL 파라미터에서 comCode 가져오기
    useEffect(() => {
        const getComCode = async () => {
            const resolvedParams = await params;
            setComCode(resolvedParams.comCode);
        };
        getComCode();
    }, [params]);

    // 사용자 정보 로드
    useEffect(() => {
        if (typeof window !== "undefined") {
            const tokenItem = localStorage.getItem("atKey");
            const token = tokenItem ? JSON.parse(tokenItem)?.token : null;
            const payload = parseJWT(token);
            setUserInfo(payload as UserInfo);
        }
    }, []);

    // 로딩 상태 관리
    useEffect(() => {
        dispatch({ type: "SET_LOADING", payload: isLoading });

        return () => {
            dispatch({ type: "SET_LOADING", payload: false });
        };
    }, [isLoading, dispatch]);

    // 에러 처리
    useEffect(() => {
        if (queryData && !queryData.result) {
            alert(queryData.errMsg || "데이터를 불러오는 중 오류가 발생했습니다.");
        }
    }, [queryData]);

    // SSO 응답 처리
    useEffect(() => {
        if (ssoError) {
            alert("Network error: " + ssoError.message);
            return;
        }

        if (ssoRes) {
            if (!ssoRes.data.result) {
                alert(ssoRes.data.errMsg);
                return;
            }

            const ssoToken = encodeURIComponent(ssoRes.data.data);
            const jmtUrl = `https://jmt.intravan.co.kr/Config/${shop?.comCode}?serviceKey=${ssoToken}`;
            window.open(jmtUrl, "_blank", "noopener,noreferrer");

            // 상태 초기화
            setSsoRes(null);
        }
    }, [ssoRes, ssoError, shop?.comCode]);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto px-4 pb-10">
                    <h2 className="md:pl-4 pl-0 font-semibold text-2xl md:py-8 py-4">업체관리</h2>

                    {/* 모바일 탭 버튼 */}
                    <div className="w-full h-[48px] bg-[#F9FBFC] rounded-md md:hidden">
                        <div className="flex justify-between p-2 px-2 text-[14px]">
                            <button
                                onClick={basicInfoBtnClick}
                                className={
                                    tabIndex === 0
                                        ? "w-[23%] h-[32px] bg-white rounded-md text-[#A50A2E] font-semibold shadow-sm"
                                        : "w-[23%] h-[32px] rounded-md text-[#999999]"
                                }
                            >
                                기본정보
                            </button>
                            <button
                                onClick={shopAskBtnClick}
                                className={
                                    tabIndex === 1
                                        ? "w-[23%] h-[32px] bg-white rounded-md text-[#A50A2E] font-semibold shadow-sm"
                                        : "w-[23%] h-[32px] rounded-md text-[#999999]"
                                }
                            >
                                영업문의
                            </button>
                            <button
                                onClick={asHistBtnClick}
                                className={
                                    tabIndex === 2
                                        ? "w-[23%] h-[32px] bg-white rounded-md text-[#A50A2E] font-semibold shadow-sm"
                                        : "w-[23%] h-[32px] rounded-md text-[#999999]"
                                }
                            >
                                A/S접수
                            </button>
                            <button
                                onClick={usePrgBtnClick}
                                className={
                                    tabIndex === 3
                                        ? "w-[23%] h-[32px] bg-white rounded-md text-[#A50A2E] font-semibold shadow-sm"
                                        : "w-[23%] h-[32px] rounded-md text-[#999999]"
                                }
                            >
                                프로그램
                            </button>
                        </div>
                    </div>

                    <div className={menuIndex === 0 ? "md:block" : "hidden md:block"}>
                        <BasicInfo
                            shop={shop}
                            shortInfo={shortInfo}
                            aiBtnClick={aiBtnClick}
                            listClick={listClick}
                            jmtBtnClick={jmtBtnClick}
                            saveBtnClick={saveBtnClick}
                        />
                    </div>

                    <div className={menuIndex === 1 ? "md:block" : "hidden md:block"}>
                        <ShopAskHist salesItems={shopDetail?.salesItems || []} />
                    </div>

                    <div className={menuIndex === 2 ? "md:block" : "hidden md:block"}>
                        <AsHist asHistItems={shopDetail?.asHistItems || []} />
                    </div>

                    <div className={menuIndex === 3 ? "md:block" : "hidden md:block"}>
                        <UsePrgInfo usedPrgItems={shopDetail?.usedPrgItems || []} />
                    </div>
                </div>
            </main>
        </div>
    );
}
