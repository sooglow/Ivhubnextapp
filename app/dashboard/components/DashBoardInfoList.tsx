"use client";

import { useRouter } from "next/navigation";
import { useInfoList } from "@/app/info/info/hooks/useInfoList";
import { truncate } from "@/public/utils/utils";
import { useUserData } from "@/public/hooks/useUserData";
import DashBoardListItemLoader from "./DashBoardListItemLoader";

export default function DashBoardInfoList() {
    const router = useRouter();
    const PAGE_SIZE = 3;
    const userInfo = useUserData();

    // React Query로 공지사항 목록 조회
    const { data: queryData, isLoading } = useInfoList({
        keyword: "",
        currentPage: 1,
        pageSize: PAGE_SIZE,
        userid: userInfo?.userId || "",
        areacode: userInfo?.areaCode || "",
        enabled: !!userInfo?.userId,
    });

    const infoLists = queryData?.data?.items || [];

    // 제목 클릭 - 전체 목록으로 이동
    const titleClick = () => {
        router.push("/info/info/List");
    };

    // 게시물 클릭 - 상세보기로 이동
    const listItemClick = (serial: string) => {
        router.push(`/info/info/View/${serial}`);
    };

    return (
        <div className="border-[#E1E1E1] rounded-[5px] border">
            <table className="mt-4 table-auto w-full md:w-[365px] rounded">
                <thead>
                    <tr>
                        <th colSpan={4} className="px-4 pb-4 text-left whitespace-nowrap">
                            <label
                                className="cursor-pointer text-[#A50A2E] font-semibold"
                                onClick={titleClick}
                            >
                                공지사항
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
                                onClick={() => listItemClick(infoList.serial)}
                                className="hover:bg-slate-100 cursor-pointer transition-all"
                            >
                                <td className="p-4 border-t border-[#E1E1E1] rounded-[5px]">
                                    <div className="max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap pt-1 font-semibold text-black">
                                        {infoList.subject ?? ""}
                                    </div>
                                    <div className="pt-1 flex justify-between">
                                        <div className="pt-1">{infoList.writer ?? ""}</div>
                                        <div className="pt-1">{truncate(infoList.wdate, 11)}</div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="p-4 text-center text-gray-400">공지사항이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
