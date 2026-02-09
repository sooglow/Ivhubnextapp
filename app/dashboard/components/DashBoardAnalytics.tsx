"use client";

import React, { useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useAsAnalytics } from "@/app/stat/asAnalytics/hooks/useAsAnalytics";
import type { ChartModel } from "@/app/stat/asAnalytics/types";
import DashBoardAnalyticsLoader from "./DashBoardAnalyticsLoader";

// Chart.js 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export default function DashBoardAnalytics() {
    const getFormattedDate = (date: Date) => date.toISOString().split("T")[0];
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const sday = getFormattedDate(oneWeekAgo);
    const eday = getFormattedDate(new Date());

    const { data: queryData, isLoading, error } = useAsAnalytics({ sday, eday });

    const asData = queryData?.data || {
        itemsA: [],
        itemsB: [],
        itemsC: [],
        itemsD: [],
        itemsE: [],
        itemsF: [],
    };

    useEffect(() => {
        if (error) {
            console.error("Chart error:", error);
        }
    }, [error]);

    // 지사별 A/S 접수 현황
    const asAreaData = {
        datasets: [
            {
                label: "접수된 A/S 건수",
                data: asData.itemsA
                    ?.map((item: ChartModel) => ({ x: item.x, y: item.y }))
                    .sort((a, b) => b.y - a.y),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "#A50A2E",
            },
        ],
    };

    const asAreaOptions = {
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
            datalabels: {
                display: false,
            },
        },
        layout: {
            padding: {
                top: 20,
                right: 20,
                bottom: 10,
                left: 10,
            },
        },
    };

    // A/S 분류 분포
    const asPartdata = {
        labels: asData.itemsB?.slice(0, 5).map((item: ChartModel) => item.label),
        datasets: [
            {
                data: asData.itemsB?.slice(0, 5).map((item: ChartModel) => item.y),
                backgroundColor: [
                    "#D65370",
                    "#6B96C6",
                    "#F0D264",
                    "#74C2B8",
                    "#B18FD7",
                ],
            },
        ],
    };

    const asPartOptions = {
        maintainAspectRatio: false,
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        responsive: true,
        plugins: {
            datalabels: {
                display: false,
            },
        },
        layout: {
            padding: {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10,
            },
        },
    };

    // 시간대별 A/S 접수 추이
    const asTimeOptions = {
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
            datalabels: {
                display: false,
            },
        },
        layout: {
            padding: {
                top: 20,
                right: 20,
                bottom: 10,
                left: 10,
            },
        },
    };

    const asTimeData = {
        datasets: [
            {
                label: "시간대별 A/S 접수 추이",
                data: asData.itemsE?.map((item: ChartModel) => ({ x: item.x, y: item.y })),
                borderColor: "#A50A2E",
                pointBackgroundColor: "white",
            },
        ],
    };

    return (
        <div>
            <div className="md:flex md:justify-between hidden">
                <div className="md:w-[369px] pt-[14px] border-x border-t border-b border-[#E1E1E1] rounded-t">
                    <label className="px-4 pb-4 text-md text-left font-[600] whitespace-nowrap text-[#A50A2E]">
                        지사별 A/S 접수 현황 - 최근 7일 기준
                    </label>
                </div>
                <div className="md:w-[369px] pt-[14px] h-14 border-x border-t border-b border-[#E1E1E1] rounded-t">
                    <label className="pl-4 font-[600] text-[#A50A2E]">
                        A/S분류 분포 - 최근 7일 기준
                    </label>
                </div>
                <div className="md:w-[369px] pt-[14px] border-x border-t border-b border-[#E1E1E1] rounded-t">
                    <label className="px-4 pb-4 font-[600] text-[#A50A2E]">
                        시간대별 A/S 접수 추이 - 최근 7일 기준
                    </label>
                </div>
            </div>

            <div className="md:flex md:justify-between">
                <div className="h-14 flex items-center pl-4 border-x border-t border-b border-[#E1E1E1] rounded-t mt-2 md:hidden">
                    <label className="font-[600] text-[#A50A2E]">
                        지사별 A/S 접수 현황 - 최근 7일 기준
                    </label>
                </div>
                <div className="md:w-[369px] border-x border-b rounded-b border-[#E1E1E1]">
                    {isLoading ? (
                        <DashBoardAnalyticsLoader />
                    ) : (
                        <Bar options={asAreaOptions} data={asAreaData} width={368} height={300} />
                    )}
                </div>

                <div className="h-14 flex items-center pl-4 border-x border-t border-b border-[#E1E1E1] rounded-t md:hidden mt-2">
                    <label className="font-[600] text-[#A50A2E]">
                        A/S분류 분포 - 최근 7일 기준
                    </label>
                </div>
                <div className="md:w-[369px] border-x border-b border-[#E1E1E1] rounded-b md:ml-2">
                    {isLoading ? (
                        <DashBoardAnalyticsLoader />
                    ) : (
                        <Pie options={asPartOptions} data={asPartdata} width={368} height={300} />
                    )}
                </div>

                <div className="h-14 flex items-center pl-3 text-md text-left whitespace-nowrap mt-2 border-x border-t border-b border-[#E1E1E1] rounded-t md:hidden">
                    <label className="font-[600] text-[#A50A2E]">
                        시간대별 A/S 접수 추이 - 최근 7일 기준
                    </label>
                </div>
                <div className="md:w-[369px] border-x border-b border-[#E1E1E1] rounded-b md:ml-2">
                    {isLoading ? (
                        <DashBoardAnalyticsLoader />
                    ) : (
                        <Line options={asTimeOptions} data={asTimeData} width={368} height={200} />
                    )}
                </div>
            </div>
        </div>
    );
}
