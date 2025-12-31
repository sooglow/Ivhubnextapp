"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useInput } from "@/public/hooks/useInput";
import { useLoading } from "@/public/contexts/LoadingContext";
import { useInnoAnalytics } from "../hooks/useInnoAnalytics";

// Chart.js 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function InnoAnalyticsView() {
    const { dispatch } = useLoading();

    const getFormattedDate = (date: Date) => date.toISOString().split("T")[0];
    const currentDate = new Date();
    const oneMonthDate = new Date(currentDate);
    oneMonthDate.setMonth(oneMonthDate.getMonth() - 1);

    const [sday, setSday] = useState(getFormattedDate(oneMonthDate));
    const [eday, setEday] = useState(getFormattedDate(new Date()));

    // input 관련 커스텀 훅 설정
    const sdayInput = useInput(getFormattedDate(oneMonthDate), (value) => value.length <= 50);
    const edayInput = useInput(getFormattedDate(new Date()), (value) => value.length <= 50);

    const { data: queryData, isLoading, error, refetch } = useInnoAnalytics({ sday, eday });

    const asData = queryData?.data || {
        itemsA: [],
        itemsB: [],
        itemsC: [],
        itemsD: [],
        itemsE: [],
        itemsF: { orderCount: 0, orderPrice: 0 },
    };

    // 로딩 상태 관리
    useEffect(() => {
        dispatch({ type: "SET_LOADING", payload: isLoading });
    }, [isLoading, dispatch]);

    useEffect(() => {
        if (error) {
            alert("Network error: " + error.message);
        }
    }, [error]);

    const searchClick = () => {
        setSday(sdayInput.value);
        setEday(edayInput.value);
    };

    const initClick = () => {
        const newSday = getFormattedDate(oneMonthDate);
        const newEday = getFormattedDate(new Date());
        sdayInput.setValue(newSday);
        edayInput.setValue(newEday);
        setSday(newSday);
        setEday(newEday);
    };

    const handleDateChange = (direction: "prev" | "next") => {
        const currentStartDate = new Date(sday);
        const currentEndDate = new Date(eday);

        if (direction === "prev") {
            const prevStartDate = new Date(
                currentStartDate.setMonth(currentStartDate.getMonth() - 1)
            );
            const prevEndDate = new Date(currentEndDate.setMonth(currentEndDate.getMonth() - 1));
            const newSday = getFormattedDate(prevStartDate);
            const newEday = getFormattedDate(prevEndDate);
            setSday(newSday);
            setEday(newEday);
            sdayInput.setValue(newSday);
            edayInput.setValue(newEday);
        } else if (direction === "next") {
            const nextStartDate = new Date(
                currentStartDate.setMonth(currentStartDate.getMonth() + 1)
            );
            const nextEndDate = new Date(currentEndDate.setMonth(currentEndDate.getMonth() + 1));
            const newSday = getFormattedDate(nextStartDate);
            const newEday = getFormattedDate(nextEndDate);
            setSday(newSday);
            setEday(newEday);
            sdayInput.setValue(newSday);
            edayInput.setValue(newEday);
        }
    };

    // 업체별 총 주문액 Top 10 차트 데이터
    const orderToptenData = {
        datasets: [
            {
                label: "주문액",
                data: asData.itemsA?.map((item) => ({ x: item.x, y: item.y })) || [],
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "#A50A2E",
            },
        ],
    };

    const orderToptenOptions = {
        maintainAspectRatio: false,
        indexAxis: "x" as const,
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "업체별 총 주문액 Top 10",
                font: {
                    size: 16,
                },
            },
            datalabels: {
                display: false,
            },
        },
    };

    // 담당지사별 주문 현황 차트 데이터
    const areaOrderData = {
        datasets: [
            {
                label: "주문건수",
                data:
                    asData.itemsB
                        ?.map((item) => ({ x: item.x, y: item.y }))
                        .sort((a, b) => b.y - a.y) || [],
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "#A50A2E",
            },
        ],
    };

    const areaOrderOptions = {
        maintainAspectRatio: false,
        indexAxis: "x" as const,
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "담당지사별 주문 현황",
                font: {
                    size: 16,
                },
            },
            datalabels: {
                display: false,
            },
        },
    };

    // 영어 요일을 한글로 변환하는 함수
    const translateDayToKorean = (day: string): string => {
        const dayMap: { [key: string]: string } = {
            Sunday: "일요일",
            Monday: "월요일",
            Tuesday: "화요일",
            Wednesday: "수요일",
            Thursday: "목요일",
            Friday: "금요일",
            Saturday: "토요일",
        };
        return dayMap[day] || day;
    };

    // 요일별 주문 추이 차트 데이터
    const orderTimeData = {
        datasets: [
            {
                label: "건수",
                data: asData.itemsC?.map((item) => ({ x: translateDayToKorean(item.x), y: item.y })) || [],
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "#A50A2E",
            },
        ],
    };

    const orderTimeOptions = {
        maintainAspectRatio: false,
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "요일별 주문 추이",
                font: {
                    size: 16,
                },
            },
            datalabels: {
                display: false,
            },
        },
    };

    // 상품명별 판매 현황 차트 데이터
    const itemHistData = {
        datasets: [
            {
                label: "상품명별 판매 현황",
                data: asData.itemsD?.map((item) => ({ x: item.y, y: item.x })) || [],
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "#A50A2E",
            },
        ],
    };

    const itemHistOptions = {
        maintainAspectRatio: false,
        indexAxis: "y" as const,
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "상품명별 판매 현황",
                font: {
                    size: 16,
                },
            },
            datalabels: {
                display: false,
            },
        },
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto pb-20">
                    <h2 className="pl-4 font-semibold text-2xl py-4 md:py-8">이노몰 이용 현황</h2>

                    {/* 데스크톱 검색 섹션 */}
                    <div className="w-full h-[150px] bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[140px] md:flex md:items-center hidden">
                        <div className="w-full pt-6 pl-4 md:pt-0 md:pl-6">
                            <div className="flex">
                                <label className="my-auto md:pb-3 pt-2 text-[14px] font-semibold hidden md:block">
                                    조회기간
                                </label>
                                <input
                                    type="date"
                                    className="w-[44.5%] h-12 md:w-[15%] ml-2 md:ml-3 bg-white border border-[#E1E1E1] rounded-md pl-4 pr-3 appearance-none focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm hidden md:block"
                                    value={sdayInput.value}
                                    onChange={sdayInput.onChange}
                                />
                                <input
                                    type="date"
                                    className="w-[44.5%] h-12 md:w-[15%] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 appearance-none focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm ml-4 hidden md:block"
                                    value={edayInput.value}
                                    onChange={edayInput.onChange}
                                />
                                <div className="pl-4 md:pl-2">
                                    <button
                                        onClick={searchClick}
                                        className="w-[48px] bg-[#A50A2E] rounded-[5px] md:w-[48px] md:h-12 hidden md:block cursor-pointer"
                                    >
                                        <img
                                            className="mx-auto"
                                            src={"/images/icon_search.png"}
                                            alt="검색"
                                        ></img>
                                    </button>
                                </div>
                                <button
                                    onClick={initClick}
                                    className="w-[48px] border border-[#E1E1E1] ml-2 bg-white rounded-[5px] hidden md:block md:w-[52px] md:h-12 cursor-pointer"
                                >
                                    <img
                                        className="mx-auto"
                                        src={"/images/icon_refresh.png"}
                                        alt="초기화"
                                    ></img>
                                </button>
                                <button
                                    onClick={() => handleDateChange("prev")}
                                    className="w-[48px] border border-[#E1E1E1] ml-2 bg-white rounded-[5px] hidden md:block md:w-[90px] md:h-12 cursor-pointer"
                                >
                                    이전달
                                </button>
                                <button
                                    onClick={() => handleDateChange("next")}
                                    className="w-[48px] border border-[#E1E1E1] ml-2 bg-white rounded-[5px] hidden md:block md:w-[90px] md:h-12 cursor-pointer"
                                >
                                    다음달
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 모바일 검색 섹션 */}
                    <div className="w-full h-[120px] bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[140px] flex md:hidden items-center">
                        <div className="w-full md:hidden text-[14px]">
                            <div className="flex justify-between w-full px-4">
                                <input
                                    type="date"
                                    className="w-[48%] h-12 bg-white border border-[#E1E1E1] rounded-md pl-4 pr-3"
                                    value={sdayInput.value}
                                    onChange={sdayInput.onChange}
                                />
                                <input
                                    type="date"
                                    className="w-[48%] h-12 bg-white border border-[#E1E1E1] rounded-md pl-4 pr-3"
                                    value={edayInput.value}
                                    onChange={edayInput.onChange}
                                />
                            </div>
                            <div className="w-[100%] flex justify-end px-4 pt-2">
                                <div className="flex">
                                    <button
                                        onClick={() => handleDateChange("prev")}
                                        className="w-[64px] h-12 border border-[#E1E1E1] bg-white rounded-[5px] block cursor-pointer"
                                    >
                                        {"<<"}
                                    </button>
                                    <button
                                        onClick={() => handleDateChange("next")}
                                        className="w-[64px] h-12 border border-[#E1E1E1] ml-2 bg-white rounded-[5px] block cursor-pointer"
                                    >
                                        {">>"}
                                    </button>
                                    <button
                                        onClick={searchClick}
                                        className="w-[64px] h-12 ml-2 bg-[#A50A2E] rounded-[5px] cursor-pointer"
                                    >
                                        <img
                                            className="mx-auto"
                                            src={"/images/icon_search.png"}
                                            alt="검색"
                                        ></img>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 주문 총건/총액 */}
                    <div className="mt-4 md:mx-0 mx-4">
                        <ul className="w-full bg-white text-sm h-10">
                            <li className="flex items-center">
                                <span className="md:w-[10%] w-[20%] h-10 bg-red-200 md:pl-4 pl-2 flex items-center rounded-l-md">
                                    주문 총건
                                </span>
                                <span className="md:w-[40%] w-[30%] h-10 md:text-left pl-4 border-y border-[#E1E1E1] flex items-center">
                                    {asData.itemsF.orderCount.toLocaleString()}
                                </span>
                                <span className="md:w-[10%] w-[20%] h-10 bg-red-200 md:pl-4 pl-2 border-b border-[#E1E1E1] flex items-center">
                                    주문 총액
                                </span>
                                <span className="md:w-[40%] w-[30%] h-10 text-left pl-4 border-y border-[#E1E1E1] border-r rounded-r-md flex items-center">
                                    {asData.itemsF.orderPrice.toLocaleString()}
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* 차트 영역 */}
                    <div className="md:flex md:justify-between mx-4 md:mx-0">
                        <div className="md:w-[49.5%] border border-[#E1E1E1] rounded-md mt-4">
                            <Bar
                                options={areaOrderOptions}
                                data={areaOrderData}
                                width={200}
                                height={300}
                            />
                        </div>
                        <div className="md:w-[49.5%] border border-[#E1E1E1] rounded-md mt-4">
                            <Bar
                                options={orderTimeOptions}
                                data={orderTimeData}
                                width={200}
                                height={300}
                            />
                        </div>
                    </div>
                    <div className="mx-4 md:mx-0">
                        <div className="md:w-full border border-[#E1E1E1] rounded-md mt-4">
                            <Bar
                                options={orderToptenOptions}
                                data={orderToptenData}
                                width={200}
                                height={300}
                            />
                        </div>
                        <div className="md:w-full border border-[#E1E1E1] rounded-md mt-4">
                            <Bar
                                options={itemHistOptions}
                                data={itemHistData}
                                width={650}
                                height={400}
                            />
                        </div>
                    </div>

                    {/* 이벤트 진행 현황 테이블 */}
                    <div className="md:border-[#E1E1E1] mt-6">
                        <h3 className="pl-4 font-semibold text-lg pt-6 pb-2">이벤트 진행 현황</h3>
                        <div className="border border-[#E1E1E1] rounded-[5px] overflow-y-auto mx-4 md:mx-0 max-h-[360px]">
                            <table className="table-auto w-full border-separate border-spacing-[14px] md:border-0 rounded md:border-spacing-0 md:border-[#E1E1E1] md:rounded-[5px] text-sm">
                                <thead className="hidden md:border md:border-[#E1E1E1] md:border-separate md:rounded-l-sm md:rounded-r-sm md:table-header-group">
                                    <tr className="bg-[#F9FBFC] text-[14px]">
                                        <th className="w-[35%] px-4 py-2 text-left whitespace-nowrap">
                                            이벤트명
                                        </th>
                                        <th className="w-[20%] px-4 py-2 text-left">
                                            이벤트 시작일
                                        </th>
                                        <th className="w-[20%] px-4 py-2 text-left">
                                            이벤트 종료일
                                        </th>
                                        <th className="w-[10%] px-4 py-2 text-right">주문 건수</th>
                                        <th className="w-[15%] px-4 py-2 text-right">주문 액</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {asData.itemsE && asData.itemsE.length > 0 ? (
                                        asData.itemsE.map((list, idx) => (
                                            <React.Fragment key={idx}>
                                                <tr className="transition-all">
                                                    <td className="p-4 text-left hidden md:border-t md:table-cell">
                                                        {list.subject}
                                                    </td>
                                                    <td className="p-4 text-left hidden md:border-t md:table-cell">
                                                        {list.eventStart}
                                                    </td>
                                                    <td className="p-4 text-left hidden md:border-t md:table-cell">
                                                        {list.eventEnd}
                                                    </td>
                                                    <td className="p-4 text-right hidden md:border-t md:table-cell">
                                                        {list.orderCount}
                                                    </td>
                                                    <td className="p-4 text-right hidden md:border-t md:table-cell">
                                                        {list.orderPrice.toLocaleString()}
                                                    </td>

                                                    {/* 모바일 */}
                                                    <td
                                                        colSpan={5}
                                                        className="p-4 border rounded-[5px] md:hidden"
                                                    >
                                                        <div className="flex justify-between">
                                                            <div className="font-semibold">
                                                                {list.subject}
                                                            </div>
                                                        </div>
                                                        <div className="pt-1">
                                                            {list.eventStart} ~ {list.eventEnd}
                                                        </div>
                                                        <div className="pt-1 flex justify-between">
                                                            <div className="flex">
                                                                <p>주문건수:</p>
                                                                {list.orderCount}
                                                            </div>
                                                            <div className="flex">
                                                                <p>주문액:</p>
                                                                {list.orderPrice.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="pl-2 pt-2 text-[16px] text-center"
                                            >
                                                결과가 없습니다
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
