"use client";

import BasicInfo from "@/app/sales/components/BasicInfo";
import ReserveInfo from "@/app/sales/components/ReserveInfo";
import SaleButtons from "@/app/sales/components/SaleButtons";
import SolutionHist from "@/app/sales/components/SolutionHist";
import { useSalesDelete, useSalesUpdate, useSalesView } from "@/app/sales/hooks/useSalesView";
import { SalesInfo } from "@/app/sales/types/View";
import { useCodeList } from "@/app/shop/hooks/useCodeList";
import { useUserData } from "@/public/hooks/useUserData";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SalesView(): React.ReactElement {
    const router = useRouter();
    const params = useParams();
    const salesSerial = params.salesSerial as string;

    const [tabIndex, setTabIndex] = useState<number>(0);
    const [menuIndex, setMenuIndex] = useState<number>(0);
    const [salesInfo, setSalesInfo] = useState<SalesInfo | null>(null);

    const userData = useUserData();

    // 영업문의 상세조회
    const { data: salesData, isLoading } = useSalesView(salesSerial);

    // 지사,담당자 조회
    const { data: areaCodeData } = useCodeList("areacode");
    const { data: manCodeData } = useCodeList("sales_man", salesInfo?.salesArea || "30000");

    const areaItems = areaCodeData?.data?.items || [];
    const manItems = manCodeData?.data?.items || [];

    // 영업문의 수정
    const updateMutation = useSalesUpdate(salesSerial);

    // 영업문의 삭제
    const deleteMutation = useSalesDelete(salesSerial);

    // 영업문의 정보가 로드되면 업데이트
    useEffect(() => {
        if (salesData?.result && salesData.data) {
            setSalesInfo(salesData.data.salesInfo);
        }
    }, [salesData]);

    // 목록으로 이동
    const listClick = () => {
        router.push("/sales/List");
    };

    // 수정
    const editBtnClick = () => {
        if (!salesInfo) return;

        if (window.confirm("수정하시겠습니까?")) {
            updateMutation.mutate(
                {
                    salesSerial: salesInfo.salesSerial,
                    salesMan: salesInfo.salesMan,
                    salesArea: salesInfo.salesArea,
                    salesState: salesInfo.salesState,
                },
                {
                    onSuccess: (response) => {
                        if (response.result) {
                            alert("수정되었습니다.");
                            window.location.reload();
                        } else {
                            alert(response.errMsg || "수정에 실패했습니다.");
                        }
                    },
                    onError: (error) => {
                        alert("수정 중 오류가 발생했습니다: " + error.message);
                    },
                }
            );
        }
    };

    // 삭제
    const deleteBtnClick = () => {
        if (!userData?.userId || !userData?.areaCode) {
            alert("사용자 정보를 확인할 수 없습니다.");
            return;
        }

        if (window.confirm("삭제후에는 복원이 불가능합니다.\n삭제 하시겠습니까?")) {
            deleteMutation.mutate(
                {
                    userId: userData.userId,
                    areaCode: userData.areaCode,
                },
                {
                    onSuccess: (response) => {
                        if (response.result) {
                            alert("삭제되었습니다.");
                            router.push("/sales/List");
                        } else {
                            alert(response.errMsg || "삭제에 실패했습니다.");
                        }
                    },
                    onError: (error) => {
                        alert("삭제 중 오류가 발생했습니다: " + error.message);
                    },
                }
            );
        }
    };

    // 탭 버튼 클릭
    const basicInfoBtnClick = () => {
        setTabIndex(0);
        setMenuIndex(0);
    };

    const reserveInfoBtnClick = () => {
        setTabIndex(1);
        setMenuIndex(1);
    };

    const solutionHistBtnClick = () => {
        setTabIndex(2);
        setMenuIndex(2);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow md:pt-8 pt-4">
                <div className="max-w-6xl mx-auto mb-5">
                    <h2 className="pl-4 font-semibold text-2xl">영업문의</h2>

                    {/* 모바일 탭 */}
                    <div className="w-[92%] mx-auto h-[48px] mt-4 bg-[#F9FBFC] rounded-md md:hidden">
                        <div className="flex justify-between p-2 px-2 text-[14px]">
                            <button
                                onClick={basicInfoBtnClick}
                                className={
                                    tabIndex === 0
                                        ? "w-[23%] h-[32px] rounded-md bg-white text-[#A50A2E] font-semibold"
                                        : "w-[23%] h-[32px] rounded-md text-[#999999]"
                                }
                            >
                                기본정보
                            </button>
                            <button
                                onClick={reserveInfoBtnClick}
                                className={
                                    tabIndex === 1
                                        ? "w-[23%] h-[32px] rounded-md bg-white text-[#A50A2E] font-semibold"
                                        : "w-[23%] h-[32px] rounded-md text-[#999999]"
                                }
                            >
                                영업문의
                            </button>
                            <button
                                onClick={solutionHistBtnClick}
                                className={
                                    tabIndex === 2
                                        ? "w-[23%] h-[32px] rounded-md bg-white text-[#A50A2E] font-semibold"
                                        : "w-[23%] h-[32px] rounded-md text-[#999999]"
                                }
                            >
                                A/S접수
                            </button>
                        </div>
                    </div>

                    {/* 기본정보 */}
                    <div className={menuIndex === 0 ? "md:block" : "hidden md:block"}>
                        <BasicInfo
                            salesInfo={salesInfo}
                            listClick={listClick}
                            editBtnClick={editBtnClick}
                            deleteBtnClick={deleteBtnClick}
                        />
                    </div>

                    {/* 영업문의 */}
                    <div className={menuIndex === 1 ? "md:block" : "hidden md:block"}>
                        <ReserveInfo
                            salesInfo={salesInfo}
                            setSalesInfo={setSalesInfo}
                            areaItems={areaItems}
                            manItems={manItems}
                        />
                    </div>

                    {/* A/S접수 */}
                    <div className={menuIndex === 2 ? "md:block" : "hidden md:block"}>
                        <SolutionHist salesComPrgItems={salesData?.data?.salesComPrgItems || []} />
                    </div>

                    {/* 모바일 버튼 */}
                    <div className="m-4 mx-9 block md:hidden">
                        <SaleButtons
                            listClick={listClick}
                            editBtnClick={editBtnClick}
                            deleteBtnClick={deleteBtnClick}
                        />
                    </div>

                    {userData?.deptCode === "01" && (
                        <div className="text-center pb-10">
                            <button
                                className="w-[222px] h-[40px] text-white rounded-md bg-[#A50A2E] mt-5"
                                onClick={() => {
                                    // 영업활동 기록 페이지로 이동 (추후 구현)
                                    alert("영업활동 기록 기능은 추후 구현 예정입니다.");
                                }}
                            >
                                저장 후 영업활동 기록
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
