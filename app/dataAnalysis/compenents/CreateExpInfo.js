import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";

function CreateExpInfo({ expList, selectedSeqNo, setExpList, isExpInputState }) {
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        const itemIndex = expList.findIndex((expItems) => expItems.seqno === selectedSeqNo);
        if (itemIndex > -1) {
            setIdx(itemIndex);
        }
    }, [expList, selectedSeqNo]);

    return (
        <div className="grid grid-cols-8 gap-[10px]">
            <div className="flex-col col-span-2">
                <Label htmlFor="tireSize" className="text-xs">
                    타이어 규격
                </Label>
                <Input
                    type="text"
                    id="tireSize"
                    placeholder="-"
                    maxLength={50}
                    value={expList[idx]?.tire_size || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].tire_size = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col">
                <Label htmlFor="battery" className="text-xs">
                    배터리
                </Label>
                <Input
                    type="text"
                    id="battery"
                    placeholder="-"
                    maxLength={50}
                    value={expList[idx]?.battery || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].battery = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col">
                <Label htmlFor="airconGas1" className="text-xs">
                    에어컨가스R134a
                </Label>
                <Input
                    type="text"
                    id="airconGas1"
                    placeholder="-"
                    maxLength={50}
                    value={expList[idx]?.aircon_gas1 || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].aircon_gas1 = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col">
                <Label htmlFor="airconGas2" className="text-xs">
                    에어컨가스R1234yf
                </Label>
                <Input
                    type="text"
                    id="airconGas2"
                    placeholder="-"
                    maxLength={50}
                    value={expList[idx]?.aircon_gas2 || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].aircon_gas2 = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col">
                <Label htmlFor="wiper" className="text-xs">
                    와이퍼
                </Label>
                <Input
                    type="text"
                    id="wiper"
                    placeholder="-"
                    maxLength={25}
                    value={expList[idx]?.wiper || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].wiper = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col">
                <Label htmlFor="fuelTank" className="text-xs">
                    연료탱크
                </Label>
                <Input
                    type="text"
                    id="fuelTank"
                    placeholder="-"
                    maxLength={10}
                    value={expList[idx]?.fuel_tank || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].fuel_tank = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col">
                <Label htmlFor="engineOil" className="text-xs">
                    엔진오일
                </Label>
                <Input
                    type="text"
                    id="engineOil"
                    placeholder="-"
                    maxLength={10}
                    value={expList[idx]?.engine_oil || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].engine_oil = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col">
                <Label htmlFor="missionOil" className="text-xs">
                    미션오일
                </Label>
                <Input
                    type="text"
                    id="missionOil"
                    placeholder="-"
                    maxLength={20}
                    value={expList[idx]?.mission_oil || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].mission_oil = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col">
                <Label htmlFor="breakOil" className="text-xs">
                    브레이크오일
                </Label>
                <Input
                    type="text"
                    id="breakOil"
                    placeholder="-"
                    maxLength={25}
                    value={expList[idx]?.break_oil || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].break_oil = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col">
                <Label htmlFor="steeringOil" className="text-xs">
                    파워스티어링오일
                </Label>
                <Input
                    type="text"
                    id="vin"
                    placeholder="-"
                    maxLength={10}
                    value={expList[idx]?.steering_oil || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].steering_oil = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col">
                <Label htmlFor="coolingWater" className="text-xs">
                    냉각수
                </Label>
                <Input
                    type="text"
                    id="coolingWater"
                    placeholder="-"
                    maxLength={10}
                    value={expList[idx]?.cooling_water || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].cooling_water = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            {/* <div className="flex-col">
                <Label htmlFor="invCoolingWater">인버터냉각수</Label>
                <Input
                    type="text"
                    id="invCoolingWater"
                    placeholder="-"
                    maxLength={10}
                    value={expList[idx]?.inv_cooling_water || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList(prev => {
                            const newList = [...prev];
                            newList[idx].inv_cooling_water = newValue;
                            return newList
                        });
                    }}
                />
            </div> */}
            <div className="flex-col">
                <Label htmlFor="frontDiff" className="text-xs">
                    프런트디퍼런셜
                </Label>
                <Input
                    type="text"
                    id="frontDiff"
                    placeholder="-"
                    maxLength={10}
                    value={expList[idx]?.front_diff || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].front_diff = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col">
                <Label htmlFor="rearDiff" className="text-xs">
                    리어디퍼런셜
                </Label>
                <Input
                    type="text"
                    id="rearDiff"
                    placeholder="-"
                    maxLength={10}
                    value={expList[idx]?.rear_diff || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].rear_diff = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col">
                <Label htmlFor="transOil" className="text-xs">
                    트랜스퍼케이스오일
                </Label>
                <Input
                    type="text"
                    id="transOil"
                    placeholder="-"
                    maxLength={10}
                    value={expList[idx]?.trans_oil || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].trans_oil = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col">
                <Label htmlFor="dieselWater" className="text-xs">
                    요소수
                </Label>
                <Input
                    type="text"
                    id="dieselWater"
                    placeholder="-"
                    maxLength={10}
                    value={expList[idx]?.diesel_water || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].diesel_water = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col col-span-2">
                <Label htmlFor="refrigerantOil" className="text-xs">
                    냉매(냉동)오일량
                </Label>
                <Input
                    type="text"
                    id="refrigerantOil"
                    placeholder="-"
                    maxLength={50}
                    value={expList[idx]?.refrigerant_oil || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].refrigerant_oil = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col col-span-2">
                <Label htmlFor="refrigerantOilKind" className="text-xs">
                    냉매(냉동)오일종류
                </Label>
                <Input
                    type="text"
                    id="refrigerantOilKind"
                    placeholder="-"
                    maxLength={50}
                    value={expList[idx]?.refrigerant_oil_kind || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].refrigerant_oil_kind = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col">
                <Label htmlFor="engineOilGrade" className="text-xs">
                    엔진오일등급
                </Label>
                <Input
                    type="text"
                    id="engineOilGrade"
                    placeholder="-"
                    maxLength={50}
                    value={expList[idx]?.engine_oil_grade || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].engine_oil_grade = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col">
                <Label htmlFor="engineOilViscosity" className="text-xs">
                    엔진오일점도
                </Label>
                <Input
                    type="text"
                    id="engineOilViscosity"
                    placeholder="-"
                    maxLength={50}
                    value={expList[idx]?.engine_oil_viscosity || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].engine_oil_viscosity = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col col-span-2">
                <Label htmlFor="lubeGrade" className="text-xs">
                    모터 및 감속기 윤활유 등급
                </Label>
                <Input
                    type="text"
                    id="lubeGrade"
                    placeholder="-"
                    maxLength={50}
                    value={expList[idx]?.lube_grade || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].lube_grade = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col col-span-2">
                <Label htmlFor="lubricant" className="text-xs">
                    모터 및 감속기 윤활유
                </Label>
                <Input
                    type="text"
                    id="lubricant"
                    placeholder="-"
                    maxLength={50}
                    value={expList[idx]?.lubricant || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].lubricant = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col col-span-2">
                <Label htmlFor="motorCoolingWater" className="text-xs">
                    모터 냉각수
                </Label>
                <Input
                    type="text"
                    id="motorCoolingWater"
                    placeholder="-"
                    maxLength={50}
                    value={expList[idx]?.motor_cooling_water || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].motor_cooling_water = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col col-span-2">
                <Label htmlFor="battCoolingWater" className="text-xs">
                    배터리 냉각수
                </Label>
                <Input
                    type="text"
                    id="battCoolingWater"
                    placeholder="-"
                    maxLength={50}
                    value={expList[idx]?.batt_cooling_water || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].batt_cooling_water = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
            <div className="flex-col col-span-2">
                <Label htmlFor="tirePressurePsi" className="text-xs">
                    타이어공기압(psi)
                </Label>
                <Input
                    type="text"
                    id="tirePressurePsi"
                    placeholder="-"
                    maxLength={50}
                    value={expList[idx]?.tire_pressure_psi || ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setExpList((prev) => {
                            const newList = [...prev];
                            newList[idx].tire_pressure_psi = newValue;
                            return newList;
                        });
                    }}
                    disabled={!isExpInputState}
                />
            </div>
        </div>
    );
}

export default CreateExpInfo;
