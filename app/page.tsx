"use client";

import React from "react";
import DashBoardInfoList from "./dashboard/components/DashBoardInfoList";
import DashBoardSolutionInfoList from "./dashboard/components/DashBoardSolutionInfoList";
import DashBoardUpgradeInfoList from "./dashboard/components/DashBoardUpgradeInfoList";
import DashBoardAnalytics from "./dashboard/components/DashBoardAnalytics";

export default function DashBoard(): React.ReactElement {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full p-6">
                <div className="max-w-6xl mx-auto px-0 md:px-4 md:pt-6">
                    {/* 게시판 목록 섹션 */}
                    <div className="md:flex md:justify-between">
                        <DashBoardInfoList />
                        <DashBoardSolutionInfoList />
                        <DashBoardUpgradeInfoList />
                    </div>

                    {/* A/S 통계 차트 섹션 */}
                    <div className="md:pt-4 md:flex md:justify-between mt-4">
                        <DashBoardAnalytics />
                    </div>
                </div>
            </main>
        </div>
    );
}
