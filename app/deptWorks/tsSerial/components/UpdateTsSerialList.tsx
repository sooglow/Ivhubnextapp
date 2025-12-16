import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useInput } from "@/public/hooks/useInput";
import { useTsSerialUpdate } from "../hooks/useTsSerial";
import axios from "axios";

interface UpdateTsSerialListProps {
    list: any;
    open: boolean;
    setOpen: (open: boolean) => void;
}

function UpdateTsSerialList({ list, open, setOpen }: UpdateTsSerialListProps) {
    const [salesArea, setSalesArea] = useState("30000");
    const [salesMan, setSalesMan] = useState("");
    const [areaItems, setAreaItems] = useState<any[]>([]);
    const [manItems, setManItems] = useState<any[]>([]);

    const comNameInput = useInput("", (value: string) => value.length <= 50);
    const idInput = useInput("", (value: string) => value.length <= 50);

    const { mutate: updateTsSerial, isPending } = useTsSerialUpdate(list?.comSerial || "");

    const cancelClick = () => {
        setOpen(false);
    };

    const saveBtnClick = () => {
        if (!window.confirm("저장하시겠습니까?")) {
            return;
        }

        updateTsSerial(
            {
                comSerial: list?.comSerial,
                name: comNameInput.value,
                idNo: idInput.value,
                manCode: salesMan,
                areaCode: salesArea,
            },
            {
                onSuccess: (data) => {
                    if (data.result) {
                        alert("수정되었습니다.");
                        setOpen(false);
                        window.location.replace("/deptWorks/tsSerial/List");
                    } else {
                        alert(data.errMsg || "수정에 실패했습니다.");
                    }
                },
                onError: (error: any) => {
                    alert(error.response?.data?.errMsg || "수정 중 오류가 발생했습니다.");
                },
            }
        );
    };

    // 지사목록 가져오기
    useEffect(() => {
        const fetchAreaItems = async () => {
            try {
                const response = await axios.get("/api/code?Kind=areacode");
                if (response.data.result) {
                    setAreaItems(response.data.data.items || []);
                }
            } catch (error) {
                console.error("Error fetching areacode:", error);
            }
        };

        fetchAreaItems();
    }, []);

    // 담당자목록 가져오기
    useEffect(() => {
        const fetchManItems = async () => {
            try {
                const response = await axios.get(
                    `/api/code?Kind=mancode&SubCode=${salesArea}`
                );
                if (response.data.result) {
                    setManItems(response.data.data.items || []);
                }
            } catch (error) {
                console.error("Error fetching mancode:", error);
            }
        };

        if (salesArea) {
            fetchManItems();
        }
    }, [salesArea]);

    // 모달이 열릴 때 데이터 설정
    useEffect(() => {
        if (open && list) {
            setSalesArea(list.areaCode ?? "30000");
            setSalesMan(list.manCode ?? "");
            comNameInput.setValue(list?.name ?? "");
            idInput.setValue(list?.idNo ?? "");
        }
    }, [open, list]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[720px]">
                <DialogHeader>
                    <DialogTitle>코드 접수</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <ul className=" md:w-full md:text-sm py-4">
                        <li className="w-full  flex  items-baseline  ">
                            <div className=" flex items-baseline ">
                                <label className="font-semibold ">시리얼</label>
                            </div>
                            <div className="pl-12 md:pl-8 ">{list?.comSerial ?? ""}</div>
                        </li>
                        <li className="w-full pt-6  flex justify-between items-baseline  ">
                            <div className=" flex items-baseline ">
                                <label className="font-semibold whitespace-nowrap">업체명</label>
                                <input
                                    className="w-[60%] appearance-none md:w-full ml-12 md:ml-8 h-12 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                    value={comNameInput.value}
                                    onChange={comNameInput.onChange}
                                    disabled={isPending}
                                />
                            </div>
                            <div className=" md:flex items-baseline hidden">
                                <label className=" font-semibold ">사업자번호</label>
                                <input
                                    className="ml-8 w-[60%] appearance-none h-12 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                    value={idInput.value}
                                    onChange={idInput.onChange}
                                    disabled={isPending}
                                />
                            </div>
                        </li>
                        <li className="w-full pt-6 flex justify-between items-baseline  md:hidden">
                            <div className=" md:hidden items-baseline flex">
                                <label className=" font-semibold ">사업자번호</label>
                                <input
                                    className="ml-5 w-[180px] h-12 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                    value={idInput.value}
                                    onChange={idInput.onChange}
                                    disabled={isPending}
                                />
                            </div>
                        </li>
                        <li className="w-full pt-6 flex  items-baseline ">
                            <div className="w-[50%] flex items-baseline ">
                                <label className="font-semibold whitespace-nowrap ">담당지사</label>
                                <select
                                    value={salesArea}
                                    onChange={(e) => {
                                        setSalesArea(e.target.value);
                                        setSalesMan("");
                                    }}
                                    className="ml-[34px] md:ml-5 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[130px] h-12 "
                                    disabled={isPending}
                                >
                                    {areaItems.map((item) => (
                                        <option key={item.code} value={item.code}>
                                            {item.codename}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-[50%] hidden items-baseline ml-9  md:flex">
                                <label className=" font-semibold pr-11">담당자</label>
                                <select
                                    value={salesMan}
                                    onChange={(e) => setSalesMan(e.target.value)}
                                    className=" ml-4 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[130px] h-12 "
                                    disabled={isPending}
                                >
                                    <option value="" disabled>
                                        선택
                                    </option>
                                    {manItems.map((item) => (
                                        <option key={item.code} value={item.code}>
                                            {item.codename}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </li>
                        <li className="w-full pt-6 flex justify-between items-baseline  md:hidden">
                            <div className=" flex items-baseline">
                                <label className=" font-semibold pr-11">담당자</label>
                                <select
                                    value={salesMan}
                                    onChange={(e) => setSalesMan(e.target.value)}
                                    className="ml-1 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[130px] h-12 "
                                    disabled={isPending}
                                >
                                    <option value="" disabled>
                                        선택
                                    </option>
                                    {manItems.map((item) => (
                                        <option key={item.code} value={item.code}>
                                            {item.codename}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </li>
                    </ul>
                    <div className="flex justify-center items-center pt-3 mx-auto">
                        <div>
                            <button
                                onClick={cancelClick}
                                className="w-[160px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none "
                                disabled={isPending}
                            >
                                취소
                            </button>
                        </div>
                        <div className="pl-2">
                            <button
                                onClick={saveBtnClick}
                                className="w-[160px] bg-[#77829B] hover:bg-slate-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                                disabled={isPending}
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

export default UpdateTsSerialList;
