import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React from 'react'

function CodeInputForm({ addCode, setAddCodeText, orderNo, addVin5to11Click }) {
    return (
        <div className="flex pt-1">
            <Input
                type="text"
                className="rounded-r-none border-r-0 flex-[1]"
                placeholder="코드"
                maxLength={1}
                value={addCode?.[`order${orderNo}`]?.code}
                onChange={(e) => setAddCodeText(prev => ({
                    ...prev,
                    [`order${orderNo}`]: { ...prev[`order${orderNo}`], code: e.target.value }
                }))}
            />
            <Input
                type="text"
                className="rounded-none flex-[4]"
                placeholder="코드명"
                maxLength={50}
                value={addCode?.[`order${orderNo}`]?.codeText}
                onChange={(e) => setAddCodeText(prev => ({
                    ...prev,
                    [`order${orderNo}`]: { ...prev[`order${orderNo}`], codeText: e.target.value }
                }))}
            />
            <Button
                className="rounded-l-none flex-[1]"
                onClick={(e) => addVin5to11Click(orderNo)}
            >
                추가
            </Button>
        </div>
    )
}

export default CodeInputForm