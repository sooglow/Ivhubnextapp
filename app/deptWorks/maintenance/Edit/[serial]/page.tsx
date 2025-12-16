"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useInput } from "@/public/hooks/useInput";
import { useMaintenanceView, useMaintenanceUpdate } from "../../hooks/useMaintenance";
import { MAINTENANCESRESULT } from "@/public/constants/etcSales";
import axios from "axios";

interface MaintenanceEditProps {
    params: Promise<{ serial: string }>;
}

export default function MaintenanceEdit({ params }: MaintenanceEditProps) {
    const router = useRouter();
    const [serial, setSerial] = useState<string>("");
    const [mItems, setMItems] = useState<any[]>([]);
    const [post, setPost] = useState<any>({});

    const subjectInput = useInput("", (value: string) => value.length <= 100);
    const asMemoInput = useInput("", (value: string) => value.length <= 5000);
    const asResultInput = useInput("", (value: string) => value.length <= 5000);
    const bigoInput = useInput("", (value: string) => value.length <= 5000);
    const asDayInput = useInput("", (value: string) => value.length <= 5000);

    const subjectRef = useRef<HTMLInputElement>(null);

    const { data, isLoading } = useMaintenanceView(serial);
    const { mutate: updateMaintenance, isPending } = useMaintenanceUpdate(serial);

    const cancelClick = () => {
        router.push(`/deptWorks/maintenance/View/${serial}`);
    };

    const saveBtnClick = () => {
        if (subjectInput.value.length < 5) {
            alert("제목은 5자 이상 입력해 주세요.");
            subjectRef.current?.focus();
            return;
        }

        if (!window.confirm("저장하시겠습니까?")) {
            return;
        }

        updateMaintenance(
            {
                asDay: asDayInput.value,
                userId: "",
                comCode: post.comCode,
                subject: subjectInput.value,
                result: post.result,
                asMemo: asMemoInput.value,
                asResult: asResultInput.value,
                bigo: bigoInput.value,
            },
            {
                onSuccess: () => {
                    alert("수정되었습니다.");
                    window.location.href = `/deptWorks/maintenance/View/${serial}`;
                },
                onError: (error: any) => {
                    alert(error.response?.data?.errMsg || "수정에 실패했습니다.");
                },
            }
        );
    };

    // params 처리
    useEffect(() => {
        params.then((p) => {
            setSerial(p.serial);
        });
    }, [params]);

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
    }, []);

    // 상세 데이터 로드 후 폼에 설정
    useEffect(() => {
        if (data?.data) {
            const _data = data.data;
            setPost(_data);
            subjectInput.setValue(_data.subject || "");
            asMemoInput.setValue(_data.asMemo || "");
            asResultInput.setValue(_data.asResult || "");
            bigoInput.setValue(_data.bigo || "");

            if (_data.asDay) {
                const dateStr = _data.asDay.includes("T")
                    ? _data.asDay.split("T")[0]
                    : _data.asDay.split(" ")[0];
                asDayInput.setValue(dateStr);
            }
        }
    }, [data]);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto px-4 pb-20">
                    <h2 className="md:pl-4 font-semibold text-2xl py-4 md:py-8">
                        유지보수 계약업체A/S
                    </h2>

                    <div className="md:w-full md:h-full md:rounded-md md:border-[#E1E1E1] md:border-[1px]">
                        <ul className="space-y-4 pt-2 md:pt-[30px] md:p-4">
                            <li className="md:mx-4">
                                <div className="md:flex md:justify-between md:pt-2">
                                    <div className="flex items-baseline">
                                        <p className="font-semibold whitespace-nowrap">계약업체</p>
                                        <select
                                            value={post.comCode || ""}
                                            onChange={(e) => {
                                                setPost((prev: any) => ({
                                                    ...prev,
                                                    comCode: e.target.value,
                                                }));
                                            }}
                                            className="w-[50%] h-12 pl-4 ml-6 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[200px] md:h-12"
                                            disabled={isLoading || isPending}
                                        >
                                            {mItems.map((item) => (
                                                <option key={item.code} value={item.code}>
                                                    {item.codename}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-baseline pt-4">
                                        <p className="font-semibold whitespace-nowrap">접수일자</p>
                                        <input
                                            type="date"
                                            className="w-[200px] ml-6 h-12 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-2 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={asDayInput.value}
                                            onChange={asDayInput.onChange}
                                            disabled={isLoading || isPending}
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
                                        disabled={isLoading || isPending}
                                    />
                                </div>
                            </li>
                            <div className="md:mx-4 md:pb-8">
                                <p className="font-semibold pb-2">접수내용</p>
                                <div className="border rounded-md border-[#E1E1E1]">
                                    <textarea
                                        className="w-full h-[150px] px-4 overflow-scroll overflow-x-hidden pt-1 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                                        value={asMemoInput.value}
                                        onChange={asMemoInput.onChange}
                                        disabled={isLoading || isPending}
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
                                        disabled={isLoading || isPending}
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
                                        disabled={isLoading || isPending}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="md:mx-4 md:pb-8">
                                <p className="font-semibold pb-2">상태</p>
                                <select
                                    value={post.result || ""}
                                    onChange={(e) => {
                                        setPost((prev: any) => ({
                                            ...prev,
                                            result: e.target.value,
                                        }));
                                    }}
                                    className="h-12 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[180px]"
                                    disabled={isLoading || isPending}
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
                    <div className="flex justify-center items-center pt-3 mx-auto">
                        <div>
                            <button
                                onClick={cancelClick}
                                className="w-[150px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                                disabled={isLoading || isPending}
                            >
                                취소
                            </button>
                        </div>
                        <div className="pl-2">
                            <button
                                onClick={saveBtnClick}
                                className="w-[150px] bg-[#77829B] hover:bg-slate-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                                disabled={isLoading || isPending}
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
