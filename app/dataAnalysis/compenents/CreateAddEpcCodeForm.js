import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React from 'react'

function CreateAddEpcCodeForm({ addOptText, addOptClick, setAddOptText, isEpcInputState }) {
    return (
        <div className="flex flex-row pb-6">
            <Input
                type="text"
                id="addEpc"
                className="flex-[1] rounded-r-none border-r-0"
                placeholder="존재하지 않는 옵션은 추가"
                maxLength={50}
                value={addOptText || ""}
                onChange={(e) => setAddOptText(e.target.value)}
                disabled={!isEpcInputState}
            />
            <Button className="rounded-l-none" onClick={addOptClick}>추가</Button>
        </div>
    )
}

export default CreateAddEpcCodeForm