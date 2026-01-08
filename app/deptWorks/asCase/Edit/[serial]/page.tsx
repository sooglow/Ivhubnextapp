"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useInput } from "@/public/hooks/useInput";
import { useAlert } from "@/public/hooks/useAlert";
import { parseJWT } from "@/public/utils/utils";
import { UserInfo } from "@/app/deptWorks/asCase/types/Create";
import dynamic from "next/dynamic";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateAsCase, deleteAsCaseFile } from "@/app/api/asCase/asCase";
import { useAsCaseView } from "@/app/deptWorks/asCase/hooks/useAsCaseView";

const TextEditor = dynamic(() => import("@/public/components/TextEditor"), {
    ssr: false,
    loading: () => <div>에디터 로딩중...</div>,
});

interface Props {
    params: Promise<{ serial: string }>;
}

export default function AsCaseEdit({ params }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [serial, setSerial] = useState<string>("");
    const [prgCode, setPrgCode] = useState<string>("");
    const [asCode, setAsCode] = useState<string>("");
    const [prgItems, setPrgItems] = useState<any[]>([]);
    const [asItems, setAsItems] = useState<any[]>([]);
    const [question, setQuestion] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");
    const [file1, setFile1] = useState<File | null>(null);
    const [file1Key, setFile1Key] = useState<number>(0);
    const [existingFileName, setExistingFileName] = useState<string>("");

    const subjectInput = useInput("", (value: string) => value.length <= 50);
    const subjectRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        params.then((p) => setSerial(p.serial));
    }, [params]);

    // 상세 정보 조회
    const {
        data: queryData,
        isLoading: viewLoading,
        refetch: refetchView,
    } = useAsCaseView({
        serial,
        enabled: !!serial,
    });

    const post = (queryData as any)?.data || null;

    // 프로그램 코드 목록 조회
    const { data: prgData } = useQuery({
        queryKey: ["prgCode"],
        queryFn: async () => {
            const response = await fetch("/api/code?Kind=prgcode");
            return response.json();
        },
    });

    // AS 코드 목록 조회
    const { data: asData, refetch: refetchAsCode } = useQuery({
        queryKey: ["asCode", prgCode],
        queryFn: async () => {
            if (!prgCode) return null;
            const response = await fetch(`/api/code?Kind=ascode&SubCode=${prgCode}`);
            return response.json();
        },
        enabled: !!prgCode,
    });

    useEffect(() => {
        if (prgData?.result && prgData?.data?.items) {
            setPrgItems(prgData.data.items);
        }
    }, [prgData]);

    useEffect(() => {
        if (asData?.result && asData?.data?.items) {
            setAsItems(asData.data.items);
        }
    }, [asData]);

    useEffect(() => {
        if (prgCode) {
            refetchAsCode();
        }
    }, [prgCode, refetchAsCode]);

    // 데이터 로드시 설정
    useEffect(() => {
        if (post) {
            setPrgCode(post.prgCode);
            setAsCode(post.asCode);
            subjectInput.setValue(post.subject);
            setQuestion(post.question);
            setAnswer(post.answer);
            setExistingFileName(post.fileName1 || "");
        }
    }, [post]);

    const validateAll = useAlert([
        {
            test: () => subjectInput.value.length >= 5,
            message: "제목은 5자 이상 입력해 주세요.",
            ref: subjectRef,
        },
    ]);

    const updateMutation = useMutation({
        mutationFn: (formData: FormData) => updateAsCase(formData),
        onSuccess: (data) => {
            if (data.result) {
                alert("수정되었습니다.");
                queryClient.invalidateQueries({ queryKey: ["asCaseList"] });
                queryClient.invalidateQueries({ queryKey: ["asCaseView", serial] });
                router.push(`/deptWorks/asCase/View/${serial}`);
            } else {
                alert(data.errMsg || "수정에 실패했습니다.");
            }
        },
        onError: (error: any) => {
            console.error("Update Error:", error);
            alert("수정 중 오류가 발생했습니다.");
        },
    });

    const deleteFileMutation = useMutation({
        mutationFn: ({ serial, fileNumber }: { serial: string; fileNumber: number }) =>
            deleteAsCaseFile(serial, fileNumber),
        onSuccess: (data) => {
            if (data.result) {
                setExistingFileName("");
                refetchView();
            } else {
                alert(data.errMsg || "파일 삭제에 실패했습니다.");
            }
        },
        onError: (error: any) => {
            console.error("File Delete Error:", error);
            alert("파일 삭제 중 오류가 발생했습니다.");
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        setFile1(selectedFile);
    };

    const handleFileDelete = useCallback(() => {
        if (window.confirm("파일 삭제 후에는 복구가 불가능합니다.\n삭제하시겠습니까?")) {
            deleteFileMutation.mutate({ serial, fileNumber: 0 });
        }
    }, [serial, deleteFileMutation]);

    const handleSave = useCallback(() => {
        if (!validateAll()) return;

        if (!window.confirm("저장하시겠습니까?")) return;

        const formData = new FormData();
        formData.append("Serial", serial);
        formData.append("PrgCode", prgCode);
        formData.append("AsCode", asCode);
        formData.append("Writer", userInfo.userId);
        formData.append("Subject", subjectInput.value);
        formData.append("Question", question);
        formData.append("Answer", answer);
        if (file1) formData.append("uploadedFile1", file1);

        updateMutation.mutate(formData);
    }, [
        validateAll,
        serial,
        prgCode,
        asCode,
        userInfo.userId,
        subjectInput.value,
        question,
        answer,
        file1,
        updateMutation,
    ]);

    const handleCancel = useCallback(() => {
        router.push(`/deptWorks/asCase/View/${serial}`);
    }, [router, serial]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const tokenItem = localStorage.getItem("atKey");
            const token = tokenItem ? JSON.parse(tokenItem)?.token : null;
            const payload = parseJWT(token);
            if (payload) {
                setUserInfo(payload as any);
            }
        }
    }, []);

    if (viewLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <main className="w-full flex-grow">
                    <div className="max-w-6xl mx-auto px-4 pb-20">
                        <h2 className="md:pl-4 font-semibold text-2xl py-4 md:py-8">상담사례</h2>
                        <div className="text-center py-10">로딩 중...</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow md:p-4">
                <div className="max-w-6xl mx-auto pb-20">
                    <h2 className="pl-4 font-semibold text-2xl py-4 md:py-8">상담사례</h2>

                    <div className="md:mt-2 md:w-full md:h-full md:rounded-md md:border-[#E1E1E1] md:border-[1px]">
                        <ul className="space-y-4 pt-0 md:pt-3 md:p-2">
                            <li className="mx-4">
                                <div className="md:flex md:justify-between items-center md:pt-2">
                                    <div className="">
                                        <p className="md:pt-2 font-semibold">구분</p>
                                    </div>
                                    <div className="pt-2">
                                        <select
                                            value={prgCode}
                                            onChange={(e) => setPrgCode(e.target.value)}
                                            className="w-[55%] md:w-[200px] h-10 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:h-12"
                                        >
                                            {prgItems.map((item) => (
                                                <option key={item.code} value={item.code}>
                                                    {item.codename}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={asCode}
                                            onChange={(e) => setAsCode(e.target.value)}
                                            className="w-[55%] md:w-[200px] h-10 mt-2 md:mt-0 md:ml-6 pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none md:h-12"
                                        >
                                            {asItems.map((item) => (
                                                <option key={item.code} value={item.code}>
                                                    {item.codename}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col pt-4">
                                    <p className="pt-2 font-semibold">제목</p>
                                    <input
                                        ref={subjectRef}
                                        placeholder="제목"
                                        className="mt-2 w-full h-12 bg-white border rounded-md border-[#E1E1E1] py-[10px] pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                        value={subjectInput.value}
                                        onChange={subjectInput.onChange}
                                    />
                                </div>
                            </li>
                            <div className="mx-4 pb-8">
                                <p className="font-semibold pb-2">문의내용</p>
                                <div className="border rounded-md border-[#E1E1E1]">
                                    <textarea
                                        className="w-full h-[300px] px-4 overflow-scroll overflow-x-hidden pt-1 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </ul>
                    </div>
                    <div className="mx-4 md:mx-0 pt-4">
                        <p className="pl-0 md:pl-4 font-semibold">처리내용</p>
                        <div className="pt-2 md:pt-4">
                            <TextEditor data={answer} setData={setAnswer} />
                        </div>
                        <div className="pt-2 md:pt-4">
                            <input
                                key={file1Key}
                                id="file1"
                                type="file"
                                accept="audio/*, video/*, image/*, application/pdf, application/msword, application/vnd.ms-excel, .docx, .hwp, .pptx, .zip, .alz, .txt"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="flex items-center space-x-2 flex-wrap">
                                <label
                                    htmlFor="file1"
                                    className="inline-flex items-center w-[160px] px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors justify-center font-medium"
                                >
                                    <i className="fa-regular fa-file mr-2"></i>
                                    파일 선택
                                </label>
                                {file1 && (
                                    <>
                                        <span className="text-sm text-gray-600">{file1.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFile1(null);
                                                setFile1Key((prev) => prev + 1);
                                            }}
                                            className="text-gray-700 hover:text-gray-900"
                                        >
                                            <i className="fa-regular fa-square-minus text-xl"></i>
                                        </button>
                                    </>
                                )}
                                {existingFileName && !file1 && (
                                    <>
                                        <span className="text-sm text-gray-600">{existingFileName}</span>
                                        <button
                                            type="button"
                                            onClick={handleFileDelete}
                                            disabled={deleteFileMutation.isPending}
                                            className="text-gray-700 hover:text-gray-900"
                                        >
                                            <i className="fa-regular fa-square-minus text-xl"></i>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="pt-4"></div>
                    <div className="flex justify-center items-center pt-3 mx-4 md:mx-auto">
                        <div>
                            <button
                                onClick={handleCancel}
                                className="w-[150px] md:w-[150px] px-4 py-2 text-white bg-[#A50A2E] border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer"
                            >
                                취소
                            </button>
                        </div>
                        <div className="pl-2">
                            <button
                                onClick={handleSave}
                                disabled={updateMutation.isPending}
                                className="w-[150px] md:w-[150px] bg-[#77829B] text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 cursor-pointer"
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
