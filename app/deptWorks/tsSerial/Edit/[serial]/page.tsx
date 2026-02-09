"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useInput } from "@/public/hooks/useInput";
import { useTsSerialView, useTsSerialUpdate } from "../../hooks/useTsSerial";
import axiosInstance from "@/public/lib/axiosInstance";

interface TsSerialEditProps {
    params: Promise<{ serial: string }>;
}

export default function TsSerialEdit({ params }: TsSerialEditProps) {
    const router = useRouter();
    const [serial, setSerial] = useState<string>("");
    const [areaItems, setAreaItems] = useState<any[]>([]);
    const [manItems, setManItems] = useState<any[]>([]);
    const [post, setPost] = useState<any>({});
    const [areaCode, setAreaCode] = useState<string>("30000");
    const [manCode, setManCode] = useState<string>("");

    const comNameInput = useInput("", (value: string) => value.length <= 50);
    const idInput = useInput("", (value: string) => value.length <= 50);

    const comNameRef = useRef<HTMLInputElement>(null);

    const { data, isLoading } = useTsSerialView(serial);
    const { mutate: updateTsSerial, isPending } = useTsSerialUpdate(serial);

    const cancelClick = () => {
        router.push(`/deptWorks/tsSerial/View/${serial}`);
    };

    const saveBtnClick = () => {
        if (comNameInput.value.length < 2) {
            alert("업체명은 2자 이상 입력해 주세요.");
            comNameRef.current?.focus();
            return;
        }

        if (!window.confirm("저장하시겠습니까?")) {
            return;
        }

        updateTsSerial(
            {
                comSerial: serial,
                name: comNameInput.value,
                idNo: idInput.value,
                manCode: manCode,
                areaCode: areaCode,
            },
            {
                onSuccess: () => {
                    alert("수정되었습니다.");
                    window.location.href = `/deptWorks/tsSerial/View/${serial}`;
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

    // 지사 목록 가져오기
    useEffect(() => {
        const fetchAreaItems = async () => {
            try {
                const response = await axiosInstance.get("/api/code?Kind=areacode");
                if (response.data.result) {
                    setAreaItems(response.data.data.items || []);
                }
            } catch (error) {
                console.error("Error fetching areacode:", error);
            }
        };

        fetchAreaItems();
    }, []);

    // 담당자 목록 가져오기 (지사 변경시마다)
    useEffect(() => {
        const fetchManItems = async () => {
            try {
                const response = await axiosInstance.get(`/api/code?Kind=mancode&SubCode=${areaCode}`);
                if (response.data.result) {
                    setManItems(response.data.data.items || []);
                }
            } catch (error) {
                console.error("Error fetching mancode:", error);
            }
        };

        if (areaCode) {
            fetchManItems();
        }
    }, [areaCode]);

    // 상세 데이터 로드 후 폼에 설정
    useEffect(() => {
        if (data?.data) {
            const _data = data.data;
            setPost(_data);
            comNameInput.setValue(_data.name || "");
            idInput.setValue(_data.idNo || "");
            setAreaCode(_data.areaCode || "30000");
            setManCode(_data.manCode || "");
        }
    }, [data]);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto px-4 pb-20">
                    <h2 className="md:pl-4 font-semibold text-2xl py-4 md:py-8">
                        국토부 시리얼 관리
                    </h2>

                    <div className="md:w-full md:h-full md:rounded-md md:border-[#E1E1E1] md:border-[1px]">
                        <ul className="space-y-4 pt-2 md:pt-[30px] md:p-4">
                            <li className="md:mx-4">
                                <div className="flex items-baseline">
                                    <p className="font-semibold whitespace-nowrap">시리얼</p>
                                    <div className="ml-12 md:ml-8">{post.comSerial ?? ""}</div>
                                </div>
                            </li>
                            <li className="md:mx-4">
                                <div className="md:flex md:justify-between md:pt-2">
                                    <div className="flex items-baseline">
                                        <p className="font-semibold whitespace-nowrap">업체명</p>
                                        <input
                                            ref={comNameRef}
                                            className="w-[60%] appearance-none md:w-full ml-12 md:ml-8 h-12 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={comNameInput.value}
                                            onChange={comNameInput.onChange}
                                            disabled={isLoading || isPending}
                                        />
                                    </div>
                                    <div className="md:flex items-baseline hidden">
                                        <p className="font-semibold whitespace-nowrap">사업자번호</p>
                                        <input
                                            className="ml-8 w-[60%] appearance-none h-12 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={idInput.value}
                                            onChange={idInput.onChange}
                                            disabled={isLoading || isPending}
                                        />
                                    </div>
                                </div>
                            </li>
                            <li className="md:mx-4 pt-6 md:hidden">
                                <div className="flex items-baseline">
                                    <p className="font-semibold whitespace-nowrap">사업자번호</p>
                                    <input
                                        className="ml-5 w-[180px] h-12 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                        value={idInput.value}
                                        onChange={idInput.onChange}
                                        disabled={isLoading || isPending}
                                    />
                                </div>
                            </li>
                            <li className="md:mx-4">
                                <div className="md:flex md:justify-between md:pt-2">
                                    <div className="w-[50%] flex items-baseline">
                                        <p className="font-semibold whitespace-nowrap">담당지사</p>
                                        <select
                                            value={areaCode}
                                            onChange={(e) => {
                                                setAreaCode(e.target.value);
                                                setManCode("");
                                            }}
                                            className="ml-[34px] md:ml-5 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[130px] h-12"
                                            disabled={isLoading || isPending}
                                        >
                                            {areaItems.map((item) => (
                                                <option key={item.code} value={item.code}>
                                                    {item.codename}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-[50%] hidden items-baseline ml-9 md:flex">
                                        <p className="font-semibold pr-11">담당자</p>
                                        <select
                                            value={manCode}
                                            onChange={(e) => setManCode(e.target.value)}
                                            className="ml-4 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[130px] h-12"
                                            disabled={isLoading || isPending}
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
                                </div>
                            </li>
                            <li className="md:mx-4 pt-6 md:hidden">
                                <div className="flex items-baseline">
                                    <p className="font-semibold pr-11">담당자</p>
                                    <select
                                        value={manCode}
                                        onChange={(e) => setManCode(e.target.value)}
                                        className="ml-1 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[130px] h-12"
                                        disabled={isLoading || isPending}
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
                    </div>

                    <div className="flex justify-center pt-3 space-x-4 pb-20">
                        <div>
                            <button
                                onClick={cancelClick}
                                className="w-[160px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                                disabled={isLoading || isPending}
                            >
                                취소
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={saveBtnClick}
                                className="w-[160px] bg-[#77829B] hover:bg-slate-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
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
