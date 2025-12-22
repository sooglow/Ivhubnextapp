import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input";

function ViewSearchBar({
    searchOpen,
    setSearchOpen,
    selectedCarcode,
    setSelectedCarcode,
    carFilter,
    keyword,
    setKeyword,
    searchClick,
}) {
    return (
        <div className="flex gap-1">
            <div className="flex w-[200px]">
                <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={searchOpen}
                            className="w-full justify-between"
                        >
                            {selectedCarcode?.iv_carcode
                                ? carFilter.find((item) => item.iv_carcode === selectedCarcode?.iv_carcode)?.code_text
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
                                            setSelectedCarcode(
                                                currentValue === selectedCarcode.code_text
                                                    ? { iv_carcode: "", code_text: "" }
                                                    : { iv_carcode: item.iv_carcode, code_text: item.code_text }
                                            );
                                            setSearchOpen(false)
                                        }}
                                    >
                                        {item.code_text}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                selectedCarcode.code_text === item.code_text ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex">
                <Input
                    type="text"
                    className="rounded-r-none border-r-0 flex-[1]"
                    placeholder="차대번호 11자리"
                    maxLength={11}
                    value={keyword}
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
                    onClick={() => {
                        setSelectedCarcode({ iv_carcode: "", code_text: "" });
                        setKeyword("");
                    }}
                >
                    초기화
                </Button>
            </div>
        </div>
    )
}

export default ViewSearchBar