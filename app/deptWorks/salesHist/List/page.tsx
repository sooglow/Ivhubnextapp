"use client";

import { useState, useEffect } from "react";
import { useInput } from "@/public/hooks/useInput";
import { parseJWT } from "@/public/utils/utils";
import SearchSection from "../components/SearchSection";
import SalesInquirySection from "../components/SalesInquirySection";
import ExpandSection from "../components/ExpandSection";
import CustomerSection from "../components/CustomerSection";
import CreateSalesHistModal from "../components/CreateSalesHistModal";
import UpdateSalesHistModal from "../components/UpdateSalesHistModal";
import {
    useSalesInquiryList,
    useUpdateSalesState,
    useExpandActivityList,
    useCustomerActivityList,
} from "../hooks/useSalesHist";
import { SalesInquiryItem } from "../types/List";
import { SalesActivityItem } from "../types/Activity";

export default function SalesHistList() {
    const [userInfo, setUserInfo] = useState<any>({});
    const [isMobile, setIsMobile] = useState(false);

    // 날짜 상태
    const getFormattedDate = (date: Date) => date.toISOString().split("T")[0];
    const currentDate = new Date();
    const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);

    const [saleDay1, setSaleDay1] = useState(getFormattedDate(threeMonthsAgo));
    const [saleDay2, setSaleDay2] = useState(getFormattedDate(currentDate));

    // 관리자 필터 상태
    const [areaCode, setAreaCode] = useState("");
    const [salesMan, setSalesMan] = useState("");

    // 페이지네이션 상태 (0-based for API, display as 1-based)
    const [expandCurrentPage, setExpandCurrentPage] = useState(0);
    const [customerCurrentPage, setCustomerCurrentPage] = useState(0);

    // 영업문의 expand 상태
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    // 모달 상태
    const [createOpen, setCreateOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<SalesActivityItem | null>(null);
    const [selectedInquiry, setSelectedInquiry] = useState<SalesInquiryItem | null>(null);

    // 검색 input
    const keywordInput = useInput("", (value: string) => value.length <= 50);

    // React Query hooks
    const { data: inquiryData, isLoading: inquiryLoading } = useSalesInquiryList();
    const updateSalesStateMutation = useUpdateSalesState();

    const {
        data: expandData,
        isLoading: expandLoading,
        refetch: refetchExpand,
    } = useExpandActivityList({
        areaCode: userInfo.areaCode || "",
        userId: salesMan || userInfo.userId || "",
        saleDay1,
        saleDay2,
        keyword: keywordInput.value,
        pageNumber: expandCurrentPage + 1, // API expects 1-based
        pageSize: 3,
    });

    const {
        data: customerData,
        isLoading: customerLoading,
        refetch: refetchCustomer,
    } = useCustomerActivityList({
        areaCode: userInfo.areaCode || "",
        userId: salesMan || userInfo.userId || "",
        saleDay1,
        saleDay2,
        keyword: keywordInput.value,
        pageNumber: customerCurrentPage + 1, // API expects 1-based
        pageSize: 3,
    });

    // 초기화 및 반응형 체크
    useEffect(() => {
        const token = localStorage.getItem("atKey");
        if (token) {
            try {
                const payload = parseJWT(JSON.parse(token).token);
                setUserInfo(payload);
                setAreaCode(payload.areaCode || "");
            } catch (error) {
                console.error("Token parse error:", error);
            }
        }

        // 반응형 체크
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // 페이지 변경 시 데이터 다시 가져오기
    useEffect(() => {
        if (userInfo.userId) {
            refetchExpand();
            refetchCustomer();
        }
    }, [expandCurrentPage, customerCurrentPage, salesMan, userInfo.userId]);

    // 검색 핸들러
    const handleSearch = () => {
        setExpandCurrentPage(0);
        setCustomerCurrentPage(0);
        refetchExpand();
        refetchCustomer();
    };

    // 초기화 핸들러
    const handleReset = () => {
        keywordInput.setValue("");

        const newCurrentDate = new Date();
        const newThreeMonthsAgo = new Date(
            newCurrentDate.getFullYear(),
            newCurrentDate.getMonth() - 3,
            1
        );

        setSaleDay1(getFormattedDate(newThreeMonthsAgo));
        setSaleDay2(getFormattedDate(newCurrentDate));
        setExpandCurrentPage(0);
        setCustomerCurrentPage(0);
    };

    // Enter 키 핸들러
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // 작성하기 버튼
    const handleCreateClick = () => {
        setSelectedInquiry(null);
        setCreateOpen(true);
    };

    // 신규 버튼 (영업문의에서)
    const handleCreateFromInquiry = (inquiry: SalesInquiryItem) => {
        setSelectedInquiry(inquiry);
        setCreateOpen(true);
    };

    // 영업활동 클릭 (수정 모달)
    const handleActivityClick = (activity: SalesActivityItem) => {
        setSelectedActivity(activity);
        setUpdateOpen(true);
    };

    // 영업문의 expand toggle
    const handleToggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    // 영업문의 상태 변경
    const handleStateChange = (index: number, newState: string, item: SalesInquiryItem) => {
        updateSalesStateMutation.mutate({
            salesSerial: item.salesSerial,
            salesMan: item.salesMan,
            salesArea: item.salesArea || "",
            salesState: newState,
        });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto pb-20">
                    <h2 className="pl-4 font-semibold text-2xl py-4 md:py-8">영업활동</h2>

                    {/* 검색 섹션 */}
                    <SearchSection
                        keywordValue={keywordInput.value}
                        onKeywordChange={keywordInput.onChange}
                        onKeyPress={handleKeyPress}
                        saleDay1={saleDay1}
                        saleDay2={saleDay2}
                        onSaleDay1Change={setSaleDay1}
                        onSaleDay2Change={setSaleDay2}
                        onSearch={handleSearch}
                        onReset={handleReset}
                        loading={inquiryLoading || expandLoading || customerLoading}
                    />

                    {/* 작성하기 버튼 */}
                    <div className="pt-5 pl-4 md:pt-5 md:pl-4">
                        <button
                            onClick={handleCreateClick}
                            className="w-[115px] h-10 bg-[#77829B] text-[#FFFFFF] rounded-[5px] text-[14px] md:w-[115px] md:h-10"
                        >
                            작성하기
                        </button>
                    </div>

                    {/* 영업문의 목록 섹션 */}
                    <SalesInquirySection
                        lists={inquiryData?.data?.items || []}
                        loading={inquiryLoading}
                        expandedIndex={expandedIndex}
                        onToggleExpand={handleToggleExpand}
                        onStateChange={handleStateChange}
                        onCreateFromInquiry={handleCreateFromInquiry}
                        isMobile={isMobile}
                    />

                    {/* 관리자 전용: 지사/담당자 필터 */}
                    {userInfo.userPower === "0" && (
                        <div className="w-full h-[100px] bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[80px] flex items-center mt-6 text-[14px]">
                            <div className="pl-6">
                                <label className="font-semibold">지사</label>
                                <select
                                    value={areaCode}
                                    onChange={(e) => setAreaCode(e.target.value)}
                                    className="ml-2 h-12 w-28 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[150px] md:h-12 md:bg-white"
                                >
                                    <option value="" disabled>
                                        선택
                                    </option>
                                </select>
                            </div>
                            <div className="pl-4 text-[14px]">
                                <div className="flex items-baseline">
                                    <label className="font-semibold">담당자</label>
                                    <select
                                        value={salesMan}
                                        onChange={(e) => setSalesMan(e.target.value)}
                                        className="ml-2 h-12 w-28 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[150px] md:h-12 md:bg-white"
                                    >
                                        <option value="" disabled>
                                            선택
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 성장 및 확장 활동 섹션 */}
                    <ExpandSection
                        lists={expandData?.data?.items || []}
                        loading={expandLoading}
                        currentPage={expandCurrentPage}
                        totalCount={expandData?.data?.totalCount || 0}
                        pageSize={3}
                        onPageChange={setExpandCurrentPage}
                        onItemClick={handleActivityClick}
                    />

                    {/* 고객 지원 및 관리 활동 섹션 */}
                    <CustomerSection
                        lists={customerData?.data?.items || []}
                        loading={customerLoading}
                        currentPage={customerCurrentPage}
                        totalCount={customerData?.data?.totalCount || 0}
                        pageSize={3}
                        onPageChange={setCustomerCurrentPage}
                        onItemClick={handleActivityClick}
                    />

                    {/* 모달 */}
                    <CreateSalesHistModal
                        open={createOpen}
                        setOpen={setCreateOpen}
                        selectedInquiry={selectedInquiry}
                    />
                    <UpdateSalesHistModal
                        open={updateOpen}
                        setOpen={setUpdateOpen}
                        selectedActivity={selectedActivity}
                    />
                </div>
            </main>
        </div>
    );
}
