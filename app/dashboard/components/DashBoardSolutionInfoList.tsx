"use client";

import { useRouter } from "next/navigation";
import { useSolutionInfoList } from "@/app/info/solutionInfo/hooks/useSolutionInfoList";
import { truncate } from "@/public/utils/utils";
import { SOLUTION_MAPPING } from "@/public/constants/solution";
import DashBoardListItemLoader from "./DashBoardListItemLoader";

export default function DashBoardSolutionInfoList() {
    const router = useRouter();
    const PAGE_SIZE = 3;

    // React Query로 솔루션 공지사항 목록 조회
    const { data: queryData, isLoading } = useSolutionInfoList({
        keyword: "",
        currentPage: 1,
        pageSize: PAGE_SIZE,
        enabled: true,
    });

    const infoLists = queryData?.data?.items || [];

    // 제목 클릭 - 전체 목록으로 이동
    const titleClick = () => {
        router.push("/info/solutionInfo/List");
    };

    // 게시물 클릭 - 링크 열기
    const iconClick = (url: string) => {
        if (url) {
            window.open(url, "_blank");
        }
    };

    return (
        <div className="border-[#E1E1E1] rounded-[5px] border md:ml-2">
            <table className="w-full md:w-[365px] mt-4 table-auto rounded">
                <thead>
                    <tr>
                        <th colSpan={4} className="px-4 pb-4 text-md text-left whitespace-nowrap">
                            <label
                                className="cursor-pointer text-[#A50A2E] font-semibold"
                                onClick={titleClick}
                            >
                                솔루션 공지사항
                            </label>
                        </th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {isLoading ? (
                        <tr>
                            <td className="p-4">
                                <DashBoardListItemLoader />
                            </td>
                        </tr>
                    ) : infoLists.length > 0 ? (
                        infoLists.map((infoList, idx) => (
                            <tr
                                key={idx}
                                onClick={() => iconClick(infoList.preViewUrl)}
                                className="hover:bg-slate-100 cursor-pointer transition-all"
                            >
                                <td className="p-4 border-t border-[#E1E1E1] rounded-[5px]">
                                    <div className="pt-1 flex justify-between">
                                        <div className="max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis text-black font-semibold">
                                            {infoList.subject ?? ""}
                                        </div>
                                        <div className="pl-6">{infoList.stateName ?? ""}</div>
                                    </div>
                                    <div className="pt-1 flex justify-between">
                                        <div className="pt-1">
                                            {SOLUTION_MAPPING[infoList.solution ?? ""] || ""}
                                        </div>
                                        <div className="pt-1">{truncate(infoList.sday, 12)}</div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="p-4 text-center text-gray-400">
                                솔루션 공지사항이 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
