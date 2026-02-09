"use client";

import { useRouter } from "next/navigation";
import { useIvUpgradeList } from "@/app/homePage/upgradeInfo/hooks/useIvUpgradeList";
import { truncate } from "@/public/utils/utils";
import { SOLUTION_MAPPING } from "@/public/constants/solution";
import DashBoardListItemLoader from "./DashBoardListItemLoader";

export default function DashBoardUpgradeInfoList() {
    const router = useRouter();
    const PAGE_SIZE = 3;

    // React Query로 신규기능소개 목록 조회
    const { data: queryData, isLoading } = useIvUpgradeList({
        keyword: "",
        currentPage: 1,
        pageSize: PAGE_SIZE,
        enabled: true,
    });

    const lists = queryData?.data?.items || [];

    // 제목 클릭 - 전체 목록으로 이동
    const titleClick = () => {
        router.push("/homePage/upgradeInfo/List");
    };

    // 게시물 클릭 - 링크 열기
    const listItemClick = (serial: string, link: string) => {
        if (link) {
            window.open(link, "_blank");
        }
    };

    return (
        <div className="border-[#E1E1E1] rounded-[5px] border md:ml-2">
            <table className="w-full mt-4 table-auto md:w-[365px] rounded">
                <thead>
                    <tr>
                        <th colSpan={4} className="px-4 pb-4 text-md text-left whitespace-nowrap">
                            <label
                                className="cursor-pointer text-[#A50A2E] font-semibold"
                                onClick={titleClick}
                            >
                                신규기능소개
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
                    ) : lists.length > 0 ? (
                        lists.map((list, idx) => (
                            <tr
                                key={idx}
                                onClick={() => listItemClick(list.serial, list.link)}
                                className="hover:bg-slate-100 cursor-pointer transition-all"
                            >
                                <td className="p-4 border-t border-[#E1E1E1] rounded-[5px]">
                                    <div className="pt-1 flex justify-between">
                                        <div className="max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap text-black font-semibold">
                                            {list.title ?? ""}
                                        </div>
                                        <div className="pl-6">{list.writer ?? ""}</div>
                                    </div>
                                    <div className="pt-1 flex justify-between">
                                        <div className="pt-1">
                                            {SOLUTION_MAPPING[list.prgName ?? ""] || ""}
                                        </div>
                                        <div className="pt-1">{truncate(list.wdate, 11)}</div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="p-4 text-center text-gray-400">
                                신규기능소개가 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
