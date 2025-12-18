"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useInput } from "@/public/hooks/useInput";
import { useUpdateSalesActivity, useDeleteSalesActivity } from "../hooks/useSalesHist";
import { SalesActivityItem } from "../types/Activity";

interface UpdateSalesHistModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedActivity: SalesActivityItem | null;
}

// 프로그램 목록 타입
interface PrgItem {
    code: string;
    codeName: string;
}

export default function UpdateSalesHistModal({
    open,
    setOpen,
    selectedActivity,
}: UpdateSalesHistModalProps) {
    const [salesType, setSalesType] = useState("신규-업글");
    const [prg, setPrg] = useState("");
    const [prgItems, setPrgItems] = useState<PrgItem[]>([]);

    // input 관련 커스텀 훅 설정
    const comNameInput = useInput("", (value: string) => value.length <= 50);
    const comCodeInput = useInput("", (value: string) => value.length <= 50);
    const saleDayInput = useInput("", (value: string) => value.length <= 50);
    const saleHourInput = useInput("0", (value: string) => value.length <= 50);
    const billPriceInput = useInput("0", (value: string) => value.length <= 50);
    const upgradePriceInput = useInput("0", (value: string) => value.length <= 50);
    const installPriceInput = useInput("0", (value: string) => value.length <= 50);
    const installPriceAddInput = useInput("0", (value: string) => value.length <= 50);
    const specialMemoInput = useInput("", (value: string) => value.length <= 500);

    const updateMutation = useUpdateSalesActivity(selectedActivity?.actSerial || "");
    const deleteMutation = useDeleteSalesActivity(selectedActivity?.actSerial || "");

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

    // 선택된 활동 데이터 로드
    useEffect(() => {
        if (open && selectedActivity) {
            setPrg(selectedActivity.prgCode || "");
            setSalesType(selectedActivity.salesType || "신규-업글");
            comNameInput.setValue(selectedActivity.comName || "");
            comCodeInput.setValue(selectedActivity.comCode || "");
            saleDayInput.setValue(selectedActivity.saleDay || "");
            saleHourInput.setValue(selectedActivity.saleHour?.toString() || "0");
            billPriceInput.setValue(selectedActivity.billPrice?.toString() || "0");
            upgradePriceInput.setValue(selectedActivity.upgradePrice?.toString() || "0");
            installPriceInput.setValue(selectedActivity.installPrice?.toString() || "0");
            installPriceAddInput.setValue(selectedActivity.installPriceAdd?.toString() || "0");
            specialMemoInput.setValue(selectedActivity.specialMemo || "");
        }
    }, [open, selectedActivity]);

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
        if (!selectedActivity) return;

        if (!comNameInput.value) {
            alert("업체명을 입력해주세요.");
            return;
        }

        if (window.confirm("저장하시겠습니까?")) {
            updateMutation.mutate(
                {
                    actSeqNo: selectedActivity.actSeqNo,
                    comName: comNameInput.value,
                    comCode: comCodeInput.value || "",
                    comIdno: "",
                    prgCode: prg,
                    billPrice: parseInt(billPriceInput.value) || 0,
                    installPrice: parseInt(installPriceInput.value) || 0,
                    installPriceAdd: parseInt(installPriceAddInput.value) || 0,
                    upgradePrice: parseInt(upgradePriceInput.value) || 0,
                    userMax: 0,
                    saleHour: parseInt(saleHourInput.value) || 0,
                    specialMemo: specialMemoInput.value || "",
                    stateName: "납품",
                    saleDay: saleDayInput.value,
                    salesType: salesType,
                },
                {
                    onSuccess: () => {
                        alert("수정되었습니다.");
                        setOpen(false);
                    },
                    onError: (error: any) => {
                        alert(error.message || "수정 중 오류가 발생했습니다.");
                    },
                }
            );
        }
    };

    const handleDelete = () => {
        if (!selectedActivity) return;

        if (window.confirm("삭제하시겠습니까?")) {
            deleteMutation.mutate(selectedActivity.actSeqNo, {
                onSuccess: () => {
                    alert("삭제되었습니다.");
                    setOpen(false);
                },
                onError: (error: any) => {
                    alert(error.message || "삭제 중 오류가 발생했습니다.");
                },
            });
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
                                    <option value="신규-업글">신규-업글</option>
                                    <option value="대수추가">대수추가</option>
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
                                            {item.codeName}
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
                        <li className="w-full flex justify-between items-baseline pt-5">
                            <div className="flex items-baseline">
                                <label className="font-semibold whitespace-nowrap">월 사용료</label>
                                <input
                                    className="ml-10 md:ml-4 h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                    value={billPriceInput.value}
                                    onChange={(e) => handleNumberInputChange(billPriceInput, e)}
                                />
                            </div>
                            <div className="md:flex items-baseline hidden">
                                <label className="font-semibold pr-[34px]">업글비</label>
                                <input
                                    className="w-[180px] h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                    value={upgradePriceInput.value}
                                    onChange={(e) => handleNumberInputChange(upgradePriceInput, e)}
                                />
                            </div>
                        </li>
                        <li className="w-full flex justify-between items-baseline pt-5">
                            <div className="flex items-baseline">
                                <label className="font-semibold whitespace-nowrap pr-2">설치비</label>
                                <input
                                    className="ml-12 md:ml-[25px] h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                    value={installPriceInput.value}
                                    onChange={(e) => handleNumberInputChange(installPriceInput, e)}
                                />
                            </div>
                            <div className="md:flex items-baseline hidden">
                                <label className="font-semibold pr-2">추가설치비</label>
                                <input
                                    className="w-[180px] h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                    value={installPriceAddInput.value}
                                    onChange={(e) =>
                                        handleNumberInputChange(installPriceAddInput, e)
                                    }
                                />
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
                                <option value="신규-업글">신규-업글</option>
                                <option value="대수추가">대수추가</option>
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
                                        {item.codeName}
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
                        <li className="w-full flex-col items-baseline pt-4">
                            <div className="flex items-baseline">
                                <label className="font-semibold whitespace-nowrap">월 사용료</label>
                            </div>
                            <input
                                className="mt-2 h-10 w-full bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                value={billPriceInput.value}
                                onChange={(e) => handleNumberInputChange(billPriceInput, e)}
                            />
                        </li>
                        <li className="w-full flex-col items-baseline pt-4">
                            <div className="items-baseline">
                                <label className="font-semibold pr-[34px]">업글비</label>
                            </div>
                            <input
                                className="mt-2 w-full h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                value={upgradePriceInput.value}
                                onChange={(e) => handleNumberInputChange(upgradePriceInput, e)}
                            />
                        </li>
                        <li className="w-full flex-col items-baseline pt-4">
                            <div className="flex items-baseline">
                                <label className="font-semibold whitespace-nowrap pr-2">설치비</label>
                            </div>
                            <input
                                className="mt-2 h-10 w-full bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                value={installPriceInput.value}
                                onChange={(e) => handleNumberInputChange(installPriceInput, e)}
                            />
                        </li>
                        <li className="w-full flex-col items-baseline pt-4">
                            <div className="items-baseline">
                                <label className="font-semibold pr-2">추가설치비</label>
                            </div>
                            <input
                                className="w-full h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                value={installPriceAddInput.value}
                                onChange={(e) => handleNumberInputChange(installPriceAddInput, e)}
                            />
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
                                className="w-[110px] px-4 py-2 text-white bg-[#77829B] border-transparent rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                                onClick={handleCancel}
                            >
                                취소
                            </button>
                        </div>
                        <div className="pl-2">
                            <button
                                className="w-[110px] px-4 py-2 text-white bg-[#77829B] border-transparent rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                                onClick={handleDelete}
                            >
                                삭제
                            </button>
                        </div>
                        <div className="pl-2">
                            <button
                                className="w-[110px] bg-[#A50A2E] hover:bg-slate-600 text-white px-4 py-2 border border-transparent rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                                onClick={handleSave}
                            >
                                수정
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
