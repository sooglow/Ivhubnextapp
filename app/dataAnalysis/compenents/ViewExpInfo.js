import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from 'react'

function ViewExpInfo({ expList, selectedSeqno, selectedEpcCode, deleteExpCode, selectedVin, selectedIvCode }) {
    console.log(selectedIvCode);
    return (
        <div className="col-span-2 grid grid-cols-6 gap-4 border p-5 rounded-xl text-sm">
            <div className="col-span-6 text-right">
                <Button variant="outline" onClick={deleteExpCode} disabled={!selectedEpcCode || !selectedSeqno || !selectedVin || !selectedIvCode}><i className="fa-regular fa-trash pr-2" />삭제</Button>
            </div>
            <div className="col-span-2 w-full gap-1.5 self-start">
                <Label htmlFor="tireSize">타이어 규격</Label>
                <Input type="text" id="tireSize" placeholder="-" readOnly={true} className="w-full"
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.tire_size || ""} />
            </div>
            <div className="col-span-2 w-full gap-1.5 self-start">
                <Label htmlFor="battery">배터리</Label>
                <Input type="text" id="battery" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.battery || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="wiper">와이퍼</Label>
                <Input type="text" id="wiper" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.wiper || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="airconGas1">에어컨가스R134a</Label>
                <Input type="text" id="airconGas1" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.aircon_gas1 || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="airconGas2">에어컨가스R1234yf</Label>
                <Input type="text" id="airconGas2" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.aircon_gas2 || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="fuelTank">연료탱크</Label>
                <Input type="text" id="fuelTank" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.fuel_tank || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="engineOil">엔진오일</Label>
                <Input type="text" id="engineOil" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.engine_oil || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="missionOil">미션오일</Label>
                <Input type="text" id="missionOil" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.mission_oil || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="breakOil">브레이크오일</Label>
                <Input type="text" id="breakOil" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.break_oil || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="steeringOil">파워스티어링오일</Label>
                <Input type="text" id="steeringOil" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.steering_oil || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="coolingWater">냉각수</Label>
                <Input type="text" id="coolingWater" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.cooling_water || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="invCoolingWater">인버터냉각수</Label>
                <Input type="text" id="invCoolingWater" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.inv_cooling_water || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="frontDiff">프런트디퍼런셜</Label>
                <Input type="text" id="frontDiff" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.front_diff || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="rearDiff">리어디퍼런셜</Label>
                <Input type="text" id="rearDiff" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.rear_diff || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="transOil">트랜스퍼케이스오일</Label>
                <Input type="text" id="transOil" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.trans_oil || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="dieselWater">요소수</Label>
                <Input type="text" id="dieselWater" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.diesel_water || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="refrigerantOil">냉매(냉동)오일량</Label>
                <Input type="text" id="refrigerantOil" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.refrigerant_oil || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="refrigerantOilKind">냉매(냉동)오일종류</Label>
                <Input type="text" id="refrigerantOilKind" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.refrigerant_oil_kind || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="engineOilGrade">엔진오일등급</Label>
                <Input type="text" id="engineOilGrade" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.engine_oil_grade || ""} />
            </div>
            <div className="w-full gap-1.5 self-start">
                <Label htmlFor="engineOilViscosity">엔진오일점도</Label>
                <Input type="text" id="engineOilViscosity" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.engine_oil_viscosity || ""} />
            </div>
            <div className="col-span-2 w-full gap-1.5 self-start">
                <Label htmlFor="lubeGrade">모터 및 감속기 윤활유 등급</Label>
                <Input type="text" id="lubeGrade" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.lube_grade || ""} />
            </div>
            <div className="col-span-2 w-full gap-1.5 self-start">
                <Label htmlFor="lubricant">모터 및 감속기 윤활유</Label>
                <Input type="text" id="lubricant" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.lubricant || ""} />
            </div>
            <div className="col-span-2 w-full gap-1.5 self-start">
                <Label htmlFor="motorCoolingWater">모터 냉각수</Label>
                <Input type="text" id="motorCoolingWater" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.motor_cooling_water || ""} />
            </div>
            <div className="col-span-2 w-full gap-1.5 self-start">
                <Label htmlFor="battCoolingWater">배터리 냉각수</Label>
                <Input type="text" id="battCoolingWater" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.batt_cooling_water || ""} />
            </div>
            <div className="col-span-2 w-full gap-1.5 self-start">
                <Label htmlFor="tirePressurePsi">타이어공기압(psi)</Label>
                <Input type="text" id="tirePressurePsi" placeholder="-" readOnly={true}
                    value={expList[expList.findIndex((item) => item.seqno === selectedSeqno && item.epc_code === selectedEpcCode)]?.tire_pressure_psi || ""} />
            </div>
        </div>
    )
}

export default ViewExpInfo