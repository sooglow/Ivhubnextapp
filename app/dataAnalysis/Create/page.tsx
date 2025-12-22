'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from "react";
import CreateNewVinList from "../compenents/CreateNewVinList";
import CreateAddEpcCodeForm from "../compenents/CreateAddEpcCodeForm";
import CreateEpcInfoTabs from "../compenents/CreateEpcInfoTabs";
import CreateExpInfo from "../compenents/CreateExpInfo";
import CreateVinInfo from "../compenents/CreateVinInfo";
import CreateVinInfoTabs from "../compenents/CreateVinInfoTabs";
import { useUserData } from "@/public/hooks/useUserData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchCarTypeData,
    fetchEpcExpData,
    updateNewVinAnaysis,
    fetchVin5to11Data,
    insertVinAnalysisData,
    deleteNewVin,
    addVinCode,
} from "../apis/CreateApis";
import { useLoading } from "@/public/contexts/LoadingContext";
import { useRouter } from "next/navigation";
import CreateTypeCode from "../compenents/CreateTypeCode";

export default function Create() {
    const initCarOtherGroupType = {
        json5: [],
        json6: [],
        json7: [],
        json8: [],
        json9: [],
        json10: [],
        json11: [],
    };
    const initInputValueType = { vin: "", epcCode: "" };
    const initDivideInputValue = {
        vin1to4: "",
        vin5: "",
        vin6: "",
        vin7: "",
        vin8: "",
        vin9: "",
        vin10: "",
        vin11: "",
    };
    const initVinValueTypeCode = {
        vin14_text: "",
        vin5_text: "",
        vin6_text: "",
        vin7_text: "",
        vin8_text: "",
        vin9_text: "",
        vin10_text: "",
        vin11_text: "",
        vin14: "",
        vin5: "",
        vin6: "",
        vin7: "",
        vin8: "",
        vin9: "",
        vin10: "",
        vin11: "",
        iv_carcode: "",
        epc_code: "",
    };
    const initEpcOptList = {
        jsonOpt1: [],
        jsonOpt2: [],
        jsonOpt3: [],
        jsonOpt4: [],
        jsonOpt5: [],
        jsonOpt6: [],
        jsonOpt7: [],
    };
    const initAddCode = {
        vin5: "",
        vin5_text: "",
        vin6: "",
        vin6_text: "",
        vin7: "",
        vin7_text: "",
        vin8: "",
        vin8_text: "",
        vin9: "",
        vin9_text: "",
        vin10: "",
        vin10_text: "",
        vin11: "",
        vin11_text: "",
    };
    const initExpList = [
        {
            seqno: "01",
            fuel_tank: "",
            engine_oil: "",
            mission_oil: "",
            break_oil: "",
            steering_oil: "",
            cooling_water: "",
            aircon_gas1: "",
            aircon_gas2: "",
            wiper: "",
            rear_diff: "",
            front_diff: "",
            trans_oil: "",
            diesel_water: "",
            battery: "",
            tire_size: "",
            refrigerant_oil: "",
            refrigerant_oil_kind: "",
            tire_pressure_psi: "",
            engine_oil_grade: "",
            engine_oil_viscosity: "",
            lube_grade: "",
            lubricant: "",
            motor_cooling_water: "",
            batt_cooling_water: "",
        },
    ];
    const initTabContent = { vinInfo: "vin14", epcInfo: "opt1" };
    const userInfo = useUserData();
    const queryClient = useQueryClient();
    const router = useRouter();

    const [carModelList, setCarModelList] = useState([]);
    const [carOtherGroup, setCarOtherGroup] = useState(initCarOtherGroupType);
    const [vinValueTypeCode, setVinValueTypeCode] = useState(initVinValueTypeCode);
    const [epcOptList, setEpcOptList] = useState(initEpcOptList);
    const [selectEpcOpt, setSelectEpcOpt] = useState([]);
    const [expList, setExpList] = useState<any>(initExpList);
    const [inputValue, setInputValue] = useState(initInputValueType);
    const [divideInputValue, setDivideInputValue] = useState(initDivideInputValue);
    const [selectedSeqNo, setSelectedSeqNo] = useState("01");
    const [selectedTabContents, setSelectedTabContents] = useState(initTabContent);
    const [addCode, setAddCode] = useState(initAddCode);
    const [addOptText, setAddOptText] = useState(null);
    const { dispatch } = useLoading();
    const [open, setOpen] = useState(false);
    const [reloadTrigger, setReloadTrigger] = useState(true);
    const { toast } = useToast();
    const [isEpcInputState, setIsEpcInputState] = useState(false);
    const [isExpInputState, setIsExpInputState] = useState(false);

    let allClear = false;

    // 차대번호 1~4 차종 리스트
    const {
        data: carTypeData,
        error: carTypeDataError,
        isLoading: carTypeDataIsLoading,
        refetch: carTypeDataRefetch,
    } = useQuery({
        queryKey: ["carType", inputValue?.vin, inputValue?.vin?.slice(0, 4), vinValueTypeCode?.vin14_text],
        queryFn: () =>
            fetchCarTypeData(userInfo.userId, {
                vin14: inputValue?.vin?.slice(0, 4),
                vin: inputValue?.vin,
            }),
        enabled: false,
        refetchOnWindowFocus: false,
        gcTime: 0,
        staleTime: 0,
    });

    useEffect(() => {
        if (!carTypeDataIsLoading && carTypeData) {
            setCarModelList(carTypeData.jarr14);
            setVinValueTypeCode(
                carTypeData.jarrResult.length > 0 ? carTypeData.jarrResult[0] : initVinValueTypeCode
            );
            console.log(carTypeData)
            setInputValue((prev) => ({
                ...prev,
                epcCode: carTypeData.jarrResult[0]?.epc_code || "",
            }));
            toast({
                description: "내용을 불러왔습니다.",
                duration: 1000,
                className: "fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 w-[350px]"
            });
        }

        if (carTypeDataError) {
            alert("데이터를 불러오는 중 오류가 발생했습니다: " + carTypeDataError.message);
        }
    }, [carTypeData, carTypeDataError, carTypeDataIsLoading, dispatch]);

    useEffect(() => {
        if (inputValue?.vin?.length === 11) {
            analysisStartClick();
            carTypeDataRefetch();
        }
    }, [inputValue?.vin]);

    // 차대번호 5~11 코드
    const {
        data: vin5to11Data,
        error: vin5to11Error,
        isLoading: vin5to11IsLoading,
        refetch: vin5to11Refetch,
    } = useQuery({
        queryKey: ["vin5to11", vinValueTypeCode?.vin14_text, vinValueTypeCode?.vin14],
        queryFn: () =>
            fetchVin5to11Data(userInfo.userId, {
                vin14: vinValueTypeCode?.vin14,
                vin14Text: vinValueTypeCode?.vin14_text,
            }),
        enabled:
            !!userInfo?.userId &&
            !!vinValueTypeCode?.vin14_text &&
            vinValueTypeCode?.vin14?.length === 4,
    });

    useEffect(() => {
        if (!vin5to11IsLoading && vin5to11Data) {
            setCarOtherGroup(vin5to11Data);
        }

        if (vin5to11Error) {
            alert("데이터를 불러오는 중 오류가 발생했습니다: " + vin5to11Error.message);
        }
    }, [vin5to11Data, vin5to11Error, vin5to11IsLoading, dispatch]);

    // EPC 옵션 및 소모품 정보
    const {
        data: epcCodeData,
        error: epcCodeError,
        isLoading: epcCodeIsLoading,
        refetch: epcCodeRefetch,
    } = useQuery({
        queryKey: ["epcCode", inputValue?.vin, vinValueTypeCode?.epc_code],
        queryFn: () =>
            fetchEpcExpData(userInfo.userId, {
                vin: inputValue?.vin,
                epccode: vinValueTypeCode?.epc_code,
            }),
        enabled:
            !!userInfo?.userId &&
            inputValue?.vin?.length === 11 &&
            !!vinValueTypeCode?.epc_code,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (!epcCodeIsLoading && epcCodeData) {
            setEpcOptList({
                jsonOpt1: epcCodeData?.jsonOpt1,
                jsonOpt2: epcCodeData?.jsonOpt2,
                jsonOpt3: epcCodeData?.jsonOpt3,
                jsonOpt4: epcCodeData?.jsonOpt4,
                jsonOpt5: epcCodeData?.jsonOpt5,
                jsonOpt6: epcCodeData?.jsonOpt6,
                jsonOpt7: epcCodeData?.jsonOpt7,
            });
            setSelectEpcOpt(epcCodeData?.jsonOptResult);
            if (epcCodeData?.jsonExpResult.length > 0) {
                setExpList(epcCodeData?.jsonExpResult);
            }
            setSelectedSeqNo("01");
            setSelectedTabContents((prev) => ({ ...prev, epcInfo: "opt1" }));
        }

        if (epcCodeError) {
            alert("데이터를 불러오는 중 오류가 발생했습니다: " + epcCodeError.message);
        }
    }, [epcCodeData, epcCodeError, epcCodeIsLoading, dispatch]);

    const epcCodeSearch = () => {
        const inputEpcCode = inputValue.epcCode;
        setVinValueTypeCode((prev: any) => ({ ...prev, epc_code: inputEpcCode }));
    };

    const analysisStartClick = () => {
        if (!inputValue?.vin || inputValue?.vin?.length < 11) {
            alert("차대번호 11자리를 입력해 주세요.");
            return;
        }

        const _value = inputValue.vin;
        setDivideInputValue({
            vin1to4: _value.slice(0, 4),
            vin5: _value.slice(4, 5),
            vin6: _value.slice(5, 6),
            vin7: _value.slice(6, 7),
            vin8: _value.slice(7, 8),
            vin9: _value.slice(8, 9),
            vin10: _value.slice(9, 10),
            vin11: _value.slice(10, 11),
        });
        queryClient.removeQueries({ queryKey: ["carType", inputValue?.vin, inputValue?.vin?.slice(0, 4), vinValueTypeCode?.vin14_text] });
        carTypeDataRefetch();
    };

    useEffect(() => {
        dispatch({ type: "SET_LOADING", payload: false });
    }, [dispatch]);

    const updateVinAndTab = (item: any, vinInfoKey: string, nextVinInfo: string) => {
        setVinValueTypeCode((prev: any) => ({
            ...prev,
            [`${vinInfoKey}_text`]: item.code_text,
            [vinInfoKey]: item.code,
        }));
        setSelectedTabContents((prev) => ({
            ...prev,
            vinInfo: nextVinInfo,
        }));
    };

    useEffect(() => {
        const updateVinValues = (vinType: string, jsonGroup: any, mapData: any) => {
            if (
                jsonGroup?.length > 0 &&
                vinValueTypeCode?.[vinType] === "" &&
                vinValueTypeCode?.[`${vinType}_text`] === "" &&
                divideInputValue?.[vinType] !== ""
            ) {
                const item = jsonGroup.find((item: any) => item.code === divideInputValue?.[vinType]);

                if (item) {
                    mapData[vinType] = item.code;
                    mapData[`${vinType}_text`] = item.code_text;
                }
            }
        };

        let mapData: any = {};
        const vinTypes = ["vin5", "vin6", "vin7", "vin8", "vin9", "vin10", "vin11"];

        vinTypes.forEach((vinType, index) => {
            updateVinValues(vinType, carOtherGroup?.[`json${index + 5}`], mapData);
        });

        if (JSON.stringify(mapData) !== JSON.stringify({})) {
            setVinValueTypeCode((prev: any) => ({
                ...prev,
                ...vinTypes.reduce(
                    (acc, vinType) => ({
                        ...acc,
                        [vinType]: mapData[vinType] ?? "",
                        [`${vinType}_text`]: mapData[`${vinType}_text`] ?? "",
                    }),
                    {}
                ),
            }));
        }
    }, [carOtherGroup]);

    const onVinRowSelect = {
        onVin1to4Select: (item: any) => {
            setVinValueTypeCode((prev: any) => ({
                ...prev,
                vin14_text: item.code_text,
                vin14: item.code,
                iv_carcode: item.iv_carcode,
            }));
            setSelectedTabContents((prev) => ({
                ...prev,
                vinInfo: "vin5",
            }));
        },
        onVin5Select: (item: any) => updateVinAndTab(item, "vin5", "vin6"),
        onVin6Select: (item: any) => updateVinAndTab(item, "vin6", "vin7"),
        onVin7Select: (item: any) => updateVinAndTab(item, "vin7", "vin8"),
        onVin8Select: (item: any) => updateVinAndTab(item, "vin8", "vin9"),
        onVin9Select: (item: any) => updateVinAndTab(item, "vin9", "vin10"),
        onVin10Select: (item: any) => updateVinAndTab(item, "vin10", "vin11"),
        onVin11Select: (item: any) => {
            setVinValueTypeCode((prev: any) => ({
                ...prev,
                vin11_text: item.code_text,
                vin11: item.code,
            }));
        },
    };

    const getNextKey = (key: string) => {
        if (key === "opt7") {
            return null;
        }

        const tabValue = `opt${String(Number(key.slice(-1)) + 1)}`;
        return tabValue;
    };

    const onEpcRowSelect = (item: any) => {
        if (inputValue.epcCode.length < 9) {
            alert("EPC 차량코드를 입력해 주세요.");
            return;
        }

        const [key, value] = Object.entries(item)[0];

        if (key && value) {
            const itemIndex = selectEpcOpt.findIndex((epcItem: any) => epcItem.seqno === selectedSeqNo);
            const newEpcItem =
                itemIndex === -1
                    ? {
                        seqno: "신규_01",
                        opt1: "",
                        opt2: "",
                        opt3: "",
                        opt4: "",
                        opt5: "",
                        opt6: "",
                        opt7: "",
                        [key]: value,
                    }
                    : {
                        ...selectEpcOpt[itemIndex],
                        [key]: value,
                    };

            if (itemIndex === -1) {
                setSelectedSeqNo("신규_01");
            }

            setSelectEpcOpt((prev: any) =>
                itemIndex === -1
                    ? [...prev, newEpcItem]
                    : [...prev.slice(0, itemIndex), newEpcItem, ...prev.slice(itemIndex + 1)]
            );

            const nextKey = getNextKey(key);
            if (nextKey) {
                setSelectedTabContents((prev) => ({ ...prev, epcInfo: nextKey }));
            }
        }
    };

    const addOptClick = () => {
        if (!addOptText) {
            alert("옵션명을 입력해 주세요.");
            return;
        }

        const optKey = selectedTabContents?.epcInfo;
        const arrayKey = `json${optKey.charAt(0).toUpperCase() + optKey.slice(1)}`;

        setEpcOptList((prev: any) => ({
            ...prev,
            [arrayKey]: [...(prev[arrayKey] || []), { [optKey]: addOptText }],
        }));

        setAddOptText(null);

        toast({
            description: "모든 내용은 저장시 반영됩니다.",
            duration: 1000,
            className: "fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 w-[350px]"
        });
    };

    const addSeqNo = () => {
        if (selectEpcOpt.length < 1) {
            alert("저장된 EPC 옵션이 없습니다.");
            return;
        }

        if (
            window.confirm(
                "세부코드를 추가 하시겠습니까?\n추가 후 저장시 반영되며 추가된 세부코드의 데이터는 첫번째 세부코드의 데이터를 복사하여 생성합니다."
            )
        ) {
            const seqNumber = String(selectEpcOpt.length + 101).slice(1, 3);
            setSelectEpcOpt((prev: any) => [...prev, { ...prev[0], seqno: `신규_${seqNumber}` }]);
            setExpList((prev: any) => [...prev, { ...prev[0], seqno: `신규_${seqNumber}` }]);
            setSelectedSeqNo(`신규_${seqNumber}`);
            setSelectedTabContents((prev) => ({ ...prev, epcInfo: "opt1" }));
        }
    };

    // 데이터 저장
    const mutationVinAnalysisData = useMutation({
        mutationFn: (data: any) => insertVinAnalysisData(userInfo?.userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    "carType",
                    inputValue?.vin,
                    inputValue?.vin?.slice(0, 4),
                ]
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "vin5to11",
                    vinValueTypeCode?.vin14_text,
                    vinValueTypeCode?.vin14,
                ]
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "epcCode",
                    inputValue?.vin,
                    vinValueTypeCode?.epc_code,
                ]
            });

            // 데이터 업데이트 성공 후 캐시 무효화
            queryClient
                .invalidateQueries({
                    queryKey: [
                        "vin5to11",
                        vinValueTypeCode?.vin14_text,
                        vinValueTypeCode?.vin14,
                    ]
                })
                .then(() => {
                    queryClient
                        .invalidateQueries({
                            queryKey: [
                                "epcCode",
                                inputValue?.vin,
                                vinValueTypeCode?.epc_code,
                            ]
                        })
                        .then(() => {
                            if (allClear) {
                                //저장 후 초기화
                                analysisInitClick();
                            } else {
                                //저장 후 다시 로드
                                analysisStartClick();
                                carTypeDataRefetch();
                                vin5to11Refetch();
                                epcCodeRefetch();
                            }

                            toast({
                                description: "저장 완료",
                                duration: 1000,
                                className: "fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 w-[350px]"
                            });
                        });
                });
        },
        onError: (error: any) => {
            toast({
                description: `저장 실패-${error.message}`,
                duration: 1000,
                className: "fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 w-[350px]"
            });
        },
    });

    const excuteSave = () => {
        const reqData = {
            reqDataVin: { ...vinValueTypeCode, vin: inputValue.vin, epc_code: inputValue.epcCode },
            reqDataEpcs: selectEpcOpt,
            reqDataExps: expList,
        };

        mutationVinAnalysisData.mutate(reqData);
    };

    const checkSaveData = () => {
        if (inputValue.vin.length !== 11) {
            alert("저장할 차대번호 11자리가 없습니다.");
            return false;
        } else if (vinValueTypeCode.epc_code !== inputValue.epcCode && vinValueTypeCode.epc_code) {
            alert(
                "최초 로드된 EPC차량코드에서 변경사항이 있습니다.\n확인 후 다시 시도 하는 것이 어떨까요?"
            );
            return true;
        } else if (!vinValueTypeCode.vin14 || !vinValueTypeCode.iv_carcode) {
            alert("차종구분 부터 정확하게 선택해주세요.");
            return false;
        } else {
            return true;
        }
    };

    const saveClick = () => {
        const state = checkSaveData();

        if (state && window.confirm("저장하시겠습니까?")) {
            excuteSave();
        }
    };

    const saveAllClearClick = () => {
        const state = checkSaveData();

        if (state && window.confirm("저장후 화면을 초기화 합니다. 계속 하시겠습니까?")) {
            allClear = true;
            excuteSave();
        }
    };

    const startAnalysis = (vin11: string) => {
        setReloadTrigger((prev) => !prev);
        setOpen(false);
        setInputValue((prev) => ({ ...prev, vin: vin11 }));
    };

    // 신규 차대번호 분석 시작
    const mutationNewVinAnalysisStart = useMutation({
        mutationFn: (data: any) => updateNewVinAnaysis(userInfo?.userId, data),
        onSuccess: (res: any) => {
            startAnalysis(res.vin11);
        },
        onError: (error: any, res: any) => {
            if (error.message.indexOf("작업중") > -1) {
                if (window.confirm(`${error.message}\n계속 진행하시겠습니까?`)) {
                    startAnalysis(res.vin11);
                }
            }

            toast({
                description: `작업 실패-${error.message}`,
                duration: 1000,
                className: "fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 w-[350px]"
            });
        },
    });

    // 차대번호 기초코드 추가
    const mutationAddVinCode = useMutation({
        mutationFn: (data: any) => addVinCode(userInfo?.userId, data),
        onSuccess: (res: any) => {
            vin5to11Refetch();
        },
        onError: (error: any) => {
            toast({
                description: `작업 실패-${error.message}`,
                duration: 1000,
                className: "fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 w-[350px]"
            });
        },
    });

    const addCodeHandler = (kind: number) => {
        const code = addCode?.[`vin${kind}`];
        const codeText = addCode?.[`vin${kind}_text`];

        if (!code || !codeText) {
            alert("코드 및 코드명을 입력해 주세요.");
            return;
        }

        if (!vinValueTypeCode?.vin14 || !vinValueTypeCode?.vin14_text) {
            alert("차종구분을 먼저 선택해 주세요.");
            return;
        }

        const reqData = {
            orderno: kind,
            code,
            code_text: codeText,
            parent_vin14: vinValueTypeCode?.vin14,
            parent_vin14_text: vinValueTypeCode?.vin14_text,
            iv_carcode: vinValueTypeCode?.iv_carcode,
        };
        mutationAddVinCode.mutate(reqData);
    };

    // 신규 차대번호 분석 제외
    const mutationDeleteNewVin = useMutation({
        mutationFn: (data: any) => deleteNewVin(userInfo?.userId, data),
        onSuccess: (res: any) => {
            setReloadTrigger((prev) => !prev);
        },
        onError: (error: any) => {
            toast({
                description: `작업 실패-${error.message}`,
                duration: 1000,
                className: "fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 w-[350px]"
            });
        },
    });

    const handleNewVinListAction = (action: string, item: any) => {
        switch (action) {
            case "basicCode":
                router.push(`/dataAnalysis/Code?vin11=${item.vin11}`);
                break;
            case "analyze":
                if (
                    window.confirm(
                        `[${item.vin11}]의 분석을 시작합니다.\n선택시 다른 작업자는 수정이 불가능합니다.`
                    )
                ) {
                    const reqData = {
                        vin11: item.vin11,
                    };
                    mutationNewVinAnalysisStart.mutate(reqData);
                }
                break;
            case "exclude":
                if (
                    window.confirm(`[${item.vin11}] 분석대상에서 제외 합니다.\n계속하시겠습니까?`)
                ) {
                    const reqData = {
                        vin11: item.vin11,
                    };
                    mutationDeleteNewVin.mutate(reqData);
                }
                break;
            default:
                return;
        }
    };

    const analysisInitClick = () => {
        setIsEpcInputState(false);
        setIsExpInputState(false);
        setInputValue(initInputValueType);
        setDivideInputValue(initDivideInputValue);
        setCarModelList([]);
        setCarOtherGroup(initCarOtherGroupType);
        setVinValueTypeCode(initVinValueTypeCode);
        setEpcOptList(initEpcOptList);
        setSelectEpcOpt([]);
        setExpList(initExpList);
        setSelectedSeqNo("01");
        setSelectedTabContents(initTabContent);
        setAddOptText(null);
        setAddCode(initAddCode);
        allClear = false;
    };

    useEffect(() => {
        if (inputValue?.vin.length === 11 && vinValueTypeCode?.iv_carcode.length === 7) {
            setIsEpcInputState(true);
        }

        if (
            inputValue?.vin.length === 11 &&
            inputValue?.epcCode.length > 8 &&
            vinValueTypeCode?.iv_carcode.length === 7
        ) {
            setIsExpInputState(true);
        }
    }, [inputValue?.vin, inputValue?.epcCode, vinValueTypeCode?.iv_carcode]);

    return (
        <div className="flex flex-col">
            <ResizablePanelGroup direction="horizontal" className="max-w-full rounded-lg border">
                <ResizablePanel defaultSize={40} minSize={20}>
                    <div className="flex justify-center p-6 overflow-auto">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>차대번호 분석</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col space-y-4">
                                    <div className="flex flex-row justify-between">
                                        <div className="flex flex-row">
                                            <div className="flex-col">
                                                <Label htmlFor="vin">차대번호</Label>
                                                <Input
                                                    type="text"
                                                    id="vin"
                                                    className="flex-[1] rounded-r-none border-r-0"
                                                    placeholder="차대번호 11자리"
                                                    maxLength={11}
                                                    value={inputValue?.vin || ""}
                                                    onChange={(e) =>
                                                        setInputValue((prev) => ({
                                                            ...prev,
                                                            vin: e.target.value,
                                                        }))
                                                    }
                                                />
                                            </div>
                                            <div className="flex flex-row pt-[24px]">
                                                <Button
                                                    className="rounded-none"
                                                    onClick={analysisStartClick}
                                                >
                                                    나누기
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="rounded-l-none"
                                                    onClick={analysisInitClick}
                                                >
                                                    초기화
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-row pt-[24px]">
                                            <CreateNewVinList
                                                userInfo={userInfo || null}
                                                handleAction={handleNewVinListAction}
                                                open={open}
                                                setOpen={setOpen}
                                                reloadTrigger={reloadTrigger}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <i className="fa-duotone fa-angles-down" />
                                    </div>

                                    <CreateVinInfo data={divideInputValue} />

                                    <hr />

                                    <CreateVinInfoTabs
                                        carModel={carModelList}
                                        carOtherGroup={carOtherGroup}
                                        vinValueTypeCode={vinValueTypeCode}
                                        selectedTabContents={selectedTabContents?.vinInfo}
                                        setSelectedTabContents={setSelectedTabContents}
                                        onRowSelect={onVinRowSelect}
                                        addCode={addCode}
                                        setAddCode={setAddCode}
                                        addCodeHandler={addCodeHandler}
                                    />

                                    <Label>
                                        ※ 없는 차종은 "차종별 차대번호 기초코드" 메뉴를 통해 등록후
                                        작업 가능합니다.
                                    </Label>

                                    <hr />

                                    <CreateTypeCode vinValueTypeCode={vinValueTypeCode} carOtherGroup={carOtherGroup} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={60} minSize={20}>
                    <div className="flex flex-col justify-center p-6 space-y-5 overflow-auto">
                        <div className="flex h-full justify-center">
                            <Card className="w-full flex-1">
                                <CardHeader>
                                    <CardTitle>
                                        <div className="flex items-center justify-between">
                                            <p className="font-extrabold">EPC 옵션 및 소모품 정보</p>
                                            <div className="flex">
                                                <Button
                                                    className="rounded-r-none"
                                                    onClick={saveAllClearClick}
                                                >
                                                    저장 후 전체 신규
                                                </Button>
                                                <Button
                                                    className="rounded-l-none"
                                                    variant="outline"
                                                    onClick={saveClick}
                                                >
                                                    저장 후 EPC 옵션 & 소모품 정보 계속 추가
                                                </Button>
                                            </div>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col space-y-3">
                                        <div className="flex flex-row justify-between gap-2">
                                            <div className="flex flex-row flex-1">
                                                <div className="flex-col">
                                                    <Label htmlFor="epcCode">EPC 차량코드</Label>
                                                    <Input
                                                        type="text"
                                                        id="epcCode"
                                                        className="rounded-r-none border-r-0"
                                                        placeholder="EPC 코드"
                                                        maxLength={10}
                                                        value={inputValue.epcCode || ""}
                                                        onChange={(e) =>
                                                            setInputValue((prev) => ({
                                                                ...prev,
                                                                epcCode: e.target.value,
                                                            }))
                                                        }
                                                        disabled={!isEpcInputState}
                                                    />
                                                </div>
                                                <div className="flex flex-row pt-[24px]">
                                                    <Button
                                                        className="rounded-l-none"
                                                        onClick={epcCodeSearch}
                                                    >
                                                        조회
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex-col w-[150px]">
                                                <Label htmlFor="seqNo">세부코드</Label>
                                                <Select
                                                    value={selectedSeqNo || "01"}
                                                    onValueChange={(value) => {
                                                        setSelectedSeqNo(value);
                                                        setSelectedTabContents((prev) => ({
                                                            ...prev,
                                                            epcInfo: "opt1",
                                                        }));
                                                    }}
                                                >
                                                    <SelectTrigger id="seqNo">
                                                        <SelectValue placeholder="EPC 세부코드" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {selectEpcOpt.map((item: any, idx: number) => {
                                                            return (
                                                                <SelectItem
                                                                    key={idx}
                                                                    value={item.seqno}
                                                                >
                                                                    {item.seqno}
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex-col pt-[24px]">
                                                <Button variant="outline" onClick={addSeqNo}>
                                                    세부코드 추가
                                                </Button>
                                            </div>
                                        </div>

                                        <CreateEpcInfoTabs
                                            epcOptList={epcOptList}
                                            selectEpcOpt={selectEpcOpt}
                                            selectedSeqNo={selectedSeqNo}
                                            selectedTabContents={selectedTabContents?.epcInfo}
                                            setSelectedTabContents={setSelectedTabContents}
                                            onRowSelect={onEpcRowSelect}
                                        />

                                        <CreateAddEpcCodeForm
                                            addOptText={addOptText}
                                            setAddOptText={setAddOptText}
                                            addOptClick={addOptClick}
                                            isEpcInputState={isEpcInputState}
                                        />

                                        <Label htmlFor="vin">소모품 정보</Label>

                                        <CreateExpInfo
                                            expList={expList}
                                            setExpList={setExpList}
                                            selectedSeqNo={selectedSeqNo}
                                            isExpInputState={isExpInputState}
                                        />

                                        <div className="text-right pt-2">
                                            <Button
                                                className="rounded-r-none"
                                                onClick={saveAllClearClick}
                                            >
                                                저장 후 전체 신규
                                            </Button>
                                            <Button
                                                className="rounded-l-none"
                                                variant="outline"
                                                onClick={saveClick}
                                            >
                                                저장 후 EPC 옵션 & 소모품 정보 계속 추가
                                            </Button>
                                        </div>

                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
