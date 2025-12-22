import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { cn } from "@/lib/utils"
import React, { useEffect, useState } from 'react'
import { fetchCarcode } from '../apis/CodeApis';
import { useQuery } from '@tanstack/react-query';

function CodeAddVin1to4({ addCarItem, setAddCarItem, userInfo, dispatch, addVin1to4Click }) {
    const [autoCompleteOpen, setAutoCompleteOpen] = useState(false)
    const [carCode, setCarCode] = useState([]);

    // 자동완성 데이터
    const {
        data: carCodeData,
        error: carCodeError,
        isLoading: carCodeIsLoading
    } = useQuery({
        queryKey: ['autoCompleteData'],
        queryFn: () => fetchCarcode(userInfo.userId),
        enabled: !!userInfo?.userId,
    });

    useEffect(() => {
        if (!carCodeIsLoading && carCodeData) {
            setCarCode(carCodeData?.jsonData);
            dispatch({ type: "SET_LOADING", payload: false });
        }

        if (carCodeError) {
            alert('데이터를 불러오는 중 오류가 발생했습니다: ' + carCodeError.message);
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }, [carCodeData, carCodeError, carCodeIsLoading, dispatch]);

    return (
        <div className="w-full flex flex-row gap-3">
            <div className="flex-col">
                <Label htmlFor="vin">차대번호 앞 4자리</Label>
                <InputOTP id="vin4" maxLength={4}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    value={addCarItem?.code}
                    onChange={(value) => {
                        setAddCarItem(prev => ({ ...prev, code: value }));
                    }}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                    </InputOTPGroup>
                </InputOTP>
            </div>
            <div className="flex-col flex-1">
                <Label htmlFor="vin">신규 차종 추가</Label>
                <Popover open={autoCompleteOpen} onOpenChange={setAutoCompleteOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={autoCompleteOpen}
                            className="w-full justify-between"
                        >
                            {addCarItem?.code_text
                                ? carCode.find((item) => item.code_text === addCarItem?.code_text)?.code_text
                                : "추가 차종 선택..."}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="추가 차종 선택..." className="h-9" />
                            <CommandEmpty>차종이 없습니다.</CommandEmpty>
                            <CommandList>
                                {carCode.map((item, idx) => (
                                    <CommandItem
                                        key={idx}
                                        value={item.code_text || ""}
                                        onSelect={(currentValue) => {
                                            setAddCarItem((prev) =>
                                                currentValue === addCarItem.code_text
                                                    ? { ...prev, code_text: "", iv_carcode: "" }
                                                    : { ...prev, ...item }
                                            );
                                            setAutoCompleteOpen(false)
                                        }}
                                    >
                                        {item.code_text}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                addCarItem.code_text === item.code_text ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-row pt-[24px]">
                <Button onClick={addVin1to4Click}>추가</Button>
            </div>
        </div>
    )
}

export default CodeAddVin1to4