import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getNewVinListColumns } from 'components/comm/dataTable/columns';
import { DataTable } from 'components/comm/dataTable/DataTable';
import { useQuery } from '@tanstack/react-query';
import { fetchNewVinList, getNewVinCountTypeBrand } from '../apis/CreateApis';
import Pagenation from './Pagenation';
import { fetchSampleVin17List } from '../apis/ViewApis';

function CreateNewVinList({ userInfo, handleAction, open, setOpen, reloadTrigger }) {
    const [makerList, setMakerList] = useState([]);
    const [newVinList, setNewVinList] = useState(null);
    const [selectedVin, setSelectedVin] = useState(null);
    const [sampleVinNumber, setSampleVinNumber] = useState([]);
    const [selectedMaker, setSelectedMaker] = useState(null);
    const [keyword, setKeyword] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const maxListCount = 10;

    // 신규 차대번호 브랜드별 Count
    const {
        data: countTypeMakerData,
        error: countTypeMakerError,
        isLoading: countTypeMakerIsLoading,
    } = useQuery({
        queryKey: ['countTypeMaker'],
        queryFn: () => getNewVinCountTypeBrand(userInfo?.userId),
        enabled: !!userInfo.userId && open,
    });

    useEffect(() => {
        if (!countTypeMakerIsLoading && countTypeMakerData) {
            setMakerList(countTypeMakerData.jsonData);
            setSelectedMaker(countTypeMakerData.jsonData[0].vin2);

            newVinRefetch();
        }

        if (countTypeMakerError) {
            alert('데이터를 불러오는 중 오류가 발생했습니다: ' + countTypeMakerError.message);
        }
    }, [countTypeMakerIsLoading, countTypeMakerData, countTypeMakerError]);

    // 신규 차대번호 미작업건 List
    const {
        data: newVinData,
        error: newVinError,
        isLoading: newVinIsLoading,
        refetch: newVinRefetch
    } = useQuery({
        queryKey: ['newVinList', currentPage, keyword, selectedMaker],
        queryFn: () => fetchNewVinList(userInfo?.userId, { vin2: selectedMaker, keyword, currentPage, maxListCount }),
        enabled: false,
    });

    useEffect(() => {
        if (!newVinIsLoading && newVinData) {
            setNewVinList(newVinData.jsonData);
            setTotalCount(newVinData.totalCnt);
        }

        if (newVinError) {
            alert('데이터를 불러오는 중 오류가 발생했습니다: ' + newVinError.message);
        }
    }, [newVinIsLoading, newVinData, newVinError]);

    useEffect(() => {
        newVinRefetch();
        setCurrentPage(1);
    }, [selectedMaker]);

    useEffect(() => {
        // maker변경 후 1Page 중복 호출을 막기 위한 로직
        if (currentPage !== 1) {
            newVinRefetch();
        }
    }, [currentPage]);

    const searchClick = () => {
        if (!keyword) {
            alert("검색키워드가 없습니다.");
            return;
        }

        newVinRefetch();
        setCurrentPage(1);
    }

    const reloadClick = () => {
        setKeyword(null);
        newVinRefetch();
        setCurrentPage(1);
    }

    const determineRowActions = (rowData) => {
        return rowData.iscode;
    }

    useEffect(() => {
        newVinRefetch();
    }, [reloadTrigger])

    // fetch EPC 및 소모품 결과
    const {
        data: sampleVin17List,
        error: sampleVin17Error,
        isLoading: sampleVin17IsLoading,
    } = useQuery({
        queryKey: ['epcList', selectedVin],
        queryFn: () => fetchSampleVin17List(userInfo.userId, {
            vin11: selectedVin
        }),
        enabled: !!userInfo.userId && !!selectedVin,
    });

    useEffect(() => {
        if (!sampleVin17IsLoading && sampleVin17List) {
            if (!sampleVin17List.jsonData) {
                return;
            }

            setSampleVinNumber(sampleVin17List.jsonData);
        }

        if (sampleVin17Error) {
            alert('데이터를 불러오는 중 오류가 발생했습니다: ' + sampleVin17Error.message);
        }
    }, [sampleVin17IsLoading, sampleVin17List, sampleVin17Error]);

    const onRowSelect = (item) => {
        setSelectedVin(item.vin11);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">신규 차대번호</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1020px]">
                <DialogHeader>
                    <DialogTitle>신규 차대번호 (미작업건)</DialogTitle>
                    <DialogDescription>
                        <div className="flex flex-row space-x-2 pt-4">
                            <Input type="text" id="vin17_0" placeholder={sampleVin17IsLoading ? "Loading..." : "차대번호 샘플 1"} readOnly={true} value={sampleVinNumber?.length > 0 ? sampleVinNumber[0]?.vinno : ""} />
                            <Input type="text" id="vin17_1" placeholder={sampleVin17IsLoading ? "Loading..." : "차대번호 샘플 2"} readOnly={true} value={sampleVinNumber?.length > 1 ? sampleVinNumber[1]?.vinno : ""} />
                            <Input type="text" id="vin17_2" placeholder={sampleVin17IsLoading ? "Loading..." : "차대번호 샘플 3"} readOnly={true} value={sampleVinNumber?.length > 2 ? sampleVinNumber[2]?.vinno : ""} />
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between">
                        <div className="flex w-[200px]">
                            <Select
                                value={selectedMaker || "KN"}
                                onValueChange={(value) => {
                                    setSelectedMaker(value);
                                }}
                            >
                                <SelectTrigger id="maker">
                                    <SelectValue placeholder="제작사 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        makerList.map((item, idx) => {
                                            return <SelectItem key={idx} value={item.vin2}>{`${item.vin2} (${item.cnt})`}</SelectItem>
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-row">
                            <Input
                                type="text"
                                id="vin"
                                className="w-[300px] rounded-r-none border-r-0"
                                placeholder="차대번호 11자리 혹은 차량명"
                                maxLength={11}
                                value={keyword || ""}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            <Button
                                className="rounded-none"
                                onClick={searchClick}
                            >
                                검색
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-l-none"
                                onClick={reloadClick}
                            >
                                새로고침
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md border w-full mt-2">
                        <DataTable
                            height="h-[612px]"
                            columns={getNewVinListColumns}
                            isLoading={newVinIsLoading}
                            data={newVinList}
                            getRowActions={determineRowActions}
                            onAction={handleAction}
                            onRowSelect={onRowSelect}
                        />
                    </div>

                    <Pagenation
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalCount={totalCount}
                        maxListCount={maxListCount}
                    />
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default CreateNewVinList