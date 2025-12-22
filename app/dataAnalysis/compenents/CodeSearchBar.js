import React, { useState } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot, } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { Button } from "@/components/ui/button"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

function CodeSearchBar({ selectedSearchValue, setSelectedSearchValue, carFilter, initState }) {
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <div className="flex flex-row gap-3">
            <div className="grid gap-2 flex-1">
                <Label htmlFor="category">기등록 차종필터</Label>
                <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={searchOpen}
                            className="w-full justify-between"
                        >
                            {selectedSearchValue?.iv_carcode
                                ? carFilter.find((item) => item.iv_carcode === selectedSearchValue?.iv_carcode)?.code_text
                                : "미선택..."}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="미선택..." className="h-9" />
                            <CommandEmpty>차종이 없습니다.</CommandEmpty>
                            <CommandList>
                                {carFilter.map((item, idx) => (
                                    <CommandItem
                                        key={idx}
                                        value={item.code_text || ""}
                                        onSelect={(currentValue) => {
                                            setSelectedSearchValue((prev) =>
                                                currentValue === selectedSearchValue.code_text
                                                    ? { ...prev, iv_carcode: "", code_text: "" }
                                                    : { ...prev, iv_carcode: item.iv_carcode, code_text: item.code_text }
                                            );
                                            setSearchOpen(false)
                                        }}
                                    >
                                        {item.code_text}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                selectedSearchValue.code_text === item.code_text ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="vin4">차대번호 앞4자리</Label>
                <InputOTP id="vin4" maxLength={4}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    value={selectedSearchValue?.vin4}
                    onChange={(value) => {
                        setSelectedSearchValue(prev => ({ ...prev, vin4: value }));
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
            <div className="grid gap-2">
                <div className="flex flex-row pt-[22px]">
                    <Button className="rounded-r-none">조회</Button>
                    <Button
                        variant="outline"
                        className="rounded-l-none"
                        onClick={initState}>초기화</Button>
                </div>
            </div>
        </div>
    )
}

export default CodeSearchBar