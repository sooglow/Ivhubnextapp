"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInput } from "@/public/hooks/useInput";
import { parseJWT } from "@/public/utils/utils";
import { useEtcSalesCreate } from "../hooks/useEtcSalesView";
import { UserInfo } from "../types/Create";
import { ETCSALEKIND, ETCSALESKIND } from "@/public/constants/etcSales";
import CreateNewShopList from "../components/CreateNewShopList";

export default function EtcSalesCreate() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

    const comNameInput = useInput("", (value: string) => value.length <= 50);
    const telInput = useInput("", (value: string) => value.length <= 50);
    const hpInput = useInput("", (value: string) => value.length <= 50);
    const areaInput = useInput("", (value: string) => value.length <= 50);
    const receipterInput = useInput("", (value: string) => value.length <= 50);
    const addrInput = useInput("", (value: string) => value.length <= 50);
    const qtyInput = useInput("0", (value: string) => value.length <= 50);
    const reqsumInput = useInput("0", (value: string) => value.length <= 50);
    const inTotalInput = useInput("0", (value: string) => value.length <= 50);
    const descrInput = useInput("", (value: string) => value.length <= 5000);
    const sendDayInput = useInput("", (value: string) => value.length <= 50);

    const [comCode, setComCode] = useState("");
    const [area, setArea] = useState("");
    const [kind, setKind] = useState("");
    const [skind, setSkind] = useState("");

    const createMutation = useEtcSalesCreate();

    const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.trim() !== "" && isNaN(Number(value))) {
            alert("접수수량은 숫자만 입력해주세요.");
            return;
        }
        qtyInput.onChange(e);
    };

    const handleReqsumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.trim() !== "" && isNaN(Number(value))) {
            alert("접수금액은 숫자만 입력해주세요.");
            return;
        }
        reqsumInput.onChange(e);
    };

    // 업체 선택 시 업체 정보 자동 입력
    useEffect(() => {
        const fetchCompanyInfo = async () => {
            if (!comCode) return;

            try {
                const response = await fetch(`/api/shop/${comCode}`);
                const data = await response.json();

                if (data.result && data.data && data.data.comInfo) {
                    const companyInfo = data.data.comInfo;
                    comNameInput.setValue(companyInfo.comName || "");
                    areaInput.setValue(companyInfo.areaName || area);
                    telInput.setValue(companyInfo.tel || "");
                    hpInput.setValue(companyInfo.hp || "");
                    receipterInput.setValue(companyInfo.boss || "");
                    addrInput.setValue(companyInfo.address || "");
                }
            } catch (error) {
                console.error("Error fetching company info:", error);
            }
        };

        fetchCompanyInfo();
    }, [comCode]);

    const handleSave = () => {
        if (!window.confirm("저장하시겠습니까?")) return;

        createMutation.mutate(
            {
                etcSalesSerial: "",
                comName: comNameInput.value,
                comCode: comCode,
                recMan: userInfo.userId,
                tel: telInput.value,
                hp: hpInput.value,
                area: areaInput.value,
                addr: addrInput.value,
                receipter: receipterInput.value,
                kind: kind,
                skind: skind,
                qty: parseInt(qtyInput.value) || 0,
                reqSum: parseInt(reqsumInput.value) || 0,
                inTotal: parseInt(inTotalInput.value) || 0,
                misu: parseInt(reqsumInput.value) || 0,
                descr: descrInput.value,
                state: "0",
                sendDay: sendDayInput.value,
            },
            {
                onSuccess: (response) => {
                    if (response.result) {
                        alert("저장되었습니다.");
                        router.push("/deptWorks/etcSales/List");
                        router.refresh();
                    } else {
                        alert(response.errMsg || "저장에 실패했습니다.");
                    }
                },
                onError: (error) => {
                    alert("저장 중 오류가 발생했습니다: " + error.message);
                },
            }
        );
    };

    const handleCancel = () => {
        router.push("/deptWorks/etcSales/List");
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const tokenItem = localStorage.getItem("atKey");
            const token = tokenItem ? JSON.parse(tokenItem)?.token : null;
            const payload = parseJWT(token);
            if (payload) {
                setUserInfo(payload as UserInfo);
            }
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow pt-4 md:p-4 md:pt-8">
                <div className="max-w-6xl mx-auto px-4 pb-20">
                    <h2 className="md:pl-4 font-semibold text-2xl">통장,양식지 접수</h2>

                    {/* PC 업체정보 섹션 */}
                    <div className="h-[58px] mx-auto mt-4 md:mt-8 flex justify-between rounded-tl-md rounded-tr-md border-[#E1E1E1] border-[1px] w-full md:h-[58px] md:mx-0 md:rounded-tl-md md:rounded-tr-md md:border-[#E1E1E1] md:border-0 md:border-x md:border-t">
                        <p className="pl-4 md:pl-4 font-semibold text-[16px] text-[#A50A2E] my-auto">
                            업체정보
                        </p>
                    </div>

                    {/* PC 업체정보 */}
                    <div className="md:w-full pb-8 md:rounded-bl-md md:rounded-br-md md:border-[#E1E1E1] md:border-[1px] hidden md:block">
                        <div className="mx-auto">
                            <ul className="space-y-4 md:pl-8 md:mt-[30px] md:w-full md:text-sm">
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div>
                                        <label className="font-semibold pr-10">거래처명</label>
                                        <input
                                            className="bg-white border border-[#E1E1E1] rounded-md py-[10px] mr-3 pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={comNameInput.value}
                                            onChange={comNameInput.onChange}
                                        />
                                        <CreateNewShopList
                                            setComCode={setComCode}
                                            setArea={setArea}
                                        />
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2">
                                        <label className="pr-[66px] font-semibold">지역</label>
                                        <input
                                            className="w-[180px] h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={areaInput.value}
                                            onChange={areaInput.onChange}
                                        />
                                    </div>
                                    <div className="w-1/2 mr-10 flex items-baseline">
                                        <label className="font-semibold pr-10">연락처</label>
                                        <input
                                            className="w-[180px] h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={telInput.value}
                                            onChange={telInput.onChange}
                                        />
                                        <div className="pl-4">
                                            <input
                                                className="w-[180px] h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                                value={hpInput.value}
                                                onChange={hpInput.onChange}
                                            />
                                        </div>
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2">
                                        <label className="pr-10 font-semibold">입금자명</label>
                                        <input
                                            className="bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={receipterInput.value}
                                            onChange={receipterInput.onChange}
                                        />
                                    </div>
                                    <div className="w-1/2 mr-10">
                                        <label className="pr-10 font-semibold">배송지</label>
                                        <input
                                            className="w-[375px] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={addrInput.value}
                                            onChange={addrInput.onChange}
                                        />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 모바일 업체정보 */}
                    <div className="w-full mx-auto pb-8 rounded-bl-md rounded-br-md border-[#E1E1E1] border-[1px] block md:hidden">
                        <div className="mx-auto">
                            <ul className="space-y-1 px-4 pt-4 w-full text-sm">
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2">
                                        <label className="font-semibold pr-10">거래처명</label>
                                        <input
                                            className="mt-2 w-[180px] h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={comNameInput.value}
                                            onChange={comNameInput.onChange}
                                        />
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2">
                                        <label className="pr-[66px] font-semibold">지역</label>
                                        <input
                                            className="mt-2 w-[140px] h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={areaInput.value}
                                            onChange={areaInput.onChange}
                                        />
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2">
                                        <label className="pr-[66px] font-semibold">연락처</label>
                                        <input
                                            className="mt-2 w-[180px] h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={telInput.value}
                                            onChange={telInput.onChange}
                                        />
                                    </div>
                                </li>
                                <div className="w-1/2 mr-10 flex items-baseline">
                                    <input
                                        className="w-[180px] h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                        value={hpInput.value}
                                        onChange={hpInput.onChange}
                                    />
                                </div>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2">
                                        <label className="pr-10 font-semibold">입금자명</label>
                                        <input
                                            className="mt-2 w-[180px] h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={receipterInput.value}
                                            onChange={receipterInput.onChange}
                                        />
                                    </div>
                                </li>
                                <div className="w-1/2 mr-10 pt-3">
                                    <label className="pr-10 font-semibold">배송지</label>
                                    <input
                                        className="mt-2 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                        value={addrInput.value}
                                        onChange={addrInput.onChange}
                                    />
                                </div>
                            </ul>
                        </div>
                    </div>

                    {/* PC 접수사항 섹션 */}
                    <div className="h-[58px] mx-auto mt-4 md:mt-8 flex justify-between rounded-tl-md rounded-tr-md border-[#E1E1E1] border-[1px] w-full md:h-[58px] md:mx-0 md:rounded-tl-md md:rounded-tr-md md:border-[#E1E1E1] md:border-0 md:border-x md:border-t">
                        <p className="pl-4 md:pl-4 font-semibold text-[16px] text-[#A50A2E] my-auto">
                            접수사항
                        </p>
                    </div>

                    {/* PC 접수사항 */}
                    <div className="md:w-full pb-8 md:rounded-bl-md md:rounded-br-md md:border-[#E1E1E1] md:border-[1px] hidden md:block">
                        <div className="mx-auto">
                            <ul className="space-y-4 md:pl-8 md:mt-[30px] md:w-full md:text-sm">
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2 flex items-baseline">
                                        <label className="pr-10 font-semibold">접수구분</label>
                                        <select
                                            value={kind}
                                            onChange={(e) => setKind(e.target.value)}
                                            className="w-[180px] h-12 pl-4 md:pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[180px] md:h-12"
                                        >
                                            <option value="" disabled>
                                                선택
                                            </option>
                                            {ETCSALEKIND.map((item, idx) => (
                                                <option key={idx} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-1/2 mr-10 flex items-baseline">
                                        <label className="font-semibold pr-10">세부구분</label>
                                        <select
                                            value={skind}
                                            onChange={(e) => setSkind(e.target.value)}
                                            className="w-[180px] h-12 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none"
                                        >
                                            <option value="" disabled>
                                                선택
                                            </option>
                                            {ETCSALESKIND.map((item, idx) => (
                                                <option key={idx} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2">
                                        <label className="pr-10 font-semibold">접수수량</label>
                                        <input
                                            placeholder="수량"
                                            className="w-[130px] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                            value={qtyInput.value}
                                            onChange={handleQtyChange}
                                        />
                                    </div>
                                    <div className="w-1/2 mr-10">
                                        <label className="pr-10 font-semibold">접수금액</label>
                                        <input
                                            placeholder="금액"
                                            className="w-[180px] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                            value={reqsumInput.value}
                                            onChange={handleReqsumChange}
                                        />
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-full flex">
                                        <label className="font-semibold pr-10">메모</label>
                                        <div className="pl-[26px]">
                                            <textarea
                                                className="w-[900px] h-24 bg-white border border-[#E1E1E1] rounded-md p-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                                value={descrInput.value}
                                                onChange={descrInput.onChange}
                                            />
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 모바일 접수사항 */}
                    <div className="w-full mx-auto pb-8 rounded-bl-md rounded-br-md border-[#E1E1E1] border-[1px] block md:hidden">
                        <div className="mx-auto">
                            <ul className="space-y-1 px-4 pt-4 w-full text-sm">
                                <li className="w-full pt-3 items-baseline">
                                    <div className="w-1/2 flex items-baseline">
                                        <label className="pr-10 font-semibold">접수구분</label>
                                    </div>
                                    <select
                                        value={kind}
                                        onChange={(e) => setKind(e.target.value)}
                                        className="mt-2 h-10 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[40%]"
                                    >
                                        <option value="" disabled>
                                            선택
                                        </option>
                                        {ETCSALEKIND.map((item, idx) => (
                                            <option key={idx} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </li>
                                <li className="w-full pt-3 items-baseline">
                                    <div className="w-1/2 flex items-baseline">
                                        <label className="font-semibold pr-10">세부구분</label>
                                    </div>
                                    <select
                                        value={skind}
                                        onChange={(e) => setSkind(e.target.value)}
                                        className="mt-2 h-10 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[90%]"
                                    >
                                        <option value="" disabled>
                                            선택
                                        </option>
                                        {ETCSALESKIND.map((item, idx) => (
                                            <option key={idx} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </li>
                                <li className="w-full pt-3 flex flex-col">
                                    <div className="w-1/2">
                                        <label className="pr-10 font-semibold">접수수량</label>
                                    </div>
                                    <input
                                        placeholder="수량"
                                        className="mt-2 h-10 w-[30%] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                        value={qtyInput.value}
                                        onChange={handleQtyChange}
                                    />
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2 mr-10">
                                        <label className="pr-10 font-semibold">접수금액</label>
                                        <input
                                            placeholder="금액"
                                            className="mt-2 h-10 w-[100%] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                            value={reqsumInput.value}
                                            onChange={handleReqsumChange}
                                        />
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-full flex">
                                        <label className="font-semibold pr-10">메모</label>
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <textarea
                                        className="w-full h-24 bg-white border border-[#E1E1E1] rounded-md p-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                        value={descrInput.value}
                                        onChange={descrInput.onChange}
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="flex justify-center items-center pt-3 mx-auto">
                        <div>
                            <button
                                onClick={handleCancel}
                                className="w-[160px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer"
                            >
                                취소
                            </button>
                        </div>
                        <div className="pl-2">
                            <button
                                onClick={handleSave}
                                disabled={createMutation.isPending}
                                className="w-[160px] bg-[#77829B] text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 cursor-pointer"
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
