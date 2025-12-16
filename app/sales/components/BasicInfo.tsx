import { SalesInfo } from "@/app/sales/types/View";

interface BasicInfoProps {
    salesInfo: SalesInfo | null;
    listClick: () => void;
    editBtnClick: () => void;
    deleteBtnClick: () => void;
}

export default function BasicInfo({
    salesInfo,
    listClick,
    editBtnClick,
    deleteBtnClick,
}: BasicInfoProps) {
    return (
        <>
            <div className="w-[92%] h-[58px] mx-auto mt-4 md:mt-8 flex justify-between rounded-tl-md rounded-tr-md border-[#E1E1E1] md:w-full md:h-[58px] md:mx-0 md:rounded-tl-md md:rounded-tr-md md:border-[#E1E1E1] border-0 border-x border-t">
                <p className="pl-4 md:pl-4 font-semibold text-[16px] text-[#A50A2E] my-auto">
                    업체정보
                </p>
                <div className="pr-4 my-auto hidden md:block">
                    <button
                        className="w-[122px] h-[40px] ml-2 text-white rounded-md bg-[#A50A2E] cursor-pointer"
                        onClick={listClick}
                    >
                        목록으로
                    </button>
                    <button
                        className="w-[122px] h-[40px] ml-2 text-white rounded-md bg-[#77829B] cursor-pointer"
                        onClick={deleteBtnClick}
                    >
                        삭제하기
                    </button>
                    <button
                        className="w-[122px] h-[40px] ml-2 text-white rounded-md bg-[#77829B] cursor-pointer"
                        onClick={editBtnClick}
                    >
                        저장하기
                    </button>
                </div>
            </div>
            {/* pc */}
            <div className="md:w-full md:h-[220px] md:rounded-bl-md md:rounded-br-md md:border-[#E1E1E1] md:border-[1px] hidden md:block">
                <div className="mx-auto">
                    <ul className="space-y-6 md:pl-8 md:mt-[30px] md:w-full md:text-sm">
                        <li className="w-full pt-3 flex justify-between items-baseline">
                            <div className="w-1/2">
                                <label className="font-semibold pr-10">문의처명</label>
                                {salesInfo?.comName ?? ""}
                            </div>
                        </li>
                        <li className="w-full pt-3 flex justify-between items-baseline">
                            <div className="w-1/4">
                                <label className="pr-10 font-semibold">문의자명</label>
                                {salesInfo?.comMan ?? ""}
                            </div>
                            <div className="w-1/2 pl-4">
                                <label className="font-semibold pr-10">연락처</label>
                                <label className="pr-2">{salesInfo?.comTel ?? ""}</label>
                                {salesInfo?.comTel ? (
                                    <a href={"tel:" + salesInfo?.comTel}>
                                        <i className="fa-solid fa-phone" />
                                    </a>
                                ) : (
                                    ""
                                )}
                                <label className="pl-2 pr-2">{salesInfo?.hp ?? ""}</label>
                                {salesInfo?.hp ? (
                                    <a href={"tel:" + salesInfo?.hp}>
                                        <i className="fa-solid fa-phone" />
                                    </a>
                                ) : (
                                    ""
                                )}
                            </div>
                        </li>
                        <li className="w-full pt-3 flex justify-between items-baseline">
                            <div className="w-1/4">
                                <label className="pr-[66px] font-semibold">지역</label>
                                {salesInfo?.area ?? ""}
                            </div>
                            <div className="w-1/2 pl-4">
                                <label className="pr-[52px] font-semibold">주소</label>
                                {salesInfo?.comAddr ?? ""}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            {/* 모바일 */}
            <div className="w-[92%] h-[full] mx-auto border rounded-b-md md:hidden">
                <ul className="w-[full] px-4 space-y-2">
                    <li className="pt-[19px] flex justify-between text-[14px]">
                        <div className="font-semibold">문의처명</div>
                        <div>{salesInfo?.comName ?? ""}</div>
                    </li>
                    <li className="pt-[19px] flex justify-between text-[14px]">
                        <div className="font-semibold">문의자명</div>
                        <div>{salesInfo?.comMan ?? ""}</div>
                    </li>
                    <li className="pt-[19px] flex justify-between text-[14px]">
                        <div className="font-semibold">연락처</div>
                        <div>
                            <label className="pr-2">{salesInfo?.comTel ?? ""}</label>
                            {salesInfo?.comTel ? (
                                <a href={"tel:" + salesInfo?.comTel}>
                                    <i className="fa-solid fa-phone" />
                                </a>
                            ) : (
                                ""
                            )}
                        </div>
                    </li>
                    <li className="pt-[6px] flex justify-between text-[14px]">
                        <div></div>
                        <div className="flex-row">
                            <label className="pr-1">{salesInfo?.hp ?? ""}</label>
                            {salesInfo?.hp ? (
                                <a href={"tel:" + salesInfo?.hp}>
                                    <i className="fa-solid fa-phone" />
                                </a>
                            ) : (
                                ""
                            )}
                        </div>
                    </li>
                    <li className="pt-[19px] flex justify-between text-[14px]">
                        <div className="font-semibold">지역</div>
                        <div>{salesInfo?.area ?? ""}</div>
                    </li>
                    <li className="pt-[19px] pb-4 flex justify-between text-[14px]">
                        <div className="font-semibold">주소</div>
                        <div>{salesInfo?.comAddr ?? ""}</div>
                    </li>
                </ul>
            </div>
        </>
    );
}
