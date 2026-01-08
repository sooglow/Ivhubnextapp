'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import React, { useCallback, useEffect, useState, Suspense } from 'react'
import { DataTable } from '@/components/comm/dataTable/DataTable'
import { getBasicCarModelColumns, getVin5to11Columns } from '@/components/comm/dataTable/columns'
import CodeInputForm from '../compenents/CodeInputForm'
import { useLoading } from '@/public/contexts/LoadingContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addVin1to4, addVin5to11, copyVin5to11, deleteVin5to11Code, deleteVinCode, fetchCarData, fetchVin5to11, fetchVinData, initVin5to11, updateVin5to11 } from '../apis/CodeApis'
import { useUserData } from '@/public/hooks/useUserData'
import CodeAddVin1to4 from '../compenents/CodeAddVin1to4'
import CodeSearchBar from '../compenents/CodeSearchBar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSearchParams } from 'next/navigation'

function CodeContent() {
    const searchParams = useSearchParams();
    const vin11 = searchParams.get('vin11') || "";
    const [carFilter, setCarFilter] = useState([]);
    const [selectedSearchValue, setSelectedSearchValue] = useState({ iv_carcode: "", code_text: "", vin4: vin11 ? vin11.slice(0, 4) : "" });
    const [selectedVin1to4, setSelectedVin1to4] = useState(null);
    const [vin1to4, setVin1to4] = useState([]);
    const [vin5to11, setVin5to11] = useState({ json5: [], json6: [], json7: [], json8: [], json9: [], json10: [], json11: [] });
    const { dispatch } = useLoading();
    const userInfo = useUserData();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // fetch차종필터
    const {
        data: carFilterData,
        error: carFilterError,
        isLoading: carFilterIsLoading,
        refetch: carFilterRefetch
    } = useQuery({
        queryKey: ['vinData'],
        queryFn: () => fetchVinData((userInfo as any).userId),
        enabled: !!(userInfo as any)?.userId,
    });

    useEffect(() => {
        if (!carFilterIsLoading && carFilterData) {
            setCarFilter(carFilterData?.jsonData);
            // 신규 차종 추가 후 refetch
            if (addCarItem.iv_carcode) {
                //추가한 신규 차종 선택
                setSelectedSearchValue(prev => ({ ...prev, iv_carcode: addCarItem.iv_carcode }));
                setAddCarItem({ code: '', code_text: '', iv_carcode: '' });
            }
            dispatch({ type: "SET_LOADING", payload: false });
        }

        if (carFilterError) {
            alert('데이터를 불러오는 중 오류가 발생했습니다: ' + carFilterError.message);
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }, [carFilterData, carFilterError, carFilterIsLoading, carFilterRefetch, dispatch]);

    const [addCarItem, setAddCarItem] = useState({ code: '', code_text: '', iv_carcode: '' });

    // 차종 리스트
    const {
        data: carListData,
        error: carListError,
        isLoading: carListIsLoading
    } = useQuery({
        queryKey: ['carListData', selectedSearchValue],
        queryFn: () => fetchCarData((userInfo as any).userId, selectedSearchValue),
        enabled: !!(userInfo as any)?.userId && (selectedSearchValue?.vin4?.length > 3 || !!selectedSearchValue?.iv_carcode)
    });

    useEffect(() => {
        if (!carListIsLoading && carListData) {
            setVin1to4(carListData?.jsonVin14);
            setSelectedVin1to4(null);
        }

        if (carListError) {
            alert('데이터를 불러오는 중 오류가 발생했습니다: ' + carListError.message);
        }
    }, [carListData, carListError, carListIsLoading, dispatch]);


    // 신규 차종 등록
    const mutationAddVin1to4 = useMutation({
        mutationFn: (data: any) => addVin1to4((userInfo as any)?.userId, data),
        onSuccess: () => {
            alert("신규 차종 추가 완료");

            // 신규 차종 추가 성공시 vinData 캐시 무효화 후 refetch
            queryClient.invalidateQueries({ queryKey: ['vinData'] })
                .then(() => {
                    carFilterRefetch();
                });
        },
        onError: (error: any) => {
            alert(`신규 차종 추가 실패-${error.message}`);
        }
    });

    // 신규 차종 추가 버튼 선택시
    const addVin1to4Click = () => {
        if (!addCarItem?.code || addCarItem?.code.length < 4) {
            alert("차대번호 앞 4자리를 모두 입력해 주세요.");
            return;
        }

        if (!addCarItem?.code_text && !addCarItem?.iv_carcode) {
            alert("신규 차종을 선택해 주세요.");
            return;
        }

        if (window.confirm("신규 차종을 추가하시겠습니까?")) {
            const reqData = {
                orderno: "1",
                code: addCarItem.code,
                code_text: addCarItem.code_text,
                parent_vin14: addCarItem.code,
                parent_vin14_text: addCarItem.code_text,
                iv_carcode: addCarItem.iv_carcode
            };

            mutationAddVin1to4.mutate(reqData);
        }
    }

    // 차종별 VIN코드
    const {
        data: vin5to11ListData,
        error: vin5to11ListError,
        isLoading: vin5to11ListIsLoading
    } = useQuery({
        queryKey: ['vin5to11Data', selectedVin1to4],
        queryFn: () => fetchVin5to11((userInfo as any).userId, selectedVin1to4),
        enabled: !!(userInfo as any)?.userId
    });

    useEffect(() => {
        if (!vin5to11ListIsLoading && vin5to11ListData) {
            setVin5to11(vin5to11ListData);
        }

        if (carListError) {
            alert('데이터를 불러오는 중 오류가 발생했습니다: ' + carListError.message);
        }
    }, [vin5to11ListData, vin5to11ListError, vin5to11ListIsLoading, dispatch]);

    // 차대번호 5~11자리 코드 수정
    const mutationVin5to11 = useMutation({
        mutationFn: (data: any) => updateVin5to11((userInfo as any)?.userId, data),
        onSuccess: () => {
            // 데이터 업데이트 성공 후 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['vin5to11Data', selectedVin1to4] }).then(() => {
                toast({
                    description: "업데이트 완료",
                });
            });
        },
        onError: (error: any) => {
            toast({
                description: `업데이트 실패-${error.message}`,
            });
        }
    });

    // 코드 수정시
    const onRowUpdate = useCallback((value: any) => {
        if (!value) {
            alert("업데이트 값이 정상적으로 전달되지 않았습니다. 다시 시도해 주세요.");
            return;
        }

        if (!selectedVin1to4) {
            alert("차종 선택을 다시 해주세요.")
            return;
        }

        const reqData = {
            ...value,
            parent_vin14: selectedVin1to4.code,
            parent_vin14_text: selectedVin1to4.code_text,
            iv_carcode: selectedVin1to4.iv_carcode,
        };

        mutationVin5to11.mutate(reqData);
    }, [mutationVin5to11, selectedVin1to4])

    // 입력폼 및 데이터 초기화
    const initState = () => {
        setSelectedSearchValue({ iv_carcode: "", code_text: "", vin4: "" });
        setAddCarItem({ code: '', code_text: '', iv_carcode: '' });
        setSelectedVin1to4(null);
        setVin1to4([]);
        setVin5to11({ json5: [], json6: [], json7: [], json8: [], json9: [], json10: [], json11: [] });
        setCopyCarcode(null);
    }

    // 선택차종 코드
    const [copyCarcode, setCopyCarcode] = useState(null);

    // 선택차종 코드 복사
    const mutationCopyVin5to11 = useMutation({
        mutationFn: (data: any) => copyVin5to11((userInfo as any)?.userId, data),
        onSuccess: () => {
            // 데이터 업데이트 성공 후 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['vin5to11Data', selectedVin1to4] });
            toast({
                description: "복사 완료",
            });
        },
        onError: (error: any) => {
            toast({
                description: `복사 실패-${error.message}`,
            });
        }
    });

    // 선택차종 코드 복사 버튼 Click
    const copyVin5to11Click = () => {
        const parentVin14Text = selectedVin1to4?.code_text || null;
        const parentVin14 = selectedVin1to4?.code || null;
        const targetCarcode = selectedVin1to4?.iv_carcode || null;
        const orgCarcode = copyCarcode || null;

        if (!parentVin14Text || !parentVin14 || !targetCarcode || !orgCarcode) {
            alert("복사할 대상 차종 선택 혹은 원본이 선택되지 않았습니다.");
            return;
        }

        if (window.confirm(`${parentVin14Text} 차종에 선택 차종 코드를 복사합니다. 진행하시겠습니까?`)) {
            const reqData = {
                parent_vin14_text: parentVin14Text,
                parent_vin14: parentVin14,
                org_carcode: orgCarcode,
                target_carcode: targetCarcode
            };

            mutationCopyVin5to11.mutate(reqData);
        }
    }

    // 선택 차종코드 초기화
    const mutationInitVin5to11 = useMutation({
        mutationFn: (data: any) => initVin5to11((userInfo as any)?.userId, data),
        onSuccess: () => {
            // 데이터 업데이트 성공 후 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['vin5to11Data', selectedVin1to4] });
            toast({
                description: "삭제 완료",
            });
        },
        onError: (error: any) => {
            toast({
                description: `삭제 실패-${error.message}`,
            });
        }
    });

    // 선택 차종코드 초기화 버튼 Click
    const initVin5to11Click = () => {
        const parentVin14Text = selectedVin1to4?.code_text || null;
        const parentVin14 = selectedVin1to4?.code || null;
        const ivCarcode = selectedVin1to4?.iv_carcode || null;

        if (!parentVin14Text || !parentVin14 || !ivCarcode) {
            alert("코드 초기화가 필요한 차종을 좌측 리스트에서 선택해 주세요.");
            return;
        }

        if (window.confirm(`${parentVin14Text} 차종의 차대번호 5~11 자리 코드가 모두 삭제됩니다. 계속 하시겠습니까?`)) {
            const reqData = {
                iv_carcode: ivCarcode,
                parent_vin14: parentVin14,
                parent_vin14_text: parentVin14Text,
            };

            mutationInitVin5to11.mutate(reqData);
        }
    }

    // 선택 차종 차대번호 5~11 자리 코드 추가
    const mutationAddVin5to11 = useMutation({
        mutationFn: (data: any) => addVin5to11((userInfo as any)?.userId, data),
        onSuccess: () => {
            // 데이터 업데이트 성공 후 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['vin5to11Data', selectedVin1to4] });
            setAddCodeText(initAddCode);
            toast({
                description: "추가 완료",
            });
        },
        onError: (error: any) => {
            toast({
                description: `추가 실패-${error.message}`,
            });
        }
    });

    const initAddCode = {
        order5: { code: '', codeText: '' },
        order6: { code: '', codeText: '' },
        order7: { code: '', codeText: '' },
        order8: { code: '', codeText: '' },
        order9: { code: '', codeText: '' },
        order10: { code: '', codeText: '' },
        order11: { code: '', codeText: '' },
    };
    const [addCode, setAddCodeText] = useState(initAddCode);

    const addVin5to11Click = (orderNo: number) => {
        const parentVin14Text = selectedVin1to4?.code_text || null;
        const parentVin14 = selectedVin1to4?.code || null;
        const ivCarcode = selectedVin1to4?.iv_carcode || null;

        if (!parentVin14Text || !parentVin14 || !ivCarcode) {
            alert("코드를 등록할 차종을 좌측 리스트에서 선택해 주세요.");
            return;
        }

        const orderKey = `order${orderNo}`;
        const order = addCode[orderKey];

        if (!order?.code || !order?.codeText) {
            alert("등록할 코드 혹은 코드명을 입력해 주세요.");
            return;
        }

        const reqData = {
            "orderno": orderNo,
            "code": order?.code,
            "code_text": order?.codeText,
            "parent_vin14": parentVin14,
            "parent_vin14_text": parentVin14Text,
            "iv_carcode": ivCarcode
        };

        mutationAddVin5to11.mutate(reqData);
    }

    //  차종 삭제
    const mutationDeleteVinCode = useMutation({
        mutationFn: (data: any) => deleteVinCode((userInfo as any)?.userId, data),
        onSuccess: () => {
            // 데이터 업데이트 성공 후 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['carListData', selectedSearchValue] })
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: ['vin5to11Data', selectedVin1to4] })
                        .then(() => {
                            toast({
                                description: "삭제 완료",
                            });
                        });
                });
        },
        onError: (error: any) => {
            toast({
                description: `삭제 실패-${error.message}`,
            });
        }
    });


    //  차종 삭제 Actions 선택
    const handleVin1to4Action = (actionType: string, item: any) => {
        if (actionType === 'delete') {
            if (!item) {
                alert("선택된 차종이 없습니다.");
                return;
            }

            if (window.confirm("차종 삭제시 해당 차량 하위에 등록된 모든 코드가 삭제됩니다. 삭제하시겠습니까?")) {
                const reqData = {
                    code: item.code,
                    code_text: item.code_text,
                    iv_carcode: item.iv_carcode
                }

                mutationDeleteVinCode.mutate(reqData);
            }
        }
    };

    // 차대번호 코드 5~11자리 삭제
    const mutationDeleteVin5to11Code = useMutation({
        mutationFn: (data: any) => deleteVin5to11Code((userInfo as any)?.userId, data),
        onSuccess: () => {
            // 데이터 업데이트 성공 후 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['vin5to11Data', selectedVin1to4] })
                .then(() => {
                    toast({
                        description: "삭제 완료",
                    });
                });
        },
        onError: (error: any) => {
            toast({
                description: `삭제 실패-${error.message}`,
            });
        }
    });

    // 차대번호 코드 5~11자리 삭제 Click
    const handleVin5to11Action = (actionType: string, item: any) => {
        if (actionType === 'delete') {
            const parentVin14Text = selectedVin1to4?.code_text || null;
            const parentVin14 = selectedVin1to4?.code || null;
            const ivCarcode = selectedVin1to4?.iv_carcode || null;

            if (!parentVin14Text || !parentVin14 || !ivCarcode) {
                alert("선택된 차종이 없습니다.");
                return;
            }

            if (!item) {
                alert("선택된 세부코드가 없습니다.");
                return;
            }

            const reqData = {
                code: item.code,
                code_text: item.code_text,
                orderno: item.orderno,
                parent_vin14: parentVin14,
                parent_vin14_text: parentVin14Text,
                iv_carcode: ivCarcode
            }

            mutationDeleteVin5to11Code.mutate(reqData);
        }
    };

    return (
        <ResizablePanelGroup
            orientation="horizontal"
            className="max-w-full rounded-lg border"
        >
            <ResizablePanel defaultSize={30} minSize={10}>
                <div className="flex justify-center p-6 h-[1456px]">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>차종입력</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col space-y-3">
                                {/* 차종필터 및 차대번호 앞 4자리 조회bar */}
                                <CodeSearchBar
                                    selectedSearchValue={selectedSearchValue}
                                    setSelectedSearchValue={setSelectedSearchValue}
                                    carFilter={carFilter}
                                    initState={initState}
                                />

                                <hr />

                                <div className="w-full">
                                    {/* 등록차종 리스트 */}
                                    <DataTable
                                        data={vin1to4}
                                        isLoading={carListIsLoading}
                                        onRowSelect={(value: any) => setSelectedVin1to4(value)}
                                        columns={getBasicCarModelColumns}
                                        onAction={handleVin1to4Action}
                                    />
                                </div>

                                {/* 신규 차종추가 컨트롤Bar */}
                                <CodeAddVin1to4
                                    addCarItem={addCarItem}
                                    setAddCarItem={setAddCarItem}
                                    userInfo={userInfo}
                                    dispatch={dispatch}
                                    addVin1to4Click={addVin1to4Click}
                                />
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70} minSize={50}>
                <div className="p-6 grid grid-cols-3 gap-3">
                    <Card className="w-full col-span-3">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between px-2">
                                <p className="font-extrabold">차대번호 5 ~ 11번째 자리 코드</p>
                                <div className="flex gap-1">
                                    <div className="flex w-[200px]">
                                        <Select
                                            value={copyCarcode || ""}
                                            onValueChange={(value) => {
                                                setCopyCarcode(value);
                                            }}
                                        >
                                            <SelectTrigger id="category" aria-label="복사할 원본 차량 선택">
                                                <SelectValue placeholder="복사할 원본 차량 선택" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    vin1to4.length > 0 ? vin1to4.map((item: any, idx: number) => (
                                                        <SelectItem
                                                            key={idx}
                                                            value={item.iv_carcode}
                                                        >
                                                            {item.code_text}
                                                        </SelectItem>
                                                    )) : <p>데이터가 없습니다.</p>
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex">
                                        <Button
                                            className="rounded-r-none"
                                            onClick={copyVin5to11Click}
                                        >
                                            복사
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="rounded-l-none"
                                            onClick={initVin5to11Click}
                                        >
                                            선택 차종코드 초기화
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>세부</CardTitle>
                            <CardDescription>차대번호 5번째 자리</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col">
                                <ScrollArea className="h-[259px] w-full rounded-md border">
                                    <DataTable
                                        columns={getVin5to11Columns}
                                        data={vin5to11?.json5}
                                        isLoading={vin5to11ListIsLoading}
                                        onRowUpdate={onRowUpdate}
                                        onAction={handleVin5to11Action}
                                    />
                                </ScrollArea>
                                <CodeInputForm
                                    addCode={addCode}
                                    setAddCodeText={setAddCodeText}
                                    orderNo={5}
                                    addVin5to11Click={addVin5to11Click}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>차체</CardTitle>
                            <CardDescription>차대번호 6번째 자리</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col">
                                <ScrollArea className="h-[259px] w-full rounded-md border">
                                    <DataTable
                                        columns={getVin5to11Columns}
                                        data={vin5to11?.json6}
                                        isLoading={vin5to11ListIsLoading}
                                        onRowUpdate={onRowUpdate}
                                        onAction={handleVin5to11Action}
                                    />
                                </ScrollArea>
                                <CodeInputForm
                                    addCode={addCode}
                                    setAddCodeText={setAddCodeText}
                                    orderNo={6}
                                    addVin5to11Click={addVin5to11Click}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>장비</CardTitle>
                            <CardDescription>차대번호 7번째 자리</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col">
                                <ScrollArea className="h-[259px] w-full rounded-md border">
                                    <DataTable
                                        columns={getVin5to11Columns}
                                        data={vin5to11?.json7}
                                        isLoading={vin5to11ListIsLoading}
                                        onRowUpdate={onRowUpdate}
                                        onAction={handleVin5to11Action}
                                    />
                                </ScrollArea>
                                <CodeInputForm
                                    addCode={addCode}
                                    setAddCodeText={setAddCodeText}
                                    orderNo={7}
                                    addVin5to11Click={addVin5to11Click}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>엔진</CardTitle>
                            <CardDescription>차대번호 8번째 자리</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col">
                                <ScrollArea className="h-[259px] w-full rounded-md border">
                                    <DataTable
                                        columns={getVin5to11Columns}
                                        data={vin5to11?.json8}
                                        isLoading={vin5to11ListIsLoading}
                                        onRowUpdate={onRowUpdate}
                                        onAction={handleVin5to11Action}
                                    />
                                </ScrollArea>
                                <CodeInputForm
                                    addCode={addCode}
                                    setAddCodeText={setAddCodeText}
                                    orderNo={8}
                                    addVin5to11Click={addVin5to11Click}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>차체</CardTitle>
                            <CardDescription>차대번호 9번째 자리</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col">
                                <ScrollArea className="h-[259px] w-full rounded-md border">
                                    <DataTable
                                        columns={getVin5to11Columns}
                                        data={vin5to11?.json9}
                                        isLoading={vin5to11ListIsLoading}
                                        onRowUpdate={onRowUpdate}
                                        onAction={handleVin5to11Action}
                                    />
                                </ScrollArea>
                                <CodeInputForm
                                    addCode={addCode}
                                    setAddCodeText={setAddCodeText}
                                    orderNo={9}
                                    addVin5to11Click={addVin5to11Click}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>연도</CardTitle>
                            <CardDescription>차대번호 10번째 자리</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col">
                                <ScrollArea className="h-[259px] w-full rounded-md border">
                                    <DataTable
                                        columns={getVin5to11Columns}
                                        data={vin5to11?.json10}
                                        isLoading={vin5to11ListIsLoading}
                                        onRowUpdate={onRowUpdate}
                                        onAction={handleVin5to11Action}
                                    />
                                </ScrollArea>
                                <CodeInputForm
                                    addCode={addCode}
                                    setAddCodeText={setAddCodeText}
                                    orderNo={10}
                                    addVin5to11Click={addVin5to11Click}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>공장</CardTitle>
                            <CardDescription>차대번호 11번째 자리</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col">
                                <ScrollArea className="h-[259px] w-full rounded-md border">
                                    <DataTable
                                        columns={getVin5to11Columns}
                                        data={vin5to11?.json11}
                                        isLoading={vin5to11ListIsLoading}
                                        onRowUpdate={onRowUpdate}
                                        onAction={handleVin5to11Action}
                                    />
                                </ScrollArea>
                                <CodeInputForm
                                    addCode={addCode}
                                    setAddCodeText={setAddCodeText}
                                    orderNo={11}
                                    addVin5to11Click={addVin5to11Click}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup >
    )
}

export default function Code() {
    return (
        <Suspense fallback={<div>로딩중...</div>}>
            <CodeContent />
        </Suspense>
    )
}
