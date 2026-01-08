import { getBasicEpcCodeColumns01, getBasicEpcCodeColumns02, getBasicEpcCodeColumns03, getBasicEpcCodeColumns04, getBasicEpcCodeColumns05, getBasicEpcCodeColumns06, getBasicEpcCodeColumns07 } from '@/components/comm/dataTable/columns'
import { DataTable } from '@/components/comm/dataTable/DataTable'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function CreateEpcInfoTabs({
    epcOptList,
    selectEpcOpt,
    selectedSeqNo,
    selectedTabContents,
    setSelectedTabContents,
    onRowSelect
}) {
    return (
        <Tabs
            defaultValue="opt1"
            className="w-full"
            value={selectedTabContents || "opt1"}
            onValueChange={(value) => setSelectedTabContents((prev) => ({ ...prev, epcInfo: value }))}
        >
            <TabsList>
                <TabsTrigger value="opt1">옵션1</TabsTrigger>
                <TabsTrigger value="opt2">옵션2</TabsTrigger>
                <TabsTrigger value="opt3">옵션3</TabsTrigger>
                <TabsTrigger value="opt4">옵션4</TabsTrigger>
                <TabsTrigger value="opt5">옵션5</TabsTrigger>
                <TabsTrigger value="opt6">EPC차량명</TabsTrigger>
                <TabsTrigger value="opt7">연식</TabsTrigger>
            </TabsList>
            <TabsContent value="opt1">
                <ScrollArea className="h-[190px] w-full rounded-md border">
                    <DataTable
                        columns={getBasicEpcCodeColumns01}
                        selectedKeyValue={{ opt1: selectEpcOpt?.find((item) => item.seqno === selectedSeqNo)?.opt1 }}
                        data={epcOptList?.jsonOpt1}
                        onRowSelect={onRowSelect}
                    />
                </ScrollArea>
            </TabsContent>
            <TabsContent value="opt2">
                <ScrollArea className="h-[190px] w-full rounded-md border">
                    <DataTable
                        columns={getBasicEpcCodeColumns02}
                        selectedKeyValue={{ opt2: selectEpcOpt?.find((item) => item.seqno === selectedSeqNo)?.opt2 }}
                        data={epcOptList?.jsonOpt2}
                        onRowSelect={onRowSelect}
                    />
                </ScrollArea>
            </TabsContent>
            <TabsContent value="opt3">
                <ScrollArea className="h-[190px] w-full rounded-md border">
                    <DataTable
                        columns={getBasicEpcCodeColumns03}
                        selectedKeyValue={{ opt3: selectEpcOpt?.find((item) => item.seqno === selectedSeqNo)?.opt3 }}
                        data={epcOptList?.jsonOpt3}
                        onRowSelect={onRowSelect}
                    />
                </ScrollArea>
            </TabsContent>
            <TabsContent value="opt4">
                <ScrollArea className="h-[190px] w-full rounded-md border">
                    <DataTable
                        columns={getBasicEpcCodeColumns04}
                        selectedKeyValue={{ opt4: selectEpcOpt?.find((item) => item.seqno === selectedSeqNo)?.opt4 }}
                        data={epcOptList?.jsonOpt4}
                        onRowSelect={onRowSelect}
                    />
                </ScrollArea>
            </TabsContent>
            <TabsContent value="opt5">
                <ScrollArea className="h-[190px] w-full rounded-md border">
                    <DataTable
                        columns={getBasicEpcCodeColumns05}
                        selectedKeyValue={{ opt5: selectEpcOpt?.find((item) => item.seqno === selectedSeqNo)?.opt5 }}
                        data={epcOptList?.jsonOpt5}
                        onRowSelect={onRowSelect}
                    />
                </ScrollArea>
            </TabsContent>
            <TabsContent value="opt6">
                <ScrollArea className="h-[190px] w-full rounded-md border">
                    <DataTable
                        columns={getBasicEpcCodeColumns06}
                        selectedKeyValue={{ opt6: selectEpcOpt?.find((item) => item.seqno === selectedSeqNo)?.opt6 }}
                        data={epcOptList?.jsonOpt6}
                        onRowSelect={onRowSelect}
                    />
                </ScrollArea>
            </TabsContent>
            <TabsContent value="opt7">
                <ScrollArea className="h-[190px] w-full rounded-md border">
                    <DataTable
                        columns={getBasicEpcCodeColumns07}
                        selectedKeyValue={{ opt7: selectEpcOpt?.find((item) => item.seqno === selectedSeqNo)?.opt7 }}
                        data={epcOptList?.jsonOpt7}
                        onRowSelect={onRowSelect}
                    />
                </ScrollArea>
            </TabsContent>
        </Tabs>
    )
}

export default CreateEpcInfoTabs