import { Label } from "@/components/ui/label";
import React from "react";

function CreateTypeCode({ vinValueTypeCode, carOtherGroup }) {
    return (
        <div className="grid grid-cols-4 gap-4">
            <Label className="whitespace-nowrap text-ellipsis overflow-hidden text-xs">
                <i className="fa-solid fa-circle-right pr-2" />
                {vinValueTypeCode?.vin14_text ? (
                    vinValueTypeCode?.vin14_text
                ) : (
                    <span>
                        차종구분 <i className="fa-sharp-duotone fa-solid fa-xmark text-red-500" />
                    </span>
                )}
            </Label>
            <Label className="whitespace-nowrap text-ellipsis overflow-hidden text-xs">
                <i className="fa-solid fa-circle-right pr-2" />
                {vinValueTypeCode?.vin5_text &&
                carOtherGroup.json5.some(
                    (item) =>
                        item.code === vinValueTypeCode?.vin5 &&
                        item.code_text === vinValueTypeCode?.vin5_text
                ) ? (
                    vinValueTypeCode?.vin5_text
                ) : (
                    <span>
                        세부 <i className="fa-sharp-duotone fa-solid fa-xmark text-red-500" />
                    </span>
                )}
            </Label>
            <Label className="whitespace-nowrap text-ellipsis overflow-hidden text-xs">
                <i className="fa-solid fa-circle-right pr-2" />
                {vinValueTypeCode?.vin6_text &&
                carOtherGroup.json6.some(
                    (item) =>
                        item.code === vinValueTypeCode?.vin6 &&
                        item.code_text === vinValueTypeCode?.vin6_text
                ) ? (
                    vinValueTypeCode?.vin6_text
                ) : (
                    <span>
                        차체 <i className="fa-sharp-duotone fa-solid fa-xmark text-red-500" />
                    </span>
                )}
            </Label>
            <Label className="whitespace-nowrap text-ellipsis overflow-hidden text-xs">
                <i className="fa-solid fa-circle-right pr-2" />
                {vinValueTypeCode?.vin7_text &&
                carOtherGroup.json7.some(
                    (item) =>
                        item.code === vinValueTypeCode?.vin7 &&
                        item.code_text === vinValueTypeCode?.vin7_text
                ) ? (
                    vinValueTypeCode?.vin7_text
                ) : (
                    <span>
                        장치 <i className="fa-sharp-duotone fa-solid fa-xmark text-red-500" />
                    </span>
                )}
            </Label>
            <Label className="whitespace-nowrap text-ellipsis overflow-hidden text-xs">
                <i className="fa-solid fa-circle-right pr-2" />
                {vinValueTypeCode?.vin8_text &&
                carOtherGroup.json8.some(
                    (item) =>
                        item.code === vinValueTypeCode?.vin8 &&
                        item.code_text === vinValueTypeCode?.vin8_text
                ) ? (
                    vinValueTypeCode?.vin8_text
                ) : (
                    <span>
                        엔진 <i className="fa-sharp-duotone fa-solid fa-xmark text-red-500" />
                    </span>
                )}
            </Label>
            <Label className="whitespace-nowrap text-ellipsis overflow-hidden text-xs">
                <i className="fa-solid fa-circle-right pr-2" />
                {vinValueTypeCode?.vin9_text &&
                carOtherGroup.json9.some(
                    (item) =>
                        item.code === vinValueTypeCode?.vin9 &&
                        item.code_text === vinValueTypeCode?.vin9_text
                ) ? (
                    vinValueTypeCode?.vin9_text
                ) : (
                    <span>
                        기타 <i className="fa-sharp-duotone fa-solid fa-xmark text-red-500" />
                    </span>
                )}
            </Label>
            <Label className="whitespace-nowrap text-ellipsis overflow-hidden text-xs">
                <i className="fa-solid fa-circle-right pr-2" />
                {vinValueTypeCode?.vin10_text &&
                carOtherGroup.json10.some(
                    (item) =>
                        item.code === vinValueTypeCode?.vin10 &&
                        item.code_text === vinValueTypeCode?.vin10_text
                ) ? (
                    vinValueTypeCode?.vin10_text
                ) : (
                    <span>
                        연도 <i className="fa-sharp-duotone fa-solid fa-xmark text-red-500" />
                    </span>
                )}
            </Label>
            <Label className="whitespace-nowrap text-ellipsis overflow-hidden text-xs">
                <i className="fa-solid fa-circle-right pr-2" />
                {vinValueTypeCode?.vin11_text &&
                carOtherGroup.json11.some(
                    (item) =>
                        item.code === vinValueTypeCode?.vin11 &&
                        item.code_text === vinValueTypeCode?.vin11_text
                ) ? (
                    vinValueTypeCode?.vin11_text
                ) : (
                    <span>
                        공장 <i className="fa-sharp-duotone fa-solid fa-xmark text-red-500" />
                    </span>
                )}
            </Label>
        </div>
    );
}

export default CreateTypeCode;
