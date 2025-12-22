import React from 'react'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function CreateAddVinCode({
    addCode,
    setAddCode,
    addCodeHandler,
    kind
}) {
    return (
        <div className="h-[70px] flex justify-items-center items-center">
            <div className="grid grid-cols-8">
                <div className="flex-col flex-1">
                    <Label htmlFor="vin" className="text-xs">코드 추가</Label>
                    <Input
                        type="text"
                        id={`inputAddCode${kind}`}
                        className="rounded-r-none border-r-0"
                        placeholder="코드"
                        maxLength={1}
                        value={addCode?.[`vin${kind}`] || ""}
                        onChange={(e) => setAddCode(prev => ({ ...prev, [`vin${kind}`]: e.target.value }))}
                    />
                </div>
                <div className="flex-col col-span-6">
                    <Label htmlFor="vin" className="text-xs">코드명 추가</Label>
                    <Input
                        type="text"
                        id={`inputAddCode${kind}Text`}
                        className="rounded-r-none rounded-l-none border-r-0"
                        placeholder="코드명"
                        maxLength={30}
                        value={addCode?.[`vin${kind}_text`] || ""}
                        onChange={(e) => setAddCode(prev => ({ ...prev, [`vin${kind}_text`]: e.target.value }))}
                    />
                </div>
                <div className="flex flex-row pt-[24px]">
                    <Button
                        className="rounded-l-none w-full"
                        variant="outline"
                        onClick={() => addCodeHandler(kind)}>추가</Button>
                </div>
            </div>
        </div>
    )
}

export default CreateAddVinCode