"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useInput } from "@/public/hooks/useInput";
import { useMaintenanceCreate } from "../hooks/useMaintenance";
import { MAINTENANCESRESULT } from "@/public/constants/etcSales";
import axios from "axios";

export default function MaintenanceCreate() {
    const router = useRouter();
    const [mItems, setMItems] = useState<{ code: string; codename: string }[]>([]);
    const [comCode, setComCode] = useState("01");
    const [status, setStatus] = useState("접수");
    const [asDay] = useState(new Date().toISOString().split("T")[0]);

    const subjectInput = useInput("", (value: string) => value.length <= 100);
    const asMemoInput = useInput("", (value: string) => value.length <= 5000);
    const asResultInput = useInput("", (value: string) => value.length <= 5000);
    const bigoInput = useInput("", (value: string) => value.length <= 5000);
    const asDayInput = useInput("", (value: string) => value.length <= 5000);

    const subjectRef = useRef<HTMLInputElement>(null);
    const asMemoRef = useRef<HTMLTextAreaElement>(null);

    const { mutate: createMaintenance, isPending } = useMaintenanceCreate();

    const cancelClick = () => {
        router.push("/deptWorks/maintenance/List");
    };

    const saveBtnClick = () => {
        if (subjectInput.value.length < 5) {
            alert("제목은 5자 이상 입력해 주세요.");
            subjectRef.current?.focus();
            return;
        }

        if (asMemoInput.value.length < 5) {
            alert("접수내용은 5자 이상 입력해 주세요.");
            asMemoRef.current?.focus();
            return;
        }

        if (!window.confirm("저장하시겠습니까?")) {
            return;
        }

        createMaintenance(
            {
                asDay: asDayInput.value,
                userId: "",
                comCode: comCode,
                subject: subjectInput.value,
                result: status,
                asMemo: asMemoInput.value,
                asResult: asResultInput.value,
                bigo: bigoInput.value,
            },
            {
                onSuccess: () => {
                    alert("저장되었습니다.");
                    router.push("/deptWorks/maintenance/List");
                },
                onError: (error: any) => {
                    alert(error.response?.data?.errMsg || "저장에 실패했습니다.");
                },
            }
        );
    };

    // 유지보수계약업체 목록 가져오기
    useEffect(() => {
        const fetchMItems = async () => {
            try {
                const response = await axios.get("/api/code?Kind=mcode");
                if (response.data.result) {
                    setMItems(response.data.data.items || []);
                }
            } catch (error) {
                console.error("Error fetching mcode:", error);
            }
        };

        fetchMItems();
        asDayInput.setValue(asDay);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto px-4 pb-20">
                    <h2 className="md:pl-4 font-semibold text-2xl py-4 md:py-8">
                        유지보수 계약업체A/S
                    </h2>

                    <div className="mt-2 md:w-full md:h-full md:rounded-md md:border-[#E1E1E1] md:border-[1px]">
                        <ul className="space-y-4 pt-2 md:pt-[30px] md:p-4">
                            <li className="md:mx-4">
                                <div className="md:flex md:justify-between md:pt-2">
                                    <div className="flex items-baseline">
                                        <p className="pt-2 font-semibold whitespace-nowrap">
                                            계약업체
                                        </p>
                                        <select
                                            value={comCode}
                                            onChange={(e) => setComCode(e.target.value)}
                                            className="w-[50%] h-12 pl-4 ml-6 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[200px] md:h-12"
                                            disabled={isPending}
                                        >
                                            {mItems.map((item) => (
                                                <option key={item.code} value={item.code}>
                                                    {item.codename}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex pt-4 md:pt-0">
                                        <p className="pt-2 font-semibold whitespace-nowrap">
                                            접수일자
                                        </p>
                                        <input
                                            type="date"
                                            className="w-[200px] h-12 ml-6 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-2 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={asDayInput.value}
                                            onChange={asDayInput.onChange}
                                            disabled={isPending}
                                        />
                                    </div>
                                </div>
                                <div className="flex md:justify-between pt-4 items-baseline">
                                    <p className="font-semibold whitespace-nowrap">제목</p>
                                    <input
                                        ref={subjectRef}
                                        placeholder="제목"
                                        className="w-[100%] appearance-none md:w-[1000px] h-12 ml-[54px] bg-white border rounded-md border-[#E1E1E1] py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                        value={subjectInput.value}
                                        onChange={subjectInput.onChange}
                                        disabled={isPending}
                                    />
                                </div>
                            </li>
                            <div className="md:mx-4 md:pb-8 md:pt-4">
                                <p className="font-semibold pb-2">접수내용</p>
                                <div className="border rounded-md border-[#E1E1E1]">
                                    <textarea
                                        ref={asMemoRef}
                                        className="w-full h-[150px] px-4 overflow-scroll overflow-x-hidden pt-1 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                                        value={asMemoInput.value}
                                        onChange={asMemoInput.onChange}
                                        disabled={isPending}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="md:mx-4 md:pb-8">
                                <p className="font-semibold pb-2">처리결과</p>
                                <div className="border rounded-md border-[#E1E1E1]">
                                    <textarea
                                        className="w-full h-[150px] px-4 overflow-scroll overflow-x-hidden pt-1 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                                        value={asResultInput.value}
                                        onChange={asResultInput.onChange}
                                        disabled={isPending}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="md:mx-4 md:pb-8">
                                <p className="font-semibold pb-2">비고</p>
                                <div className="border rounded-md border-[#E1E1E1]">
                                    <textarea
                                        className="w-full h-[150px] px-4 overflow-scroll overflow-x-hidden pt-1 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                                        value={bigoInput.value}
                                        onChange={bigoInput.onChange}
                                        disabled={isPending}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="md:mx-4 md:pb-8">
                                <p className="font-semibold pb-2">상태</p>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="h-12 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[180px]"
                                    disabled={isPending}
                                >
                                    {MAINTENANCESRESULT.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </ul>
                    </div>
                    <div className="flex justify-center items-center pt-4 md:pt-3 mx-auto">
                        <div>
                            <button
                                onClick={cancelClick}
                                className="w-[150px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer"
                                disabled={isPending}
                            >
                                취소
                            </button>
                        </div>
                        <div className="pl-2">
                            <button
                                onClick={saveBtnClick}
                                className="w-[150px] bg-[#77829B] hover:bg-slate-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer"
                                disabled={isPending}
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
