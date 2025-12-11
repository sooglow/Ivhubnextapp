"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "@/public/hooks/useAlert";
import { isValidExtension, parseJWT } from "@/public/utils/utils";
import { UserInfo } from "@/app/info/info/types/Create";
import { InfoEditRequest, EditFormState } from "@/app/info/info/types/Edit";
import { useUpdateInfo } from "@/app/info/info/hooks/useInfoEdit";
import { getInfoView } from "@/app/api/info/info";
import { useLoading } from "@/public/contexts/LoadingContext";

interface Props {
    params: Promise<{ serial: string }>;
}

export default function Edit({ params }: Props) {
    const router = useRouter();
    const { dispatch } = useLoading();

    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [serial, setSerial] = useState<string>("");
    const [formState, setFormState] = useState<EditFormState>({
        subject: "",
        content: "",
        auth: "",
        filename1: null,
        filename2: null,
        file1Key: 0,
        file2Key: 0,
    });

    const [existingFiles, setExistingFiles] = useState<{
        filename1?: string;
        filename2?: string;
    }>({});

    const subjectRef = useRef<HTMLInputElement>(null);
    const updateMutation = useUpdateInfo();

    const validateAll = useAlert([
        {
            test: () => formState.subject.length > 5,
            message: "제목은 5자 이상 입력해 주세요.",
            ref: subjectRef,
        },
        {
            test: () => formState.content.length > 10,
            message: "내용은 10자 이상 입력해 주세요",
        },
    ]);

    const handleFile1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;

        if (selectedFile && !isValidExtension(selectedFile)) {
            alert("첨부할 수 없는 확장자입니다.");
            setFormState((prev) => ({ ...prev, file1Key: prev.file1Key + 1 }));
            return;
        }

        setFormState((prev) => ({ ...prev, filename1: selectedFile }));
    };

    const handleFile2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;

        if (selectedFile && !isValidExtension(selectedFile)) {
            alert("첨부할 수 없는 확장자입니다.");
            setFormState((prev) => ({ ...prev, file2Key: prev.file2Key + 1 }));
            return;
        }

        setFormState((prev) => ({ ...prev, filename2: selectedFile }));
    };

    // 파일 삭제 요청
    const fileDeleteClick = (idx: number) => {
        if (window.confirm("파일 삭제 후에는 복구가 불가능합니다.\n삭제하시겠습니까?")) {
        }
    };

    const cancelClick = (): void => {
        router.push(`/info/info/View/${serial}`);
    };

    const editBtnClick = async (): Promise<void> => {
        if (!validateAll()) return;

        if (window.confirm("저장하시겠습니까?")) {
            try {
                const editData: InfoEditRequest = {
                    serial: serial,
                    subject: formState.subject,
                    writer: userInfo.userId,
                    content: formState.content,
                    ip: "127.0.0.1",
                    filename1: formState?.filename1,
                    filename2: formState?.filename2,
                    auth: formState.auth,
                };
                await updateMutation.mutateAsync(editData);

                alert("수정되었습니다.");
                router.push(`/info/info/View/${serial}`);
            } catch (error) {
                console.error("수정 오류:", error);
                alert("수정 중 오류가 발생했습니다.");
            }
        }
    };

    useEffect(() => {
        const getSerial = async () => {
            const resolvedParams = await params;
            setSerial(resolvedParams.serial);
        };
        getSerial();
    }, [params]);

    useEffect(() => {
        if (!serial) return;

        const fetchData = async () => {
            dispatch({ type: "SET_LOADING", payload: true });
            try {
                const response = await getInfoView(serial);

                if (!response.result || !response.data) {
                    alert(response.errMsg || "데이터를 불러올 수 없습니다.");
                    router.push("/info/info/List");
                    return;
                }

                const data = response.data;

                // 폼 초기화
                setFormState((prev) => ({
                    ...prev,
                    subject: data.subject || "",
                    content: data.content || "",
                    auth: data.auth || "",
                }));

                // 기존 파일 정보 저장
                setExistingFiles({
                    filename1: data.filename1,
                    filename2: data.filename2,
                });
            } catch (error) {
                console.error("데이터 로딩 오류:", error);
                alert("데이터를 불러오는 중 오류가 발생했습니다.");
                router.push("/info/info/List");
            } finally {
                dispatch({ type: "SET_LOADING", payload: false });
            }
        };

        fetchData();
    }, [serial, dispatch, router]);

    useEffect(() => {
        const tokenItem = localStorage.getItem("atKey");
        const token = tokenItem ? JSON.parse(tokenItem)?.token : null;
        const payload = parseJWT(token);
        if (payload) {
            setUserInfo(payload as UserInfo);
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow">
                <div className="max-w-6xl mx-auto px-4 pb-20">
                    <h2 className="pl-0 md:pl-4 font-semibold text-2xl py-4 md:py-8">공지사항</h2>
                    {/* 제목과 권한 */}
                    <div className="flex flex-row justify-between">
                        <input
                            ref={subjectRef}
                            placeholder="제목"
                            className="w-full bg-white border md:border-[#E1E1E1] rounded-l-sm py-[10px] pl-4 md:pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            value={formState.subject}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormState((prev) => ({ ...prev, subject: e.target.value }))
                            }
                        />
                        <select
                            className="pl-4 w-[140px] border-y border-r border-[#E1E1E1] rounded-r-sm appearance-none focus:outline-none md:h-12 md:bg-white select_shop"
                            value={formState.auth}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                setFormState((prev) => ({ ...prev, auth: e.target.value }))
                            }
                        >
                            <option value="">전체</option>
                            <option value="1">본사만</option>
                        </select>
                    </div>
                    {/* 내용 */}
                    <div className="pt-4">
                        <textarea
                            placeholder="내용을 입력하세요"
                            className="w-full h-64 border border-[#E1E1E1] p-4 resize-none focus:outline-none focus:border-sky-500"
                            value={formState.content}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                setFormState((prev) => ({ ...prev, content: e.target.value }))
                            }
                        />
                    </div>
                    {/* Edit 페이지의 파일 입력 부분을 이렇게 수정 */}
                    {/* 파일 업로드 1 */}
                    <div className="pt-0 md:pt-4">
                        <input
                            key={formState.file1Key}
                            id="file1"
                            type="file"
                            accept="audio/*, video/*, image/*, application/pdf, application/msword, application/vnd.ms-excel, .docx, .hwp, .pptx, .zip, .alz, .txt"
                            onChange={handleFile1Change}
                            className="hidden" // 기본 input 숨기기
                        />
                        <div className="flex items-center space-x-2">
                            <label
                                htmlFor="file1"
                                className="inline-flex items-center w-[160px] px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors justify-center font-medium"
                            >
                                <i className="fa-regular fa-file mr-2"></i>
                                파일 선택
                            </label>
                            {formState.filename1 && (
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-600 mr-2">
                                        {formState?.filename1.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormState((prev) => ({
                                                ...prev,
                                                filename1: null,
                                                file1Key: prev.file1Key + 1,
                                            }));
                                        }}
                                        className="text-gray-700 hover:text-gray-900"
                                    >
                                        <i className="fa-regular fa-square-minus text-xl"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                        {existingFiles.filename1 && !formState.filename1 && (
                            <div className="mt-2 text-sm text-gray-600 flex items-center">
                                <i className="fa-regular fa-file mr-2"></i>
                                <span>기존 파일: {existingFiles.filename1}</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        fileDeleteClick(0); // 원래 있던 함수 호출
                                    }}
                                    className="ml-2 text-gray-700 hover:text-gray-900"
                                >
                                    <i className="fa-regular fa-square-minus text-xl"></i>
                                </button>
                            </div>
                        )}
                    </div>
                    {/* 파일 업로드 2 */}
                    <div className="pt-4">
                        <input
                            key={formState.file2Key}
                            id="file2"
                            type="file"
                            accept="audio/*, video/*, image/*, application/pdf, application/msword, application/vnd.ms-excel, .docx, .hwp, .pptx, .zip, .alz, .txt"
                            onChange={handleFile2Change}
                            className="hidden" // 기본 input 숨기기
                        />
                        <div className="flex items-center space-x-2">
                            <label
                                htmlFor="file2"
                                className="inline-flex items-center w-[160px] px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors justify-center font-medium"
                            >
                                <i className="fa-regular fa-file mr-2"></i>
                                파일 선택
                            </label>
                            {formState.filename2 && (
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-600 mr-2">
                                        {formState.filename2.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormState((prev) => ({
                                                ...prev,
                                                filename2: null,
                                                file2Key: prev.file2Key + 1,
                                            }));
                                        }}
                                        className="text-gray-700 hover:text-gray-900"
                                    >
                                        <i className="fa-regular fa-square-minus text-xl"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                        {existingFiles.filename2 && !formState.filename2 && (
                            <div className="mt-2 text-sm text-gray-600 flex items-center">
                                <i className="fa-regular fa-file mr-2"></i>
                                <span>기존 파일: {existingFiles.filename2}</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        fileDeleteClick(1);
                                    }}
                                    className="ml-2 text-gray-700 hover:text-gray-900"
                                >
                                    <i className="fa-regular fa-square-minus text-xl"></i>
                                </button>
                            </div>
                        )}
                    </div>
                    {/* 버튼 */}
                    <div className="flex justify-center items-center pt-4 md:pt-3 mx-auto">
                        <div>
                            <button
                                onClick={cancelClick}
                                disabled={updateMutation.isPending}
                                className="w-[160px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                            >
                                취소
                            </button>
                        </div>
                        <div className="pl-2">
                            <button
                                onClick={editBtnClick}
                                disabled={updateMutation.isPending}
                                className="w-[160px] bg-[#77829B] text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                            >
                                {updateMutation.isPending ? "저장중..." : "저장"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
