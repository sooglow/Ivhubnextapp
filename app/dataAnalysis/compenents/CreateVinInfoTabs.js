import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBasicCarModelNotContextColumns, getBasicVinCodeColumns } from 'components/comm/dataTable/columns';
import { DataTable } from 'components/comm/dataTable/DataTable';
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateAddVinCode from './CreateAddVinCode';

function CreateVinInfoTabs({
    carModel,
    carOtherGroup,
    vinValueTypeCode,
    selectedTabContents,
    setSelectedTabContents,
    onRowSelect,
    setAddCode,
    addCode,
    addCodeHandler
}) {
    return (
        <Tabs
            defaultValue="vin14"
            className="w-full"
            value={selectedTabContents || "vin14"}
            onValueChange={(value) => setSelectedTabContents((prev) => ({ ...prev, vinInfo: value }))}
        >
            <TabsList>
                <TabsTrigger value="vin14">1~4. 차종구분</TabsTrigger>
                <TabsTrigger value="vin5">5. 세부</TabsTrigger>
                <TabsTrigger value="vin6">6. 차체</TabsTrigger>
                <TabsTrigger value="vin7">7. 장치</TabsTrigger>
                <TabsTrigger value="vin8">8. 엔진</TabsTrigger>
                <TabsTrigger value="vin9">9. 기타</TabsTrigger>
                <TabsTrigger value="vin10">10. 연도</TabsTrigger>
                <TabsTrigger value="vin11">11. 공장</TabsTrigger>
            </TabsList>
            <TabsContent value="vin14">
                <ScrollArea className="h-[412px] w-full rounded-md border">
                    <DataTable
                        columns={getBasicCarModelNotContextColumns}
                        selectedKeyValue={{ code: vinValueTypeCode?.vin14, iv_carcode: vinValueTypeCode?.iv_carcode }}
                        data={carModel}
                        onRowSelect={onRowSelect?.onVin1to4Select}
                    />
                </ScrollArea>
            </TabsContent>
            <TabsContent value="vin5">
                <ScrollArea className="h-[325px] w-full rounded-md border">
                    <DataTable
                        columns={getBasicVinCodeColumns}
                        selectedKeyValue={{ code: vinValueTypeCode?.vin5 }}
                        data={carOtherGroup?.json5}
                        onRowSelect={onRowSelect?.onVin5Select}
                    />
                </ScrollArea>

                <hr className="my-2" />

                <CreateAddVinCode
                    addCode={addCode}
                    setAddCode={setAddCode}
                    addCodeHandler={addCodeHandler}
                    kind="5" />
            </TabsContent>
            <TabsContent value="vin6">
                <ScrollArea className="h-[325px] w-full rounded-md border">
                    <DataTable
                        columns={getBasicVinCodeColumns}
                        selectedKeyValue={{ code: vinValueTypeCode?.vin6 }}
                        data={carOtherGroup?.json6}
                        onRowSelect={onRowSelect?.onVin6Select}
                    />
                </ScrollArea>

                <hr className="my-2" />

                <CreateAddVinCode
                    addCode={addCode}
                    setAddCode={setAddCode}
                    addCodeHandler={addCodeHandler}
                    kind="6" />
            </TabsContent>
            <TabsContent value="vin7">
                <ScrollArea className="h-[325px] w-full rounded-md border">
                    <DataTable
                        columns={getBasicVinCodeColumns}
                        selectedKeyValue={{ code: vinValueTypeCode?.vin7 }}
                        data={carOtherGroup?.json7}
                        onRowSelect={onRowSelect?.onVin7Select}
                    />
                </ScrollArea>

                <hr className="my-2" />

                <CreateAddVinCode
                    addCode={addCode}
                    setAddCode={setAddCode}
                    addCodeHandler={addCodeHandler}
                    kind="7" />
            </TabsContent>
            <TabsContent value="vin8">
                <ScrollArea className="h-[325px] w-full rounded-md border">
                    <DataTable
                        columns={getBasicVinCodeColumns}
                        selectedKeyValue={{ code: vinValueTypeCode?.vin8 }}
                        data={carOtherGroup?.json8}
                        onRowSelect={onRowSelect?.onVin8Select}
                    />
                </ScrollArea>

                <hr className="my-2" />

                <CreateAddVinCode
                    addCode={addCode}
                    setAddCode={setAddCode}
                    addCodeHandler={addCodeHandler}
                    kind="8" />
            </TabsContent>
            <TabsContent value="vin9">
                <ScrollArea className="h-[325px] w-full rounded-md border">
                    <DataTable
                        columns={getBasicVinCodeColumns}
                        selectedKeyValue={{ code: vinValueTypeCode?.vin9 }}
                        data={carOtherGroup?.json9}
                        onRowSelect={onRowSelect?.onVin9Select}
                    />
                </ScrollArea>

                <hr className="my-2" />

                <CreateAddVinCode
                    addCode={addCode}
                    setAddCode={setAddCode}
                    addCodeHandler={addCodeHandler}
                    kind="9" />
            </TabsContent>
            <TabsContent value="vin10">
                <ScrollArea className="h-[325px] w-full rounded-md border">
                    <DataTable
                        columns={getBasicVinCodeColumns}
                        selectedKeyValue={{ code: vinValueTypeCode?.vin10 }}
                        data={carOtherGroup?.json10}
                        onRowSelect={onRowSelect?.onVin10Select}
                    />
                </ScrollArea>

                <hr className="my-2" />

                <CreateAddVinCode
                    addCode={addCode}
                    setAddCode={setAddCode}
                    addCodeHandler={addCodeHandler}
                    kind="10" />
            </TabsContent>
            <TabsContent value="vin11">
                <ScrollArea className="h-[325px] w-full rounded-md border">
                    <DataTable
                        columns={getBasicVinCodeColumns}
                        selectedKeyValue={{ code: vinValueTypeCode?.vin11 }}
                        data={carOtherGroup?.json11}
                        onRowSelect={onRowSelect?.onVin11Select}
                    />
                </ScrollArea>

                <hr className="my-2" />

                <CreateAddVinCode
                    addCode={addCode}
                    setAddCode={setAddCode}
                    addCodeHandler={addCodeHandler}
                    kind="11" />
            </TabsContent>
        </Tabs>
    )
}

export default CreateVinInfoTabs