import { SalesInfo } from "@/app/sales/types/View";
import { CodeItem } from "@/app/shop/types/Code";

interface ReserveInfoProps {
    salesInfo: SalesInfo | null;
    setSalesInfo: React.Dispatch<React.SetStateAction<SalesInfo | null>>;
    areaItems: CodeItem[];
    manItems: CodeItem[];
}

export default function ReserveInfo({
    salesInfo,
    setSalesInfo,
    areaItems,
    manItems,
}: ReserveInfoProps) {
    const truncate = (str: string, maxLength: number) => {
        return str.length > maxLength ? str.substring(0, maxLength) : str;
    };

    return (
        <>
            <div className="w-[92%] h-[58px] mx-auto mt-4 md:mt-4 flex justify-between rounded-tl-md rounded-tr-md border-[#E1E1E1] md:w-full md:h-[58px] md:mx-0 md:rounded-tl-md md:rounded-tr-md md:border-[#E1E1E1] border-0 border-x border-t">
                <p className="pl-4 md:pl-4 font-semibold text-[16px] text-[#A50A2E] my-auto">
                    접수사항
                </p>
            </div>
            {/* pc */}
            <div className="md:w-full md:h-[600px] md:rounded-bl-md md:rounded-br-md md:border-[#E1E1E1] md:border-[1px] hidden md:block">
                <div className="mx-auto">
                    <ul className="space-y-6 md:pl-8 md:mt-[30px] md:w-full md:text-sm">
                        <li className="w-full pt-3 flex justify-between items-baseline">
                            <div className="w-1/2">
                                <label className="font-semibold pr-[54px]">접수일</label>
                                {truncate(salesInfo?.callDay ?? "", 10)}
                            </div>
                            <div className="w-1/2 pl-4">
                                <label className="font-semibold pr-[54px]">접수자</label>
                                {salesInfo?.callMan ? salesInfo?.callMan : "-"}
                            </div>
                        </li>
                        <li className="w-full pt-3 flex justify-between items-baseline">
                            <div className="w-1/4">
                                <label className="pr-[26px] font-semibold">문의솔루션</label>
                                {salesInfo?.prgName ?? ""}
                            </div>
                            <div className="w-1/2 pl-4">
                                <label className="font-semibold pr-[40px]">영업담당</label>
                                <select
                                    value={salesInfo?.salesArea ?? ""}
                                    onChange={(e) => {
                                        if (salesInfo) {
                                            setSalesInfo({
                                                ...salesInfo,
                                                salesArea: e.target.value,
                                                salesMan: "",
                                            });
                                        }
                                    }}
                                    className="pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[130px] md:h-12"
                                >
                                    {areaItems.map((item) => (
                                        <option key={item.code} value={item.code}>
                                            {item.codename}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={salesInfo?.salesMan ?? ""}
                                    onChange={(e) => {
                                        if (salesInfo) {
                                            setSalesInfo({
                                                ...salesInfo,
                                                salesMan: e.target.value,
                                            });
                                        }
                                    }}
                                    className="ml-4 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[130px] md:h-12"
                                >
                                    <option value="">선택</option>
                                    {manItems.map((item) => (
                                        <option key={item.code} value={item.codename}>
                                            {item.codename}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </li>
                        <li className="w-full pt-3 flex justify-between items-baseline">
                            <div className="w-1/2">
                                <label className="font-semibold pr-[38px]">소개방법</label>
                                {salesInfo?.salesPath ? salesInfo?.salesPath : "-"}
                            </div>
                            <div className="w-1/2 pl-4">
                                <label className="font-semibold pr-[42px]">문의유형</label>
                                {salesInfo?.salesType ? salesInfo?.salesType : "-"}
                            </div>
                        </li>
                        <li className="w-full pt-3 flex justify-between items-baseline">
                            <div className="w-1/4">
                                <label className="font-semibold pr-[4px]">진행상태</label>
                                <select
                                    value={salesInfo?.salesState ?? 0}
                                    onChange={(e) => {
                                        if (salesInfo) {
                                            setSalesInfo({
                                                ...salesInfo,
                                                salesState: parseInt(e.target.value),
                                            });
                                        }
                                    }}
                                    className="ml-8 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[108px] md:h-12"
                                >
                                    <option value={0}>대기</option>
                                    <option value={1}>진행</option>
                                    <option value={2}>취소</option>
                                    <option value={3}>납예</option>
                                    <option value={4}>납품</option>
                                </select>
                            </div>
                        </li>
                        <li className="w-full pt-2 flex justify-between items-baseline">
                            <div className="w-1/4">
                                <label className="pr-10 font-semibold">접수내용</label>
                            </div>
                            <div className="w-1/2 pl-4">
                                <label className="font-semibold pr-10">처리내용</label>
                            </div>
                        </li>
                        <li className="w-full flex justify-between">
                            <div className="w-1/2 h-[120px] pl-2 rounded-md whitespace-pre-wrap">
                                {salesInfo?.salesDescr ? salesInfo?.salesDescr : "결과가 없습니다."}
                            </div>
                            <div className="w-1/2 pl-6 h-[120px] rounded-md whitespace-pre-wrap">
                                {salesInfo?.salesOutDescr
                                    ? salesInfo?.salesOutDescr
                                    : "결과가 없습니다."}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            {/* 모바일 */}
            <div className="w-[92%] h-[full] mx-auto border rounded-b-md md:hidden">
                <ul className="w-[full] px-4 space-y-2">
                    <li className="pt-[19px] flex justify-between text-[14px]">
                        <div className="font-semibold">접수일</div>
                        <div>{truncate(salesInfo?.callDay ?? "", 10)}</div>
                    </li>
                    <li className="pt-[19px] flex justify-between text-[14px]">
                        <div className="font-semibold">접수자</div>
                        <div>{salesInfo?.callMan ?? ""}</div>
                    </li>
                    <li className="pt-[19px] flex justify-between text-[14px]">
                        <div className="font-semibold">문의솔루션</div>
                        <div>{salesInfo?.prgName ? salesInfo?.prgName : "-"}</div>
                    </li>
                    <li className="pt-[19px] flex justify-between text-[14px]">
                        <div className="font-semibold">영업담당</div>
                        <div>
                            <select
                                value={salesInfo?.salesArea ?? ""}
                                onChange={(e) => {
                                    if (salesInfo) {
                                        setSalesInfo({
                                            ...salesInfo,
                                            salesArea: e.target.value,
                                            salesMan: "",
                                        });
                                    }
                                }}
                                className="pl-4 border w-[100px] h-[30px] border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[130px] md:h-12"
                            >
                                {areaItems.map((item) => (
                                    <option key={item.code} value={item.code}>
                                        {item.codename}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={salesInfo?.salesMan ?? ""}
                                onChange={(e) => {
                                    if (salesInfo) {
                                        setSalesInfo({
                                            ...salesInfo,
                                            salesMan: e.target.value,
                                        });
                                    }
                                }}
                                className="ml-2 w-[100px] h-[30px] pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[130px] md:h-12"
                            >
                                <option value="">선택</option>
                                {manItems.map((item) => (
                                    <option key={item.code} value={item.codename}>
                                        {item.codename}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </li>
                    <li className="pt-[19px] flex justify-between text-[14px]">
                        <div className="font-semibold">소개방법</div>
                        <div>{salesInfo?.salesPath ? salesInfo?.salesPath : "-"}</div>
                    </li>
                    <li className="pt-[19px] flex justify-between text-[14px]">
                        <div className="font-semibold">문의유형</div>
                        <div>{salesInfo?.salesType ? salesInfo?.salesType : "-"}</div>
                    </li>
                    <li className="pt-[19px] flex justify-between text-[14px]">
                        <div className="font-semibold">진행상태</div>
                        <div>
                            <select
                                value={salesInfo?.salesState ?? 0}
                                onChange={(e) => {
                                    if (salesInfo) {
                                        setSalesInfo({
                                            ...salesInfo,
                                            salesState: parseInt(e.target.value),
                                        });
                                    }
                                }}
                                className="ml-8 pl-4 w-[100px] h-[30px] border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:w-[108px] md:h-12"
                            >
                                <option value={0}>대기</option>
                                <option value={1}>진행</option>
                                <option value={2}>취소</option>
                                <option value={3}>납예</option>
                                <option value={4}>납품</option>
                            </select>
                        </div>
                    </li>
                    <li className="pt-4 flex justify-between text-[14px]">
                        <div className="font-semibold">접수내용</div>
                    </li>
                    <div className="text-[14px] whitespace-pre-wrap">
                        {salesInfo?.salesDescr ? salesInfo?.salesDescr : "결과가 없습니다."}
                    </div>
                    <li className="pt-4 flex justify-between text-[14px]">
                        <div className="font-semibold">처리내용</div>
                    </li>
                    <div className="text-[14px] pb-4 whitespace-pre-wrap">
                        {salesInfo?.salesOutDescr ? salesInfo?.salesOutDescr : "결과가 없습니다."}
                    </div>
                </ul>
            </div>
        </>
    );
}
