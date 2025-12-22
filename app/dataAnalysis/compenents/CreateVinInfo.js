import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from 'react'

function CreateVinInfo({ data }) {
    return (
        <div className="flex flex-row justify-between gap-2">
            <div className="flex-col flex-4">
                <Label htmlFor="vin">차종구분</Label>
                <Input type="text" id="vin14" maxLength={4} disabled readOnly value={data?.vin1to4} />
            </div>
            <div className="flex-col flex-1">
                <Label htmlFor="vin">세부</Label>
                <Input type="text" id="vin5" maxLength={1} disabled readOnly value={data?.vin5} />
            </div>
            <div className="flex-col flex-1">
                <Label htmlFor="vin">차체</Label>
                <Input type="text" id="vin6" maxLength={1} disabled readOnly value={data?.vin6} />
            </div>
            <div className="flex-col flex-1">
                <Label htmlFor="vin">장치</Label>
                <Input type="text" id="vin7" maxLength={1} disabled readOnly value={data?.vin7} />
            </div>
            <div className="flex-col flex-1">
                <Label htmlFor="vin">엔진</Label>
                <Input type="text" id="vin8" maxLength={1} disabled readOnly value={data?.vin8} />
            </div>
            <div className="flex-col flex-1">
                <Label htmlFor="vin">기타</Label>
                <Input type="text" id="vin9" maxLength={1} disabled readOnly value={data?.vin9} />
            </div>
            <div className="flex-col flex-1">
                <Label htmlFor="vin">연도</Label>
                <Input type="text" id="vin10" maxLength={1} disabled readOnly value={data?.vin10} />
            </div>
            <div className="flex-col flex-1">
                <Label htmlFor="vin">공장</Label>
                <Input type="text" id="vin11" maxLength={1} disabled readOnly value={data?.vin11} />
            </div>
        </div>
    )
}

export default CreateVinInfo