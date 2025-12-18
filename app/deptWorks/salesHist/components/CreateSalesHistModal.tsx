"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useInput } from "@/public/hooks/useInput";
import { useCreateSalesActivity } from "../hooks/useSalesHist";
import { SalesInquiryItem } from "../types/List";

interface CreateSalesHistModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedInquiry: SalesInquiryItem | null;
}

// 프로그램 목록 타입
interface PrgItem {
    code: string;
    codename: string;
}

export default function CreateSalesHistModal({
    open,
    setOpen,
    selectedInquiry,
}: CreateSalesHistModalProps) {
    const [salesType, setSalesType] = useState("청약");
    const [prg, setPrg] = useState("100");
    const [prgItems, setPrgItems] = useState<PrgItem[]>([]);
    const [currentDate] = useState(new Date().toISOString().split("T")[0]);

    // input 관련 커스텀 훅 설정
    const comNameInput = useInput("", (value: string) => value.length <= 50);
    const comCodeInput = useInput("", (value: string) => value.length <= 50);
    const saleDayInput = useInput(currentDate, (value: string) => value.length <= 50);
    const saleHourInput = useInput("0", (value: string) => value.length <= 50);
    const specialMemoInput = useInput("", (value: string) => value.length <= 500);

    const createMutation = useCreateSalesActivity();

    // 프로그램 목록 가져오기
    useEffect(() => {
        if (open) {
            fetch("/api/code?Kind=prgcode")
                .then((res) => res.json())
                .then((data) => {
                    if (data.result && data.data?.items) {
                        setPrgItems(data.data.items);
                    }
                })
                .catch((error) => console.error("Program list error:", error));
        }
    }, [open]);

    // 영업문의에서 온 경우 업체 정보 자동 입력
    useEffect(() => {
        if (open && selectedInquiry) {
            comCodeInput.setValue(selectedInquiry.comCode || "");
            comNameInput.setValue(selectedInquiry.comName || "");

            // prgItems가 로드된 후 솔루션 자동 선택
            if (prgItems.length > 0 && selectedInquiry.prgName) {
                const foundPrg = prgItems.find((item) => item.codename === selectedInquiry.prgName);
                if (foundPrg) {
                    setPrg(foundPrg.code);
                }
            }
        } else if (open && !selectedInquiry) {
            // 작성하기 버튼으로 열린 경우 초기화
            comCodeInput.setValue("");
            comNameInput.setValue("");
            setPrg("100");
            setSalesType("청약");
            saleDayInput.setValue(currentDate);
            saleHourInput.setValue("0");
            specialMemoInput.setValue("");
        }
    }, [open, selectedInquiry, prgItems]);

    const handleNumberInputChange = (
        input: ReturnType<typeof useInput>,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;

        if (value.trim() !== "" && isNaN(Number(value))) {
            alert("숫자만 입력해주세요.");
            return;
        }

        input.onChange(e);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleSave = () => {
        if (!comNameInput.value) {
            alert("업체명을 입력해주세요.");
            return;
        }

        if (window.confirm("저장하시겠습니까?")) {
            createMutation.mutate(
                {
                    comName: comNameInput.value,
                    comCode: comCodeInput.value || "",
                    prgCode: prg,
                    saleHour: parseInt(saleHourInput.value) || 0,
                    specialMemo: specialMemoInput.value || "",
                    stateName: "영업활동",
                    saleDay: saleDayInput.value,
                    salesType: salesType,
                },
                {
                    onSuccess: () => {
                        alert("저장되었습니다.");
                        setOpen(false);
                    },
                    onError: (error: any) => {
                        alert(error.message || "저장 중 오류가 발생했습니다.");
                    },
                }
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[720px] max-h-[667px] overflow-auto">
                <DialogHeader>
                    <DialogTitle>영업 활동</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    {/* 데스크톱 */}
                    <ul className="md:w-full md:text-sm py-4 hidden md:block">
                        <li className="w-full flex justify-between items-baseline">
                            <div className="flex items-baseline">
                                <label className="font-semibold whitespace-nowrap">업체명</label>
                                <input
                                    className="ml-12 md:ml-8 h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                    value={comNameInput.value}
                                    onChange={comNameInput.onChange}
                                />
                            </div>
                            <div className="md:flex items-baseline hidden">
                                <label className="font-semibold pr-[20px]">업체코드</label>
                                <input
                                    className="w-[180px] h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                    value={comCodeInput.value}
                                    onChange={comCodeInput.onChange}
                                />
                            </div>
                        </li>
                        <li className="w-full pt-5 flex justify-between items-baseline">
                            <div className="flex items-baseline">
                                <label className="font-semibold">유형</label>
                                <select
                                    className="ml-[34px] md:ml-[45px] pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[130px] h-10"
                                    value={salesType}
                                    onChange={(e) => setSalesType(e.target.value)}
                                >
                                    <option value="청약">청약</option>
                                    <option value="AS">AS</option>
                                    <option value="교육">교육</option>
                                    <option value="상담">상담</option>
                                    <option value="차계부">차계부</option>
                                </select>
                            </div>
                            <div className="hidden items-baseline md:flex">
                                <label className="font-semibold pr-[13px]">솔루션</label>
                                <select
                                    value={prg}
                                    onChange={(e) => setPrg(e.target.value)}
                                    className="ml-[34px] md:ml-5 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[180px] h-10"
                                >
                                    {prgItems.map((item) => (
                                        <option key={item.code} value={item.code}>
                                            {item.codename}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </li>
                        <li className="w-full flex justify-between items-baseline pt-5">
                            <div className="flex items-baseline">
                                <label className="font-semibold whitespace-nowrap">활동일자</label>
                                <input
                                    type="date"
                                    className="ml-12 md:ml-[20px] h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                    value={saleDayInput.value}
                                    onChange={saleDayInput.onChange}
                                />
                            </div>
                            <div className="md:flex items-baseline hidden">
                                <label className="font-semibold pr-[20px]">활동시간</label>
                                <input
                                    className="w-[80px] h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                    value={saleHourInput.value}
                                    onChange={(e) => handleNumberInputChange(saleHourInput, e)}
                                />
                                <label className="pr-[45px] pl-1">시간(분)</label>
                            </div>
                        </li>
                        <li className="w-full flex-col items-baseline pt-5">
                            <div className="flex items-baseline">
                                <label className="font-semibold whitespace-nowrap">활동내용</label>
                            </div>
                            <input
                                className="mt-2 h-10 w-[600px] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                value={specialMemoInput.value}
                                onChange={specialMemoInput.onChange}
                            />
                        </li>
                    </ul>

                    {/* 모바일 */}
                    <ul className="py-4 block md:hidden">
                        <li className="w-full flex-col items-baseline">
                            <div className="flex items-baseline">
                                <label className="font-semibold whitespace-nowrap">업체명</label>
                            </div>
                            <input
                                className="h-10 mt-2 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm w-full"
                                value={comNameInput.value}
                                onChange={comNameInput.onChange}
                            />
                        </li>
                        <li className="w-full flex-col items-baseline pt-4">
                            <div className="items-baseline">
                                <label className="font-semibold pr-[20px]">업체코드</label>
                            </div>
                            <input
                                className="w-full mt-2 h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                value={comCodeInput.value}
                                onChange={comCodeInput.onChange}
                            />
                        </li>
                        <li className="w-full pt-4 flex-col items-baseline">
                            <div className="flex items-baseline">
                                <label className="font-semibold">유형</label>
                            </div>
                            <select
                                className="pl-4 mt-2 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[130px] h-12"
                                value={salesType}
                                onChange={(e) => setSalesType(e.target.value)}
                            >
                                <option value="청약">청약</option>
                                <option value="AS">AS</option>
                                <option value="교육">교육</option>
                                <option value="상담">상담</option>
                                <option value="차계부">차계부</option>
                            </select>
                        </li>
                        <li className="w-full flex-col items-baseline pt-4">
                            <div className="items-baseline pt-4">
                                <label className="font-semibold">솔루션</label>
                            </div>
                            <select
                                value={prg}
                                onChange={(e) => setPrg(e.target.value)}
                                className="pl-4 mt-2 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-full h-12"
                            >
                                {prgItems.map((item) => (
                                    <option key={item.code} value={item.code}>
                                        {item.codename}
                                    </option>
                                ))}
                            </select>
                        </li>
                        <li className="w-full flex-col items-baseline pt-4">
                            <div className="flex items-baseline">
                                <label className="font-semibold whitespace-nowrap">활동일자</label>
                            </div>
                            <input
                                type="date"
                                className="w-full mt-2 h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 text-sm"
                                value={saleDayInput.value}
                                onChange={saleDayInput.onChange}
                            />
                        </li>
                        <li className="w-full flex-col items-baseline pt-4">
                            <div className="items-baseline">
                                <label className="font-semibold pr-[20px]">활동시간</label>
                            </div>
                            <div className="flex items-baseline pt-2">
                                <input
                                    className="w-[80px] h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 text-sm"
                                    value={saleHourInput.value}
                                    onChange={(e) => handleNumberInputChange(saleHourInput, e)}
                                />
                                <label className="pr-[45px] pl-1">시간(분)</label>
                            </div>
                        </li>
                        <li className="w-full flex-col items-baseline pt-5">
                            <div className="flex items-baseline">
                                <label className="font-semibold whitespace-nowrap">활동내용</label>
                            </div>
                            <input
                                className="mt-2 h-10 w-full bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                value={specialMemoInput.value}
                                onChange={specialMemoInput.onChange}
                            />
                        </li>
                    </ul>
                    <div className="flex justify-center items-center pt-3 mx-auto">
                        <div>
                            <button
                                className="w-[160px] px-4 py-2 text-white bg-[#77829B] border-transparent rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                                onClick={handleCancel}
                            >
                                취소
                            </button>
                        </div>
                        <div className="pl-2">
                            <button
                                className="w-[160px] bg-[#A50A2E] hover:bg-slate-600 text-white px-4 py-2 border border-transparent rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                                onClick={handleSave}
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
