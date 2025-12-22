import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from 'react'

function ViewEpcInfo({ optList, selectedSeqno, selectedEpcCode, deleteEpcCode, selectedVin, selectedIvCode }) {
    return (
        <div className="flex flex-col gap-4 border p-5 rounded-xl text-sm">
            <div className="flex justify-end">
                <Button variant="outline" onClick={deleteEpcCode} disabled={!selectedEpcCode || !selectedSeqno || !selectedVin || !selectedIvCode}><i className="fa-regular fa-trash pr-2" />삭제</Button>
            </div>
            <div className="flex flex-row space-x-4">
                <div className="w-full">
                    <Label htmlFor="opt1">옵션1</Label>
                    <Input type="text" id="opt1" placeholder="-" readOnly={true}
                        value={optList[optList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.opt1 || ""} />
                </div>
                <div className="w-full">
                    <Label htmlFor="opt2">옵션2</Label>
                    <Input type="text" id="opt2" placeholder="-" readOnly={true}
                        value={optList[optList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.opt2 || ""} />
                </div>
            </div>
            <div className="flex flex-row space-x-4">
                <div className="w-full">
                    <Label htmlFor="opt3">옵션3</Label>
                    <Input type="text" id="opt3" placeholder="-" readOnly={true}
                        value={optList[optList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.opt3 || ""} />
                </div>
                <div className="w-full">
                    <Label htmlFor="opt4">옵션4</Label>
                    <Input type="text" id="opt4" placeholder="-" readOnly={true}
                        value={optList[optList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.opt4 || ""} />
                </div>
            </div>
            <div className="flex flex-row space-x-4">
                <div className="w-full">
                    <Label htmlFor="opt5">옵션5</Label>
                    <Input type="text" id="opt5" placeholder="-" readOnly={true}
                        value={optList[optList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.opt5 || ""} />
                </div>
                <div className="w-full">
                    <Label htmlFor="opt6">EPC차량명</Label>
                    <Input type="text" id="opt6" placeholder="-" readOnly={true}
                        value={optList[optList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.opt6 || ""} />
                </div>
            </div>
            <div className="flex flex-row space-x-4">
                <div className="w-1/2">
                    <Label htmlFor="opt7">연식</Label>
                    <Input type="text" id="opt7" placeholder="-" readOnly={true}
                        value={optList[optList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.opt7 || ""} />
                </div>
            </div>

        </div>
    )
}

export default ViewEpcInfo