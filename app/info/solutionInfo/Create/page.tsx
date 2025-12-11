"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useInput } from "@/public/hooks/useInput";
import { useAlert } from "@/public/hooks/useAlert";
import { parseJWT } from "@/public/utils/utils";
import { JWTPayload } from "@/public/types/user";
import { useLoading } from "@/public/contexts/LoadingContext";
import axios from "axios";

const SOLUTION_OPTIONS = [
  { value: "전체", label: "전체" },
  { value: "CARSHOP", label: "비즈하이5" },
  { value: "NEO", label: "네오하이웨이" },
  { value: "PEO", label: "프리미엄네오" },
  { value: "ABS", label: "ABS" },
  { value: "AUTO", label: "오토4" },
  { value: "AUTO7", label: "오토7" },
  { value: "AUTO8", label: "오토X" },
  { value: "EST", label: "GES" },
];

const TIME_OPTIONS = ["01", "09", "13", "23"];

export default function SolutionInfoCreate() {
  const router = useRouter();
  const { state, dispatch } = useLoading();
  const queryClient = useQueryClient();

  const [userInfo, setUserInfo] = useState<JWTPayload>({} as JWTPayload);
  const [solution, setSolution] = useState<string>("전체");
  const [stime, setStime] = useState<string>("09");
  const [etime, setEtime] = useState<string>("23");
  const [files, setFiles] = useState<FileList | null>(null);
  const [xlsFile, setXlsFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState<number>(0);
  const [xlsFileKey, setXlsFileKey] = useState<number>(0);

  // 현재 날짜를 기본값으로 설정
  const getFormattedDate = (date: Date) => date.toISOString().split("T")[0];
  const currentDate = getFormattedDate(new Date());

  const titleInput = useInput("", (value: string) => value.length <= 100);
  const memoInput = useInput("", (value: string) => value.length <= 100);
  const sdayInput = useInput(currentDate, (value: string) => value.length <= 50);
  const edayInput = useInput(currentDate, (value: string) => value.length <= 50);

  const titleRef = useRef<HTMLInputElement>(null);

  const validateAll = useAlert([
    {
      test: () => titleInput.value.length >= 5,
      message: "제목은 5자 이상 입력해 주세요.",
      ref: titleRef,
    },
  ]);

  // 파일 변경 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
  };

  const handleXlsFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setXlsFile(selectedFile);
  };

  const handleSave = useCallback(async () => {
    if (!validateAll()) return;

    if (!window.confirm("저장하시겠습니까?")) return;

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const formData = new FormData();
      formData.append("Sday", `${sdayInput.value} ${stime}:00:00:000`);
      formData.append("Eday", `${edayInput.value} ${etime}:00:00:000`);
      formData.append("Subject", titleInput.value);
      formData.append("Solutions", solution);
      formData.append("Memo", memoInput.value);

      // 첨부파일 추가
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
      }

      // xls 파일 추가
      if (xlsFile) {
        formData.append("xlsFile", xlsFile);
      }

      const response = await axios.post("/api/solutionInfo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.result) {
        await queryClient.invalidateQueries({ queryKey: ["solutionInfoList"] });
        alert("저장되었습니다.");
        router.push("/info/solutionInfo/List");
      } else {
        alert(response.data.errMsg || "저장에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("Create Error:", error);
      alert(error.response?.data?.errMsg || "저장 중 오류가 발생했습니다.");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [
    validateAll,
    titleInput.value,
    memoInput.value,
    solution,
    sdayInput.value,
    edayInput.value,
    stime,
    etime,
    files,
    xlsFile,
    dispatch,
    router,
    queryClient,
  ]);

  const handleCancel = useCallback(() => {
    router.push("/info/solutionInfo/List");
  }, [router]);

  // ============================================
  // useEffect Hooks
  // ============================================

  // 사용자 정보 로드
  useEffect(() => {
    if (typeof window !== "undefined") {
      const tokenItem = localStorage.getItem("atKey");
      const token = tokenItem ? JSON.parse(tokenItem)?.token : null;
      const payload = parseJWT(token);
      if (payload) {
        setUserInfo(payload);
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="w-full flex-grow pt-4 md:pt-8">
        <div className="max-w-6xl mx-auto px-4 pb-10">
          <h2 className="font-semibold text-2xl mb-4 md:mb-8">솔루션 공지사항</h2>

          <div className="space-y-4">
            {/* 솔루션 구분 - 데스크톱 */}
            <div className="hidden md:flex flex-row items-center">
              <p className="w-[150px]">솔루션구분</p>
              <div className="flex-1 flex flex-wrap gap-4">
                {SOLUTION_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="solution"
                      value={option.value}
                      checked={solution === option.value}
                      onChange={(e) => setSolution(e.target.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 솔루션 구분 - 모바일 */}
            <div className="md:hidden">
              <p className="mb-2">솔루션구분</p>
              <select
                className="w-full border border-[#E1E1E1] px-4 rounded h-10 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
              >
                {SOLUTION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 게시기간 - 데스크톱 */}
            <div className="hidden md:flex flex-row items-center">
              <p className="w-[150px]">게시기간</p>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="date"
                  className="w-[200px] h-12 bg-white border border-[#E1E1E1] rounded-md px-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                  value={sdayInput.value}
                  onChange={sdayInput.onChange}
                />
                <select
                  className="border border-[#E1E1E1] h-12 px-4 rounded-md w-[90px] focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                  value={stime}
                  onChange={(e) => setStime(e.target.value)}
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <span>~</span>
                <input
                  type="date"
                  className="w-[200px] h-12 bg-white border border-[#E1E1E1] rounded-md px-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                  value={edayInput.value}
                  onChange={edayInput.onChange}
                />
                <select
                  className="border border-[#E1E1E1] h-12 px-4 rounded-md w-[90px] focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                  value={etime}
                  onChange={(e) => setEtime(e.target.value)}
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 게시기간 - 모바일 */}
            <div className="md:hidden space-y-2">
              <p>게시기간</p>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="flex-1 bg-white border border-[#E1E1E1] rounded-md py-[10px] px-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                  value={sdayInput.value}
                  onChange={sdayInput.onChange}
                />
                <select
                  className="w-[80px] border border-[#E1E1E1] px-4 rounded h-12 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                  value={stime}
                  onChange={(e) => setStime(e.target.value)}
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="flex-1 bg-white border border-[#E1E1E1] rounded-md py-[10px] px-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                  value={edayInput.value}
                  onChange={edayInput.onChange}
                />
                <select
                  className="w-[80px] border border-[#E1E1E1] px-4 rounded h-12 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                  value={etime}
                  onChange={(e) => setEtime(e.target.value)}
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 제목 */}
            <div className="flex flex-col md:flex-row md:items-center">
              <p className="md:w-[150px]">제목</p>
              <input
                ref={titleRef}
                placeholder="제목"
                className="flex-1 h-12 bg-white border border-[#E1E1E1] rounded-md px-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                value={titleInput.value}
                onChange={titleInput.onChange}
              />
            </div>

            {/* 첨부파일 - 데스크톱 */}
            <div className="hidden md:flex flex-row items-center">
              <p className="w-[150px]">첨부파일</p>
              <div className="flex-1">
                <input
                  key={fileKey}
                  id="files"
                  type="file"
                  accept="audio/*, video/*, image/*, application/pdf, application/msword, application/vnd.ms-excel, .docx, .hwp, .pptx, .zip, .alz, .txt"
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                />
                <div className="flex items-center space-x-2 flex-wrap">
                  <label
                    htmlFor="files"
                    className="inline-flex items-center w-[160px] px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors justify-center font-medium"
                  >
                    <i className="fa-regular fa-file mr-2"></i>
                    파일 선택
                  </label>
                  {files && files.length > 0 && (
                    <>
                      {Array.from(files).map((file, index) => (
                        <span key={index} className="text-sm text-gray-600">
                          {file.name}
                        </span>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setFiles(null);
                          setFileKey((prev) => prev + 1);
                        }}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        <i className="fa-regular fa-square-minus text-xl"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 첨부파일 - 모바일 */}
            <div className="md:hidden">
              <p className="mb-2">첨부파일</p>
              <input
                key={fileKey}
                id="files-mobile"
                type="file"
                accept="audio/*, video/*, image/*, application/pdf, application/msword, application/vnd.ms-excel, .docx, .hwp, .pptx, .zip, .alz, .txt"
                onChange={handleFileChange}
                multiple
                className="hidden"
              />
              <div className="flex items-center space-x-2 flex-wrap">
                <label
                  htmlFor="files-mobile"
                  className="inline-flex items-center w-[160px] px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors justify-center font-medium"
                >
                  <i className="fa-regular fa-file mr-2"></i>
                  파일 선택
                </label>
                {files && files.length > 0 && (
                  <>
                    {Array.from(files).map((file, index) => (
                      <span key={index} className="text-sm text-gray-600">
                        {file.name}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFiles(null);
                        setFileKey((prev) => prev + 1);
                      }}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      <i className="fa-regular fa-square-minus text-xl"></i>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 선별공지구분 */}
            <div className="flex flex-col md:flex-row md:items-center">
              <p className="md:w-[150px]">선별공지구분</p>
              <input
                placeholder="선별공지구분"
                className="flex-1 h-12 bg-white border border-[#E1E1E1] rounded-md px-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                value={memoInput.value}
                onChange={memoInput.onChange}
              />
            </div>

            {/* 선별공지대상 - 데스크톱 */}
            <div className="hidden md:flex flex-row items-center">
              <p className="w-[150px]">선별공지대상</p>
              <div className="flex-1">
                <input
                  key={xlsFileKey}
                  id="xlsFile"
                  type="file"
                  accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xls, .xlsx"
                  onChange={handleXlsFileChange}
                  className="hidden"
                />
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="xlsFile"
                    className="inline-flex items-center w-[160px] px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors justify-center font-medium"
                  >
                    <i className="fa-regular fa-file mr-2"></i>
                    파일 선택
                  </label>
                  {xlsFile && (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">{xlsFile.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setXlsFile(null);
                          setXlsFileKey((prev) => prev + 1);
                        }}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        <i className="fa-regular fa-square-minus text-xl"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 선별공지대상 - 모바일 */}
            <div className="md:hidden">
              <p className="mb-2">선별공지대상</p>
              <input
                key={xlsFileKey}
                id="xlsFile-mobile"
                type="file"
                accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xls, .xlsx"
                onChange={handleXlsFileChange}
                className="hidden"
              />
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="xlsFile-mobile"
                  className="inline-flex items-center w-[160px] px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors justify-center font-medium"
                >
                  <i className="fa-regular fa-file mr-2"></i>
                  파일 선택
                </label>
                {xlsFile && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">{xlsFile.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setXlsFile(null);
                        setXlsFileKey((prev) => prev + 1);
                      }}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      <i className="fa-regular fa-square-minus text-xl"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-center gap-2 pt-3">
              <button
                onClick={handleCancel}
                disabled={state.isLoading}
                className="w-[110px] px-4 py-2 text-white bg-[#A50A2E] rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={state.isLoading}
                className="w-[110px] px-4 py-2 text-white bg-[#77829B] rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.isLoading ? "저장중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
