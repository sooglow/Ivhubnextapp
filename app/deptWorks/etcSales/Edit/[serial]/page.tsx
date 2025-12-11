"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInput } from "@/public/hooks/useInput";
import { parseJWT } from "@/public/utils/utils";
import { useEtcSalesView, useEtcSalesUpdate, useEtcSalesDelete } from "../../hooks/useEtcSalesView";
import { UserInfo } from "../../types/Create";

interface Props {
    params: Promise<{ serial: string }>;
}

export default function EtcSalesEdit({ params }: Props) {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [serial, setSerial] = useState<string>("");

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
    const [kind, setKind] = useState("");
    const [skind, setSkind] = useState("");
    const [state, setState] = useState("0");

    useEffect(() => {
        params.then((p) => setSerial(p.serial));
    }, [params]);

    const { data: viewData } = useEtcSalesView(serial);
    const updateMutation = useEtcSalesUpdate(serial);
    const deleteMutation = useEtcSalesDelete(serial);

    useEffect(() => {
        if (viewData?.data) {
            const data = viewData.data;
            comNameInput.setValue(data.comName);
            telInput.setValue(data.tel);
            hpInput.setValue(data.hp);
            areaInput.setValue(data.area);
            receipterInput.setValue(data.receipter);
            addrInput.setValue(data.addr);
            qtyInput.setValue(data.qty.toString());
            reqsumInput.setValue(data.reqSum.toString());
            inTotalInput.setValue(data.inTotal.toString());
            descrInput.setValue(data.descr);
            sendDayInput.setValue(data.sendDay);
            setComCode(data.comCode);
            setKind(data.kind);
            setSkind(data.skind);
            setState(data.state);
        }
    }, [viewData]);

    const handleSave = () => {
        if (!window.confirm("저장하시겠습니까?")) return;

        updateMutation.mutate(
            {
                etcSalesSerial: serial,
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
                state: state,
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

    const handleDelete = () => {
        if (!window.confirm("삭제하시겠습니까?")) return;

        deleteMutation.mutate(undefined, {
            onSuccess: (response) => {
                if (response.result) {
                    alert("삭제되었습니다.");
                    router.push("/deptWorks/etcSales/List");
                } else {
                    alert(response.errMsg || "삭제에 실패했습니다.");
                }
            },
            onError: (error) => {
                alert("삭제 중 오류가 발생했습니다: " + error.message);
            },
        });
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

                    {/* 업체정보 섹션 */}
                    <div className="h-[58px] mx-auto mt-4 md:mt-8 flex justify-between rounded-tl-md rounded-tr-md border-[#E1E1E1] border-[1px] w-full">
                        <p className="pl-4 font-semibold text-[16px] text-[#A50A2E] my-auto">
                            업체정보
                        </p>
                    </div>
                    <div className="w-full pb-8 rounded-bl-md rounded-br-md border-[#E1E1E1] border-[1px]">
                        <div className="mx-auto">
                            <ul className="space-y-4 px-4 md:px-8 pt-4 md:pt-8 w-full text-sm">
                                <li className="flex flex-col md:flex-row md:items-center">
                                    <label className="font-semibold md:w-[120px]">거래처명</label>
                                    <input
                                        className="mt-2 md:mt-0 w-full md:w-[300px] h-10 bg-white border border-[#E1E1E1] rounded-md px-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                                        value={comNameInput.value}
                                        onChange={comNameInput.onChange}
                                    />
                                </li>
                                <li className="flex flex-col md:flex-row md:items-center">
                                    <label className="font-semibold md:w-[120px]">지역</label>
                                    <input
                                        className="mt-2 md:mt-0 w-full md:w-[300px] h-10 bg-white border border-[#E1E1E1] rounded-md px-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                                        value={areaInput.value}
                                        onChange={areaInput.onChange}
                                    />
                                </li>
                                <li className="flex flex-col md:flex-row md:items-center">
                                    <label className="font-semibold md:w-[120px]">연락처</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="mt-2 md:mt-0 flex-1 md:w-[145px] h-10 bg-white border border-[#E1E1E1] rounded-md px-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                                            value={telInput.value}
                                            onChange={telInput.onChange}
                                        />
                                        <input
                                            className="mt-2 md:mt-0 flex-1 md:w-[145px] h-10 bg-white border border-[#E1E1E1] rounded-md px-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                                            value={hpInput.value}
                                            onChange={hpInput.onChange}
                                        />
                                    </div>
                                </li>
                                <li className="flex flex-col md:flex-row md:items-center">
                                    <label className="font-semibold md:w-[120px]">입금자명</label>
                                    <input
                                        className="mt-2 md:mt-0 w-full md:w-[300px] h-10 bg-white border border-[#E1E1E1] rounded-md px-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                                        value={receipterInput.value}
                                        onChange={receipterInput.onChange}
                                    />
                                </li>
                                <li className="flex flex-col md:flex-row md:items-center">
                                    <label className="font-semibold md:w-[120px]">배송지</label>
                                    <input
                                        className="mt-2 md:mt-0 w-full md:w-[500px] h-10 bg-white border border-[#E1E1E1] rounded-md px-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                                        value={addrInput.value}
                                        onChange={addrInput.onChange}
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 접수사항 섹션 */}
                    <div className="h-[58px] mx-auto mt-4 md:mt-8 flex justify-between rounded-tl-md rounded-tr-md border-[#E1E1E1] border-[1px] w-full">
                        <p className="pl-4 font-semibold text-[16px] text-[#A50A2E] my-auto">
                            접수사항
                        </p>
                    </div>
                    <div className="w-full pb-8 rounded-bl-md rounded-br-md border-[#E1E1E1] border-[1px]">
                        <div className="mx-auto">
                            <ul className="space-y-4 px-4 md:px-8 pt-4 md:pt-8 w-full text-sm">
                                <li className="flex flex-col md:flex-row md:items-center">
                                    <label className="font-semibold md:w-[120px]">접수수량</label>
                                    <input
                                        type="number"
                                        className="mt-2 md:mt-0 w-full md:w-[200px] h-10 bg-white border border-[#E1E1E1] rounded-md px-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                                        value={qtyInput.value}
                                        onChange={qtyInput.onChange}
                                    />
                                </li>
                                <li className="flex flex-col md:flex-row md:items-center">
                                    <label className="font-semibold md:w-[120px]">접수금액</label>
                                    <input
                                        type="number"
                                        className="mt-2 md:mt-0 w-full md:w-[200px] h-10 bg-white border border-[#E1E1E1] rounded-md px-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                                        value={reqsumInput.value}
                                        onChange={reqsumInput.onChange}
                                    />
                                </li>
                                <li className="flex flex-col">
                                    <label className="font-semibold">비고</label>
                                    <textarea
                                        className="mt-2 w-full h-[200px] bg-white border border-[#E1E1E1] rounded-md px-4 py-2 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                                        value={descrInput.value}
                                        onChange={descrInput.onChange}
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="flex justify-center items-center pt-8 gap-2">
                        <button
                            onClick={handleCancel}
                            className="w-[150px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer"
                        >
                            목록
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="w-[150px] bg-[#77829B] text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 cursor-pointer"
                        >
                            {deleteMutation.isPending ? "삭제중..." : "삭제"}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={updateMutation.isPending}
                            className="w-[150px] bg-[#77829B] text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 cursor-pointer"
                        >
                            {updateMutation.isPending ? "저장중..." : "저장"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
