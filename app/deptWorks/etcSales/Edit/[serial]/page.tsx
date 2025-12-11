"use client";

import { ETCSALEKIND, ETCSALESKIND, ETCSALESSTATUS } from "@/public/constants/etcSales";
import { useInput } from "@/public/hooks/useInput";
import { parseJWT } from "@/public/utils/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useEtcSalesDelete, useEtcSalesUpdate, useEtcSalesView } from "../../hooks/useEtcSalesView";
import { UserInfo } from "../../types/Create";

interface Props {
    params: Promise<{ serial: string }>;
}

export default function EtcSalesEdit({ params }: Props) {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [serial, setSerial] = useState<string>("");
    const [post, setPost] = useState<any>({});

    const comNameInput = useInput("", (value: string) => value.length <= 50);
    const telInput = useInput("", (value: string) => value.length <= 50);
    const hpInput = useInput("", (value: string) => value.length <= 50);
    const areaInput = useInput("", (value: string) => value.length <= 50);
    const receipterInput = useInput("", (value: string) => value.length <= 50);
    const addrInput = useInput("", (value: string) => value.length <= 50);
    const qtyInput = useInput("0", (value: string) => value.length <= 50);
    const reqsumInput = useInput("0", (value: string) => value.length <= 50);
    const misuInput = useInput("0", (value: string) => value.length <= 50);
    const inTotalInput = useInput("0", (value: string) => value.length <= 50);
    const descrInput = useInput("", (value: string) => value.length <= 5000);
    const sendDayInput = useInput("", (value: string) => value.length <= 50);
    const recManInput = useInput("", (value: string) => value.length <= 50);

    const [comCode, setComCode] = useState("");
    const [kind, setKind] = useState("");
    const [skind, setSkind] = useState("");
    const [state, setState] = useState("");

    const { data: viewData } = useEtcSalesView(serial);
    const updateMutation = useEtcSalesUpdate(serial);
    const deleteMutation = useEtcSalesDelete(serial);

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
        if (value.trim() !== "") {
            misuInput.setValue((Number(value) - Number(inTotalInput.value)).toString());
        } else {
            misuInput.setValue(reqsumInput.value);
        }
    };

    const handleInTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.trim() !== "" && isNaN(Number(value))) {
            alert("입금액은 숫자만 입력해주세요.");
            return;
        }
        inTotalInput.onChange(e);
        if (value.trim() !== "") {
            misuInput.setValue((Number(reqsumInput.value) - Number(value)).toString());
        } else {
            misuInput.setValue(reqsumInput.value);
        }
    };

    const handleSave = () => {
        if (!window.confirm("저장하시겠습니까?")) return;

        updateMutation.mutate(
            {
                etcSalesSerial: serial,
                comName: comNameInput.value,
                comCode: comCode,
                recMan: post.recMan,
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
                misu: parseInt(misuInput.value) || 0,
                descr: descrInput.value,
                state: state,
                sendDay: sendDayInput.value || "",
            },
            {
                onSuccess: (response) => {
                    if (response.result) {
                        alert("수정되었습니다.");
                        window.location.reload();
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
        if (!window.confirm("삭제후에는 복원이 불가능합니다.\n삭제 하시겠습니까?")) return;

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

    // useEffect - params 처리
    useEffect(() => {
        params.then((p) => setSerial(p.serial));
    }, [params]);

    // useEffect - viewData 처리
    useEffect(() => {
        if (viewData?.data) {
            const data = viewData.data;
            setPost(data);
            comNameInput.setValue(data.comName);
            addrInput.setValue(data.addr);
            areaInput.setValue(data.area);
            telInput.setValue(data.tel);
            hpInput.setValue(data.hp);
            receipterInput.setValue(data.receipter);
            qtyInput.setValue(data.qty.toString());
            reqsumInput.setValue(data.reqSum.toString());
            inTotalInput.setValue(data.inTotal.toString());
            misuInput.setValue(data.misu.toString());
            descrInput.setValue(data.descr);

            if (data.sendDay) {
                const dateStr = data.sendDay.includes("T")
                    ? data.sendDay.split("T")[0]
                    : data.sendDay.split(" ")[0];
                sendDayInput.setValue(dateStr);
            } else {
                sendDayInput.setValue("");
            }

            setComCode(data.comCode);
            setKind(data.kind);
            setSkind(data.skind);
            setState(data.state);
        }
    }, [viewData]);

    // useEffect - userInfo 처리
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
            <main className="w-full flex-grow p-4 md:pt-8">
                <div className="max-w-6xl mx-auto md:px-4 pb-20">
                    <h2 className="md:pl-4 font-semibold text-2xl">통장,양식지 접수</h2>

                    {/* 업체정보 헤더 */}
                    <div className="h-[58px] mx-auto mt-4 md:mt-8 flex justify-between rounded-tl-md rounded-tr-md border-[#E1E1E1] w-full md:h-[58px] md:mx-0 md:rounded-tl-md md:rounded-tr-md md:border-[#E1E1E1] border-x border-t">
                        <p className="pl-4 md:pl-4 font-semibold text-[16px] text-[#A50A2E] my-auto">
                            업체정보
                        </p>
                    </div>

                    {/* PC 업체정보 */}
                    <div className="md:w-full pb-8 md:rounded-bl-md md:rounded-br-md md:border-[#E1E1E1] md:border-[1px] hidden md:block">
                        <div className="md:mx-auto">
                            <ul className="space-y-4 md:pl-8 md:mt-[30px] md:w-full md:text-sm">
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="">
                                        <label className="font-semibold pr-10">거래처명</label>
                                        <input
                                            className="bg-white border border-[#E1E1E1] rounded-md py-[10px] mr-3 pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={comNameInput.value}
                                            onChange={comNameInput.onChange}
                                        />
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2">
                                        <label className="font-semibold pr-[66px]">지역</label>
                                        <input
                                            className="bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={areaInput.value}
                                            onChange={areaInput.onChange}
                                            readOnly
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
                                <li className="w-full pt-2 flex justify-between items-baseline">
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
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2">
                                        <label className="pr-10 font-semibold">접수자명</label>
                                        {post.recMan ?? ""}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 모바일 업체정보 */}
                    <div className="w-full mx-auto pb-8 rounded-bl-md rounded-br-md border-[#E1E1E1] border-[1px] block md:hidden">
                        <div className="">
                            <ul className="space-y-4 px-4 pt-4 w-full text-sm">
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="flex flex-col">
                                        <label className="font-semibold pr-10">거래처명</label>
                                        <input
                                            className="mt-2 bg-white border border-[#E1E1E1] rounded-md py-[10px] mr-3 pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={comNameInput.value}
                                            onChange={comNameInput.onChange}
                                        />
                                    </div>
                                </li>
                                <li className="w-full pt-2 flex justify-between items-baseline">
                                    <div className="w-1/2">
                                        <label className="font-semibold pr-[66px]">지역</label>
                                        <input
                                            className="mt-2 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={areaInput.value}
                                            onChange={areaInput.onChange}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <div className="pt-2 w-1/2 mr-10 flex items-baseline">
                                        <label className="font-semibold pr-10">연락처</label>
                                    </div>
                                    <input
                                        className="mt-2 w-[45%] appearance-none h-10 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                        value={telInput.value}
                                        onChange={telInput.onChange}
                                    />
                                    <input
                                        className="w-[45%] appearance-none ml-2 h-10 mt-2 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                        value={hpInput.value}
                                        onChange={hpInput.onChange}
                                    />
                                </li>
                                <li className="w-full pt-2 flex justify-between items-baseline">
                                    <div className="w-1/2">
                                        <label className="pr-10 font-semibold">입금자명</label>
                                        <input
                                            className="mt-2 w-[140px] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={receipterInput.value}
                                            onChange={receipterInput.onChange}
                                        />
                                    </div>
                                </li>
                                <div className="w-1/2 mr-10">
                                    <label className="pr-10 font-semibold">배송지</label>
                                    <input
                                        className="mt-2 w-[300px] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                        value={addrInput.value}
                                        onChange={addrInput.onChange}
                                    />
                                </div>
                                <li className="w-full pt-2 flex flex-col items-baseline">
                                    <div className="w-1/2">
                                        <label className="pr-10 font-semibold">접수자명</label>
                                    </div>
                                    <p className="pt-2">{post.recMan ?? ""}</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 접수사항 헤더 */}
                    <div className="w-full h-[58px] mt-4 md:mt-8 flex justify-between rounded-tl-md rounded-tr-md border-[#E1E1E1] md:w-full md:h-[58px] md:rounded-tl-md md:rounded-tr-md md:border-[#E1E1E1] border-x border-t">
                        <p className="pl-4 md:pl-4 font-semibold text-[16px] text-[#A50A2E] my-auto">
                            접수사항
                        </p>
                    </div>

                    {/* PC 접수사항 */}
                    <div className="w-full pb-8 md:rounded-bl-md md:rounded-br-md md:border-[#E1E1E1] md:border-[1px] hidden md:block">
                        <div className="mx-auto">
                            <ul className="space-y-4 md:pl-8 md:mt-[30px] md:w-full md:text-sm">
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2 flex items-baseline">
                                        <label className="pr-10 font-semibold">접수구분</label>
                                        <select
                                            value={kind}
                                            onChange={(e) => setKind(e.target.value)}
                                            className="hidden md:block h-12 pl-4 md:pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[180px] md:h-12"
                                        >
                                            <option value={""} disabled>
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
                                            className="hidden md:block h-12 pl-4 md:pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[280px] md:h-12"
                                        >
                                            <option value={""} disabled>
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
                                            className="w-[130px] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                            value={qtyInput.value}
                                            onChange={handleQtyChange}
                                        />
                                    </div>
                                    <div className="w-1/2 mr-10">
                                        <label className="pr-10 font-semibold">접수금액</label>
                                        <input
                                            className="w-[180px] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                            value={reqsumInput.value}
                                            onChange={handleReqsumChange}
                                        />
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2">
                                        <label className="pr-[53px] font-semibold">입금액</label>
                                        <input
                                            className="w-[180px] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                            value={inTotalInput.value}
                                            onChange={handleInTotalChange}
                                        />
                                    </div>
                                    <div className="w-1/2 mr-10">
                                        <label className="pr-[53px] font-semibold">미수액</label>
                                        <input
                                            className="w-[180px] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                            value={misuInput.value}
                                            onChange={misuInput.onChange}
                                            readOnly
                                        />
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2 flex items-baseline">
                                        <label className="pr-[53px] font-semibold">발송일</label>
                                        <input
                                            type="date"
                                            className="w-[180px] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={sendDayInput.value}
                                            onChange={sendDayInput.onChange}
                                        />
                                    </div>
                                    <div className="w-1/2 mr-10 flex items-baseline">
                                        <label className="font-semibold pr-10">상태</label>
                                        <select
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            className="hidden md:block h-12 pl-4 md:ml-6 md:pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[200px] md:h-12"
                                        >
                                            <option value={""} disabled>
                                                선택
                                            </option>
                                            {ETCSALESSTATUS.map((item) => (
                                                <option
                                                    key={item.statusCode}
                                                    value={item.statusCode}
                                                >
                                                    {item.statusName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-full flex">
                                        <label className="font-semibold pr-10">메모</label>
                                        <div className="pl-[26px]">
                                            <textarea
                                                className="w-[900px] h-24 bg-white border border-[#E1E1E1] rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
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
                    <div className="w-full mx-auto pb-8 rounded-bl-md md:rounded-br-md border-[#E1E1E1] border-[1px] block md:hidden">
                        <div className="mx-auto">
                            <ul className="space-y-4 px-4 pt-4 w-full text-sm">
                                <li className="w-full pt-2 items-baseline">
                                    <div className="w-1/2 flex items-baseline">
                                        <label className="pr-10 font-semibold">접수구분</label>
                                    </div>
                                    <select
                                        value={kind}
                                        onChange={(e) => setKind(e.target.value)}
                                        className="w-[180px] h-10 mt-2 pl-4 md:pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[180px] md:h-12"
                                    >
                                        <option value={""} disabled>
                                            선택
                                        </option>
                                        {ETCSALEKIND.map((item, idx) => (
                                            <option key={idx} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2 items-baseline">
                                        <label className="font-semibold pr-10">세부구분</label>
                                        <select
                                            value={skind}
                                            onChange={(e) => setSkind(e.target.value)}
                                            className="w-[180px] h-10 mt-2 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none"
                                        >
                                            <option value={""} disabled>
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
                                <li className="w-full pt-3 flex flex-col items-baseline">
                                    <div className="w-1/2">
                                        <label className="pr-10 font-semibold">접수수량</label>
                                    </div>
                                    <input
                                        className="w-[60px] mt-2 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                        value={qtyInput.value}
                                        onChange={handleQtyChange}
                                    />
                                </li>
                                <li>
                                    <div className="w-1/2 mr-10 pt-3">
                                        <label className="pr-10 font-semibold">접수금액</label>
                                        <input
                                            className="w-[160px] mt-2 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                            value={reqsumInput.value}
                                            onChange={handleReqsumChange}
                                        />
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2">
                                        <label className="font-semibold">입금액</label>
                                        <input
                                            className="w-[160px] mt-2 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                            value={inTotalInput.value}
                                            onChange={handleInTotalChange}
                                        />
                                    </div>
                                </li>
                                <li className="pt-3">
                                    <div className="w-1/2">
                                        <label className="font-semibold">미수액</label>
                                        <input
                                            className="w-[160px] mt-2 bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm text-right"
                                            value={misuInput.value}
                                            onChange={misuInput.onChange}
                                            readOnly
                                        />
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2 items-baseline">
                                        <label className="font-semibold pr-10">상태</label>
                                        <select
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            className="w-[180px] mt-2 h-10 pl-4 md:ml-6 md:pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md: md:h-12"
                                        >
                                            <option value={""} disabled>
                                                선택
                                            </option>
                                            {ETCSALESSTATUS.map((item) => (
                                                <option
                                                    key={item.statusCode}
                                                    value={item.statusCode}
                                                >
                                                    {item.statusName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex justify-between items-baseline">
                                    <div className="w-1/2">
                                        <label className="pr-[53px] font-semibold">발송일</label>
                                        <input
                                            type="date"
                                            className="mt-2 w-[180px] bg-white border border-[#E1E1E1] rounded-md py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={sendDayInput.value}
                                            onChange={sendDayInput.onChange}
                                        />
                                    </div>
                                </li>
                                <li className="w-full pt-3 flex items-baseline">
                                    <div className="w-full">
                                        <label className="font-semibold pr-10">메모</label>
                                        <textarea
                                            className="w-full h-24 mt-2 bg-white border border-[#E1E1E1] rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm"
                                            value={descrInput.value}
                                            onChange={descrInput.onChange}
                                        />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="flex justify-center items-center pt-3 mx-auto">
                        <div>
                            <button
                                onClick={handleCancel}
                                className="w-[110px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                            >
                                취소
                            </button>
                        </div>
                        <div className="pl-2">
                            <button
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className={`w-[110px] px-4 py-2 text-white bg-[#77829B] border border-slate-400 border-transparent shadow-sm rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none ${
                                    userInfo.userId === post.recMan || userInfo.userPower === "0"
                                        ? ""
                                        : "hidden"
                                }`}
                            >
                                {deleteMutation.isPending ? "삭제중..." : "삭제"}
                            </button>
                        </div>
                        <div className="pl-2">
                            <button
                                onClick={handleSave}
                                disabled={updateMutation.isPending}
                                className="w-[110px] bg-[#77829B] hover:bg-slate-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none"
                            >
                                {updateMutation.isPending ? "저장중..." : "저장"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
