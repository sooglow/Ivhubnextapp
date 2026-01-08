"use client";

import { DataTable } from "@/components/comm/dataTable/DataTable";
import { getVinCodeListColumns } from "@/components/comm/dataTable/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useLoading } from "@/public/contexts/LoadingContext";
import { useUserData } from "@/public/hooks/useUserData";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchVinData } from "../apis/CodeApis";
import { removeVinData } from "../apis/CreateApis";
import { fetchEpcExpList, fetchSampleVin17List, fetchVinList } from "../apis/ViewApis";
import Pagenation from "../compenents/Pagenation";
import ViewEpcInfo from "../compenents/ViewEpcInfo";
import ViewExpInfo from "../compenents/ViewExpInfo";
import ViewSearchBar from "../compenents/ViewSearchBar";

export default function View() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [carFilter, setCarFilter] = useState([]);
    const [vinList, setVinList] = useState([]);
    const [optList, setOptList] = useState([]);
    const [expList, setExpList] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [selectedCarcode, setSelectedCarcode] = useState({ iv_carcode: "", code_text: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const maxListCount = 10;
    const { dispatch } = useLoading();
    const userInfo = useUserData();
    const { toast } = useToast();

    // fetch차종필터
    const {
        data: carFilterData,
        error: carFilterError,
        isLoading: carFilterIsLoading,
    } = useQuery({
        queryKey: ["carFilterData"],
        queryFn: () => fetchVinData((userInfo as any)?.userId),
        enabled: !!(userInfo as any)?.userId,
    });

    useEffect(() => {
        if (!carFilterIsLoading && carFilterData) {
            setCarFilter(carFilterData?.jsonData);
            vinListRefetch();
        }

        if (carFilterError) {
            alert("데이터를 불러오는 중 오류가 발생했습니다: " + carFilterError.message);
        }
    }, [carFilterData, carFilterError, carFilterIsLoading]);

    // fetch 차대번호 분석 결과
    const {
        data: vinListData,
        error: vinListError,
        isLoading: vinListIsLoading,
        refetch: vinListRefetch,
    } = useQuery({
        queryKey: ["vinList", currentPage, selectedCarcode, keyword],
        queryFn: () =>
            fetchVinList((userInfo as any)?.userId, {
                iv_carcode: selectedCarcode.iv_carcode,
                keyword: keyword.length === 11 ? keyword : "",
                currentPage,
                maxListCount,
            }),
        enabled: false,
    });

    useEffect(() => {
        if (!vinListIsLoading && vinListData) {
            setVinList(vinListData.jsonData);
            setTotalCount(vinListData.totalCnt);
            setOptList([]);
            setExpList([]);
            setSelectedVin("");
            setSelectedIvCode("");
        }

        if (vinListError) {
            alert("데이터를 불러오는 중 오류가 발생했습니다: " + vinListError.message);
        }
    }, [vinListIsLoading, vinListData, vinListError]);

    useEffect(() => {
        vinListRefetch();
        setCurrentPage(1);
    }, [selectedCarcode]);

    useEffect(() => {
        if (currentPage !== 1) {
            vinListRefetch();
        }
    }, [currentPage]);

    useEffect(() => {
        dispatch({ type: "SET_LOADING", payload: false });
    }, [dispatch]);

    const searchClick = () => {
        if (keyword.length !== 11) {
            alert("차대번호 11자리로 검색 가능합니다.");
            return;
        }

        vinListRefetch();
        setCurrentPage(1);
    };

    const [selectedVin, setSelectedVin] = useState("");
    const [selectedIvCode, setSelectedIvCode] = useState("");
    const [selectedSeqno, setSelectedSeqno] = useState("01");
    const [selectedEpcCode, setSelectedEpcCode] = useState("");
    const [sampleVinNumber, setSampleVinNumber] = useState<any>([]);

    // fetch EPC 및 소모품 결과 (차대번호 분석결과 Row선택시)
    const {
        data: epcListData,
        error: epcListError,
        isLoading: epcListIsLoading,
        refetch: epcListRefetch,
    } = useQuery({
        queryKey: ["epcList", selectedVin, selectedIvCode],
        queryFn: () =>
            fetchEpcExpList((userInfo as any)?.userId, {
                vin: selectedVin,
                iv_carcode: selectedIvCode,
            }),
        enabled: !!(userInfo as any)?.userId && !!selectedVin,
    });

    useEffect(() => {
        if (!epcListIsLoading && epcListData) {
            setOptList(epcListData.jsonEpc);
            setExpList(epcListData.jsonExp);
            setSelectedEpcCode(epcListData.jsonEpc[0]?.epc_code);
        }

        if (epcListError) {
            alert("데이터를 불러오는 중 오류가 발생했습니다: " + epcListError.message);
        }
    }, [epcListIsLoading, epcListData, epcListError]);

    // Sample 차대번호
    const {
        data: sampleVin17List,
        error: sampleVin17Error,
        isLoading: sampleVin17IsLoading,
    } = useQuery({
        queryKey: ["sampleVin17List", selectedVin],
        queryFn: () =>
            fetchSampleVin17List((userInfo as any)?.userId, {
                vin11: selectedVin,
            }),
        enabled: !!(userInfo as any)?.userId && !!selectedVin && !!selectedIvCode,
    });

    useEffect(() => {
        if (!sampleVin17IsLoading && sampleVin17List) {
            if (!sampleVin17List.jsonData) {
                return;
            }

            setSampleVinNumber(sampleVin17List.jsonData);
        }

        if (sampleVin17Error) {
            alert("데이터를 불러오는 중 오류가 발생했습니다: " + sampleVin17Error.message);
        }
    }, [sampleVin17IsLoading, sampleVin17List, sampleVin17Error]);

    const onRowSelect = (item: any) => {
        setSelectedVin(item.vin);
        setSelectedIvCode(item.iv_carcode);
    };

    const onChangeEpcCode = (value: string) => {
        const arrSplitValue = value.split("_");
        setSelectedEpcCode(arrSplitValue[0]);
        setSelectedSeqno(arrSplitValue[1]);
    };

    const mutationRemoveVinData = useMutation({
        mutationFn: (data: any) => removeVinData((userInfo as any)?.userId, data),
        onSuccess: (res: any) => {
            epcListRefetch();
        },
        onError: (error: any) => {
            toast({
                description: `작업 실패-${error.message}`,
            });
        },
    });

    const deleteEpcCode = () => {
        if (
            window.confirm(
                `EPC옵션을 삭제하시겠습니까?\n\n[차대번호11 : ${selectedVin}]\n[차량코드 : ${selectedIvCode}]\n[EPC코드 : ${selectedEpcCode}]\n[일련번호 : ${selectedSeqno}]`
            )
        ) {
            const reqData = {
                seqno: selectedSeqno,
                mode: "epc",
                vin: selectedVin,
                epcCd: selectedEpcCode,
                iv_carcode: selectedIvCode,
            };

            mutationRemoveVinData.mutate(reqData);
        }
    };

    const deleteExpCode = () => {
        if (
            window.confirm(
                `소모품정보를 삭제하시겠습니까?\n\n[차대번호11 : ${selectedVin}]\n[차량코드 : ${selectedIvCode}]\n[EPC코드 : ${selectedEpcCode}]\n[일련번호 : ${selectedSeqno}]`
            )
        ) {
            const reqData = {
                seqno: selectedSeqno,
                mode: "epc",
                vin: selectedVin,
                epcCd: selectedEpcCode,
                iv_carcode: selectedIvCode,
            };

            mutationRemoveVinData.mutate(reqData);
        }
    };

    return (
        <div className="w-full min-h-[1200px] h-full rounded-lg border">
            <div className="flex justify-center p-6 overflow-auto">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-center justify-between">
                                <p className="font-extrabold">차대번호 분석</p>
                                <div className="flex flex-row space-x-2 w-[550px]">
                                    <Input
                                        type="text"
                                        id="vin17_0"
                                        placeholder="차대번호 샘플 1"
                                        readOnly={true}
                                        value={
                                            sampleVinNumber?.length > 0
                                                ? sampleVinNumber[0]?.vinno
                                                : ""
                                        }
                                    />
                                    <Input
                                        type="text"
                                        id="vin17_1"
                                        placeholder="차대번호 샘플 2"
                                        readOnly={true}
                                        value={
                                            sampleVinNumber?.length > 1
                                                ? sampleVinNumber[1]?.vinno
                                                : ""
                                        }
                                    />
                                    <Input
                                        type="text"
                                        id="vin17_2"
                                        placeholder="차대번호 샘플 3"
                                        readOnly={true}
                                        value={
                                            sampleVinNumber?.length > 2
                                                ? sampleVinNumber[2]?.vinno
                                                : ""
                                        }
                                    />
                                </div>
                                <ViewSearchBar
                                    searchOpen={searchOpen}
                                    setSearchOpen={setSearchOpen}
                                    selectedCarcode={selectedCarcode}
                                    setSelectedCarcode={setSelectedCarcode}
                                    carFilter={carFilter}
                                    keyword={keyword}
                                    setKeyword={setKeyword}
                                    searchClick={searchClick}
                                />
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col h-full">
                            <DataTable
                                columns={getVinCodeListColumns}
                                onRowSelect={onRowSelect}
                                data={vinList}
                            />

                            <Pagenation
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalCount={totalCount}
                                maxListCount={maxListCount}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-center px-6 pb-6 h-full">
                <Card className="w-full h-full">
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-center justify-between">
                                <p className="font-extrabold">EPC 옵션 및 소모품 정보</p>
                                <div className="flex gap-1">
                                    <div className="flex w-[250px]">
                                        <Select
                                            value={`${selectedEpcCode}_${selectedSeqno}`}
                                            onValueChange={(value) => onChangeEpcCode(value)}
                                        >
                                            <SelectTrigger id="selectSeqNo">
                                                <SelectValue placeholder="EPC 세부코드" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {optList?.map((item: any, idx: number) => (
                                                    <SelectItem
                                                        key={idx}
                                                        value={`${item.epc_code}_${item.seqno}`}
                                                    >{`${item.epc_code}_${item.seqno}`}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-5">
                            <ViewEpcInfo
                                optList={optList}
                                selectedSeqno={selectedSeqno || "01"}
                                selectedEpcCode={selectedEpcCode}
                                deleteEpcCode={deleteEpcCode}
                                selectedVin={selectedVin}
                                selectedIvCode={selectedIvCode}
                            />

                            <ViewExpInfo
                                expList={expList}
                                selectedSeqno={selectedSeqno || "01"}
                                selectedEpcCode={selectedEpcCode}
                                deleteExpCode={deleteExpCode}
                                selectedVin={selectedVin}
                                selectedIvCode={selectedIvCode}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
