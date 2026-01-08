"use client";

import React, { useEffect, useState } from "react";
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
import { useInput } from "@/public/hooks/useInput";
import { useLoading } from "@/public/contexts/LoadingContext";
import { useAsAnalytics } from "../hooks/useAsAnalytics";
import type { ChartModel } from "../types";

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

export default function AsAnalyticsView() {
    const { dispatch } = useLoading();

    const getFormattedDate = (date: Date) => date.toISOString().split("T")[0];
    const currentDate = new Date();
    const oneMonthAgo = new Date(currentDate);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const [sday, setSday] = useState(getFormattedDate(oneMonthAgo));
    const [eday, setEday] = useState(getFormattedDate(new Date()));

    // input 관련 커스텀 훅 설정
    const sdayInput = useInput(
        getFormattedDate(oneMonthAgo),
        (value: string) => value?.length <= 50
    );
    const edayInput = useInput(
        getFormattedDate(new Date()),
        (value: string) => value?.length <= 50
    );

    const { data: queryData, isLoading, error } = useAsAnalytics({ sday, eday });

    const asData = queryData?.data || {
        itemsA: [],
        itemsB: [],
        itemsC: [],
        itemsD: [],
        itemsE: [],
        itemsF: [],
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
        const newSday = getFormattedDate(oneMonthAgo);
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

    // 지사별 A/S 접수 현황
    const asAreaData = {
        datasets: [
            {
                label: "접수된 A/S 건수",
                data: asData.itemsA
                    ?.map((item) => ({ x: item.x, y: item.y }))
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
            title: {
                display: true,
                text: "지사별 A/S 접수 현황",
                font: {
                    size: 16,
                },
            },
            datalabels: {
                display: false,
            },
        },
        layout: {
            padding: {
                right: 20,
                bottom: 20,
                left: 10,
            },
        },
    };

    // x값이 겹치는 것끼리 배열로 가공하기
    const result: { [key: string]: ChartModel[] } = {};
    asData.itemsB?.forEach((item) => {
        if (!result[item.x]) {
            result[item.x] = [];
        }
        result[item.x].push(item);
    });

    // 지사별 파이 차트 데이터 생성 (본사)
    const asPartdata = {
        labels: (result.본사 || [])
            ?.map((item) => ({
                y: item.y,
                label: item.label,
            }))
            .sort((a, b) => b.y - a.y)
            .slice(0, 5)
            .map(({ label }) => label)
            .concat(result?.본사?.length > 5 ? ["기타"] : []),
        datasets: [
            {
                data: result?.본사
                    ? (result.본사 || [])
                          .map((item) => ({
                              y: item.y,
                              label: item.label,
                          }))
                          .sort((a, b) => b.y - a.y)
                          .slice(0, 5)
                          .map(({ y }) => y)
                          .concat(
                              result?.본사?.length > 5
                                  ? [result?.본사?.slice(5).reduce((acc, curr) => acc + curr.y, 0)]
                                  : []
                          )
                    : [],
                backgroundColor: [
                    "#D65370",
                    "#6B96C6",
                    "#F0D264",
                    "#74C2B8",
                    "#B18FD7",
                    "#F5A86E",
                    "#D8DCE1",
                    "#B6BBBF",
                    "#878787",
                    "#4F4F4F",
                ],
                datalabels: {
                    labels: {
                        value: {
                            color: "black",
                        },
                    },
                },
            },
        ],
    };

    // 강원
    const asPartGwdata = {
        labels: (result.강원 || [])
            ?.map((item) => ({
                y: item.y,
                label: item.label,
            }))
            .sort((a, b) => b.y - a.y)
            .slice(0, 5)
            .map(({ label }) => label)
            .concat(result?.강원?.length > 5 ? ["기타"] : []),
        datasets: [
            {
                data: result?.강원
                    ? (result.강원 || [])
                          .map((item) => ({
                              y: item.y,
                              label: item.label,
                          }))
                          .sort((a, b) => b.y - a.y)
                          .slice(0, 5)
                          .map(({ y }) => y)
                          .concat(
                              result?.강원?.length > 5
                                  ? [result?.강원?.slice(5).reduce((acc, curr) => acc + curr.y, 0)]
                                  : []
                          )
                    : [],
                backgroundColor: [
                    "#D65370",
                    "#6B96C6",
                    "#F0D264",
                    "#74C2B8",
                    "#B18FD7",
                    "#F5A86E",
                    "#D8DCE1",
                    "#B6BBBF",
                    "#878787",
                    "#4F4F4F",
                ],
                datalabels: {
                    labels: {
                        value: {
                            color: "black",
                        },
                    },
                },
            },
        ],
    };

    // 광주
    const asPartGjdata = {
        labels: (result.광주 || [])
            ?.map((item) => ({
                y: item.y,
                label: item.label,
            }))
            .sort((a, b) => b.y - a.y)
            .slice(0, 5)
            .map(({ label }) => label)
            .concat(result?.광주?.length > 5 ? ["기타"] : []),
        datasets: [
            {
                data: result?.광주
                    ? (result.광주 || [])
                          .map((item) => ({
                              y: item.y,
                              label: item.label,
                          }))
                          .sort((a, b) => b.y - a.y)
                          .slice(0, 5)
                          .map(({ y }) => y)
                          .concat(
                              result?.광주?.length > 5
                                  ? [result?.광주?.slice(5).reduce((acc, curr) => acc + curr.y, 0)]
                                  : []
                          )
                    : [],
                backgroundColor: [
                    "#D65370",
                    "#6B96C6",
                    "#F0D264",
                    "#74C2B8",
                    "#B18FD7",
                    "#F5A86E",
                    "#D8DCE1",
                    "#B6BBBF",
                    "#878787",
                    "#4F4F4F",
                ],
                datalabels: {
                    labels: {
                        value: {
                            color: "black",
                        },
                    },
                },
            },
        ],
    };

    // 대전
    const asPartDjdata = {
        labels: (result.대전 || [])
            ?.map((item) => ({
                y: item.y,
                label: item.label,
            }))
            .sort((a, b) => b.y - a.y)
            .slice(0, 5)
            .map(({ label }) => label)
            .concat(result?.대전?.length > 5 ? ["기타"] : []),
        datasets: [
            {
                data: result?.대전
                    ? (result.대전 || [])
                          .map((item) => ({
                              y: item.y,
                              label: item.label,
                          }))
                          .sort((a, b) => b.y - a.y)
                          .slice(0, 5)
                          .map(({ y }) => y)
                          .concat(
                              result?.대전?.length > 5
                                  ? [result?.대전?.slice(5).reduce((acc, curr) => acc + curr.y, 0)]
                                  : []
                          )
                    : [],
                backgroundColor: [
                    "#D65370",
                    "#6B96C6",
                    "#F0D264",
                    "#74C2B8",
                    "#B18FD7",
                    "#F5A86E",
                    "#D8DCE1",
                    "#B6BBBF",
                    "#878787",
                    "#4F4F4F",
                ],
                datalabels: {
                    labels: {
                        value: {
                            color: "black",
                        },
                    },
                },
            },
        ],
    };

    // 부산
    const asPartBsdata = {
        labels: (result.부산 || [])
            ?.map((item) => ({
                y: item.y,
                label: item.label,
            }))
            .sort((a, b) => b.y - a.y)
            .slice(0, 5)
            .map(({ label }) => label)
            .concat(result?.부산?.length > 5 ? ["기타"] : []),
        datasets: [
            {
                data: result?.부산
                    ? (result.부산 || [])
                          .map((item) => ({
                              y: item.y,
                              label: item.label,
                          }))
                          .sort((a, b) => b.y - a.y)
                          .slice(0, 5)
                          .map(({ y }) => y)
                          .concat(
                              result?.부산?.length > 5
                                  ? [result?.부산?.slice(5).reduce((acc, curr) => acc + curr.y, 0)]
                                  : []
                          )
                    : [],
                backgroundColor: [
                    "#D65370",
                    "#6B96C6",
                    "#F0D264",
                    "#74C2B8",
                    "#B18FD7",
                    "#F5A86E",
                    "#D8DCE1",
                    "#B6BBBF",
                    "#878787",
                    "#4F4F4F",
                ],
                datalabels: {
                    labels: {
                        value: {
                            color: "black",
                        },
                    },
                },
            },
        ],
    };

    // 인천
    const asPartIcdata = {
        labels: (result.인천 || [])
            ?.map((item) => ({
                y: item.y,
                label: item.label,
            }))
            .sort((a, b) => b.y - a.y)
            .slice(0, 5)
            .map(({ label }) => label)
            .concat(result?.인천?.length > 5 ? ["기타"] : []),
        datasets: [
            {
                data: result?.인천
                    ? (result.인천 || [])
                          .map((item) => ({
                              y: item.y,
                              label: item.label,
                          }))
                          .sort((a, b) => b.y - a.y)
                          .slice(0, 5)
                          .map(({ y }) => y)
                          .concat(
                              result?.인천?.length > 5
                                  ? [result?.인천?.slice(5).reduce((acc, curr) => acc + curr.y, 0)]
                                  : []
                          )
                    : [],
                backgroundColor: [
                    "#D65370",
                    "#6B96C6",
                    "#F0D264",
                    "#74C2B8",
                    "#B18FD7",
                    "#F5A86E",
                    "#D8DCE1",
                    "#B6BBBF",
                    "#878787",
                    "#4F4F4F",
                ],
                datalabels: {
                    labels: {
                        value: {
                            color: "black",
                        },
                    },
                },
            },
        ],
    };

    // 울산
    const asPartIsdata = {
        labels: (result.울산 || [])
            ?.map((item) => ({
                y: item.y,
                label: item.label,
            }))
            .sort((a, b) => b.y - a.y)
            .slice(0, 5)
            .map(({ label }) => label)
            .concat(result?.울산?.length > 5 ? ["기타"] : []),
        datasets: [
            {
                data: result?.울산
                    ? (result.울산 || [])
                          .map((item) => ({
                              y: item.y,
                              label: item.label,
                          }))
                          .sort((a, b) => b.y - a.y)
                          .slice(0, 5)
                          .map(({ y }) => y)
                          .concat(
                              result?.울산?.length > 5
                                  ? [result?.울산?.slice(5).reduce((acc, curr) => acc + curr.y, 0)]
                                  : []
                          )
                    : [],
                backgroundColor: [
                    "#D65370",
                    "#6B96C6",
                    "#F0D264",
                    "#74C2B8",
                    "#B18FD7",
                    "#F5A86E",
                    "#D8DCE1",
                    "#B6BBBF",
                    "#878787",
                    "#4F4F4F",
                ],
                datalabels: {
                    labels: {
                        value: {
                            color: "black",
                        },
                    },
                },
            },
        ],
    };

    // 전북
    const asPartJbdata = {
        labels: (result.전북 || [])
            ?.map((item) => ({
                y: item.y,
                label: item.label,
            }))
            .sort((a, b) => b.y - a.y)
            .slice(0, 5)
            .map(({ label }) => label)
            .concat(result?.전북?.length > 5 ? ["기타"] : []),
        datasets: [
            {
                data: result?.전북
                    ? (result.전북 || [])
                          .map((item) => ({
                              y: item.y,
                              label: item.label,
                          }))
                          .sort((a, b) => b.y - a.y)
                          .slice(0, 5)
                          .map(({ y }) => y)
                          .concat(
                              result?.전북?.length > 5
                                  ? [result?.전북?.slice(5).reduce((acc, curr) => acc + curr.y, 0)]
                                  : []
                          )
                    : [],
                backgroundColor: [
                    "#D65370",
                    "#6B96C6",
                    "#F0D264",
                    "#74C2B8",
                    "#B18FD7",
                    "#F5A86E",
                    "#D8DCE1",
                    "#B6BBBF",
                    "#878787",
                    "#4F4F4F",
                ],
                datalabels: {
                    labels: {
                        value: {
                            color: "black",
                        },
                    },
                },
            },
        ],
    };

    // 제주
    const asPartJjdata = {
        labels: (result.제주 || [])
            ?.map((item) => ({
                y: item.y,
                label: item.label,
            }))
            .sort((a, b) => b.y - a.y)
            .slice(0, 5)
            .map(({ label }) => label)
            .concat(result?.제주?.length > 5 ? ["기타"] : []),
        datasets: [
            {
                data: result?.제주
                    ? (result.제주 || [])
                          .map((item) => ({
                              y: item.y,
                              label: item.label,
                          }))
                          .sort((a, b) => b.y - a.y)
                          .slice(0, 5)
                          .map(({ y }) => y)
                          .concat(
                              result?.제주?.length > 5
                                  ? [result?.제주?.slice(5).reduce((acc, curr) => acc + curr.y, 0)]
                                  : []
                          )
                    : [],
                backgroundColor: [
                    "#D65370",
                    "#6B96C6",
                    "#F0D264",
                    "#74C2B8",
                    "#B18FD7",
                    "#F5A86E",
                    "#D8DCE1",
                    "#B6BBBF",
                    "#878787",
                    "#4F4F4F",
                ],
                datalabels: {
                    labels: {
                        value: {
                            color: "black",
                        },
                    },
                },
            },
        ],
    };

    // Pie 차트 공통 옵션
    const asPartOptions = {
        maintainAspectRatio: false,
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
            datalabels: {
                display: true,
                color: "white",
                anchor: "end" as const,
                align: "center" as const,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter: (value: any, context: any) => {
                    return context.chart.data.labels[context.dataIndex];
                },
            },
        },
        layout: {
            padding: {
                right: 10,
                bottom: 10,
                left: 10,
            },
        },
    };

    // 업체별 A/S 이력 분석
    const asHistData = {
        datasets: [
            {
                label: "A/S 이력 분석 건수",
                data: asData.itemsD?.map((item) => ({ x: item.y, y: item.x })),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "#A50A2E",
            },
        ],
    };

    const asHistOptions = {
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
                position: "top" as const,
            },
            title: {
                display: true,
                text: "업체별 A/S 이력 분석",
                font: {
                    size: 16,
                },
            },
            datalabels: {
                display: false,
            },
        },
        layout: {
            padding: {
                right: 20,
                bottom: 20,
                left: 10,
            },
        },
    };

    // 처리자별 성과
    const asMandata = {
        labels: asData.itemsC
            ?.map((item) => item.x)
            .sort((a, b) => {
                const A = asData.itemsC?.find((item) => item.x === a)?.y || 0;
                const B = asData.itemsC?.find((item) => item.x === b)?.y || 0;
                return B - A;
            })
            .slice(0, 10),
        datasets: [
            {
                label: "처리건수",
                data: asData.itemsC
                    ?.map((item) => item.y)
                    .sort((a, b) => b - a)
                    .slice(0, 10),
                backgroundColor: "#A50A2E",
            },
        ],
    };

    const asManOption = {
        maintainAspectRatio: false,
        elements: {
            bar: {
                borderWidth: 1,
            },
            padding: {
                top: 10,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "처리자별 성과",
                font: {
                    weight: "bold" as const,
                    size: 16,
                },
            },
            datalabels: {
                display: false,
            },
        },
        layout: {
            padding: {
                right: 20,
                bottom: 20,
                left: 10,
            },
        },
    };

    // 시간대별 A/S 접수 추이
    const asTimeData = {
        datasets: [
            {
                label: "시간대별 A/S 접수 추이",
                data: asData.itemsE?.map((item) => ({ x: item.x, y: item.y })),
                borderColor: "#A50A2E",
                pointBackgroundColor: "white",
            },
        ],
    };

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
            title: {
                display: true,
                text: "시간대별 A/S 접수 추이",
                font: {
                    size: 16,
                },
            },
            datalabels: {
                display: false,
            },
        },
        layout: {
            padding: {
                right: 20,
                bottom: 20,
                left: 10,
            },
        },
    };

    // A/S 발생 빈도
    const asPrgdata = {
        labels: asData.itemsF?.slice(0, 5).map((item) => item.x),
        datasets: [
            {
                label: "발생빈도",
                data: asData.itemsF?.slice(0, 5).map((item) => item.y),
                backgroundColor: [
                    "#D65370",
                    "#6B96C6",
                    "#F0D264",
                    "#74C2B8",
                    "#B18FD7",
                    "#F5A86E",
                    "#D8DCE1",
                    "#B6BBBF",
                    "#878787",
                    "#4F4F4F",
                ],
            },
        ],
    };

    const asPrgOptions = {
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: "top" as const,
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
            datalabels: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                display: (context: any) => {
                    return context.dataset.data[context.dataIndex] !== 0;
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter: (value: any, context: any) => {
                    return `${context.chart.data.labels[context.dataIndex]}\n${value}건`;
                },
                labels: {
                    value: {
                        color: "black",
                    },
                },
                font: {
                    weight: "bold" as const,
                },
            },
            title: {
                display: true,
                text: "문의 프로그램별 A/S 발생 빈도",
                font: {
                    size: 16,
                },
            },
        },
        layout: {
            padding: {
                right: 10,
                bottom: 10,
                left: 10,
            },
            width: 300,
            height: 300,
        },
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto pb-20">
                    <h2 className="pl-4 font-semibold text-2xl py-4 md:py-8">A/S 접수현황</h2>

                    {/* 데스크톱 검색 섹션 */}
                    <div className="w-full h-[150px] bg-[#F9FBFC] rounded-[5px] md:w-full md:h-[140px] hidden md:flex md:items-center">
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
                                        className="w-[64px] h-12 border bg-white rounded-[5px] block"
                                    >
                                        {"<<"}
                                    </button>
                                    <button
                                        onClick={() => handleDateChange("next")}
                                        className="w-[64px] h-12 border ml-2 bg-white rounded-[5px] block"
                                    >
                                        {">>"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 차트 영역 - 첫 번째 행 */}
                    <div className="md:flex md:justify-between mx-4 md:mx-0">
                        <div className="md:w-[49.5%] border border-[#E1E1E1] rounded-md mt-4">
                            <Bar
                                options={asAreaOptions}
                                data={asAreaData}
                                width={200}
                                height={300}
                            />
                        </div>
                        <div className="md:w-[49.5%] border border-[#E1E1E1] rounded-md mt-4 hidden md:block">
                            <Bar options={asHistOptions} data={asHistData} />
                        </div>
                        <div className="md:w-[49.5%] h-[300px] border border-[#E1E1E1] rounded-md mt-4 md:hidden">
                            <Bar options={asHistOptions} data={asHistData} />
                        </div>
                    </div>

                    {/* 지사별 A/S 분류 분포 */}
                    <h3 className="pl-4 md:pl-4 font-semibold text-lg pt-4 md:pt-6 md:pb-2">
                        지사별 A/S 분류 분포
                    </h3>
                    <div className="md:w-full border border-[#E1E1E1] rounded-md mx-4 md:mx-0">
                        <div className="md:flex md:justify-between">
                            <div>
                                <Pie
                                    options={{
                                        ...asPartOptions,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: "본사",
                                                font: { size: 14 },
                                            },
                                        },
                                    }}
                                    data={asPartdata}
                                    width={350}
                                    height={350}
                                />
                            </div>
                            <div>
                                <Pie
                                    options={{
                                        ...asPartOptions,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: "강원",
                                                font: { size: 14 },
                                            },
                                        },
                                    }}
                                    data={asPartGwdata}
                                    width={350}
                                    height={350}
                                />
                            </div>
                            <div>
                                <Pie
                                    options={{
                                        ...asPartOptions,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: "광주",
                                                font: { size: 14 },
                                            },
                                        },
                                    }}
                                    data={asPartGjdata}
                                    width={350}
                                    height={350}
                                />
                            </div>
                        </div>
                        <div className="md:flex md:justify-between">
                            <div>
                                <Pie
                                    options={{
                                        ...asPartOptions,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: "대전",
                                                font: { size: 14 },
                                            },
                                        },
                                    }}
                                    data={asPartDjdata}
                                    width={350}
                                    height={350}
                                />
                            </div>
                            <div>
                                <Pie
                                    options={{
                                        ...asPartOptions,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: "부산",
                                                font: { size: 14 },
                                            },
                                        },
                                    }}
                                    data={asPartBsdata}
                                    width={350}
                                    height={350}
                                />
                            </div>
                            <div>
                                <Pie
                                    options={{
                                        ...asPartOptions,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: "인천",
                                                font: { size: 14 },
                                            },
                                        },
                                    }}
                                    data={asPartIcdata}
                                    width={350}
                                    height={350}
                                />
                            </div>
                        </div>
                        <div className="md:flex md:justify-between">
                            <div>
                                <Pie
                                    options={{
                                        ...asPartOptions,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: "울산",
                                                font: { size: 14 },
                                            },
                                        },
                                    }}
                                    data={asPartIsdata}
                                    width={350}
                                    height={350}
                                />
                            </div>
                            <div>
                                <Pie
                                    options={{
                                        ...asPartOptions,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: "전북",
                                                font: { size: 14 },
                                            },
                                        },
                                    }}
                                    data={asPartJbdata}
                                    width={350}
                                    height={350}
                                />
                            </div>
                            <div>
                                <Pie
                                    options={{
                                        ...asPartOptions,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: "제주",
                                                font: { size: 14 },
                                            },
                                        },
                                    }}
                                    data={asPartJjdata}
                                    width={350}
                                    height={350}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 차트 영역 - 세 번째 행 */}
                    <div className="md:flex md:justify-between mx-4 md:mx-0">
                        <div className="md:w-[33%] border border-[#E1E1E1] rounded-md mt-4">
                            <Bar
                                options={asManOption}
                                data={asMandata}
                                plugins={[ChartDataLabels]}
                                width={350}
                                height={400}
                            />
                        </div>
                        <div className="md:w-[33%] border border-[#E1E1E1] rounded-md mt-4">
                            <Line
                                options={asTimeOptions}
                                data={asTimeData}
                                width={200}
                                height={200}
                            />
                        </div>
                        <div className="md:w-[33%] border border-[#E1E1E1] rounded-md mt-4">
                            <Pie
                                options={asPrgOptions}
                                data={asPrgdata}
                                plugins={[ChartDataLabels]}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
