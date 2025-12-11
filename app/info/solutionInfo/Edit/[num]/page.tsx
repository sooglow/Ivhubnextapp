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

interface Props {
  params: Promise<{ num: string }>;
}

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

export default function SolutionInfoEdit({ params }: Props) {
  const router = useRouter();
  const { state, dispatch } = useLoading();
  const queryClient = useQueryClient();

  const [userInfo, setUserInfo] = useState<JWTPayload>({} as JWTPayload);
  const [num, setNum] = useState<string>("");
  const [solution, setSolution] = useState<string>("");
  const [stime, setStime] = useState<string>("09");
  const [etime, setEtime] = useState<string>("23");

  const titleInput = useInput("", (value: string) => value.length <= 50);
  const memoInput = useInput("", (value: string) => value.length <= 100);
  const sdayInput = useInput("", (value: string) => value.length <= 50);
  const edayInput = useInput("", (value: string) => value.length <= 50);

  const titleRef = useRef<HTMLInputElement>(null);

  const validateAll = useAlert([
    {
      test: () => titleInput.value.length >= 5,
      message: "제목은 5자 이상 입력해 주세요.",
      ref: titleRef,
    },
  ]);

  const handleSave = useCallback(async () => {
    if (!validateAll()) return;

    if (!window.confirm("저장하시겠습니까?")) return;

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await axios.put(
        `/api/solutionInfo/${num}`,
        {
          num: parseInt(num),
          subject: titleInput.value,
          memo: memoInput.value,
          solution: solution,
          sday: `${sdayInput.value} ${stime}:00:00`,
          eday: `${edayInput.value} ${etime}:00:00`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.result) {
        await queryClient.invalidateQueries({ queryKey: ["solutionInfoList"] });
        alert("수정되었습니다.");
        router.push("/info/solutionInfo/List");
      } else {
        alert(response.data.errMsg || "수정에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("Update Error:", error);
      alert(error.response?.data?.errMsg || "수정 중 오류가 발생했습니다.");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [
    validateAll,
    num,
    titleInput.value,
    memoInput.value,
    solution,
    sdayInput.value,
    edayInput.value,
    stime,
    etime,
    dispatch,
    router,
  ]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm("삭제후에는 복원이 불가능합니다.\n삭제 하시겠습니까?")) return;

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await axios.delete(`/api/solutionInfo/${num}`);

      if (response.data.result) {
        await queryClient.invalidateQueries({ queryKey: ["solutionInfoList"] });
        alert("삭제되었습니다.");
        router.push("/info/solutionInfo/List");
      } else {
        alert(response.data.errMsg || "삭제에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("Delete Error:", error);
      alert(error.response?.data?.errMsg || "삭제 중 오류가 발생했습니다.");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [num, dispatch, router]);

  const handleCancel = useCallback(() => {
    router.push("/info/solutionInfo/List");
  }, [router]);

  const isAdmin = userInfo.deptCode === "03";

  // URL 파라미터에서 num 가져오기
  useEffect(() => {
    const getNum = async () => {
      const resolvedParams = await params;
      setNum(resolvedParams.num);
    };
    getNum();
  }, [params]);

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

  // 데이터 로드
  useEffect(() => {
    if (!num) return;

    const fetchData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await axios.get(`/api/solutionInfo/${num}`);

        if (!response.data.result || !response.data.data) {
          alert(response.data.errMsg || "데이터를 불러올 수 없습니다.");
          router.push("/info/solutionInfo/List");
          return;
        }

        const data = response.data.data;
        titleInput.setValue(data.subject || "");
        memoInput.setValue(data.memo || "");
        setSolution(data.solution || "전체");

        if (data.sday) {
          const [sdate, sTime] = data.sday.split(" ");
          sdayInput.setValue(sdate.split("T")[0]);
          if (sTime) {
            setStime(sTime.split(":")[0]);
          }
        }
        if (data.eday) {
          const [edate, eTime] = data.eday.split(" ");
          edayInput.setValue(edate.split("T")[0]);
          if (eTime) {
            setEtime(eTime.split(":")[0]);
          }
        }
      } catch (error: any) {
        console.error("데이터 로딩 오류:", error);
        alert(error.response?.data?.errMsg || "데이터를 불러오는 중 오류가 발생했습니다.");
        router.push("/info/solutionInfo/List");
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchData();
  }, [num, dispatch, router]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="w-full flex-grow pt-4 md:pt-8">
        <div className="max-w-6xl mx-auto px-4 pb-10">
          <h2 className="font-semibold text-2xl mb-4 md:mb-8">솔루션 공지사항</h2>

          <div className="space-y-4">
            {/* 솔루션 구분 - 데스크톱 */}
            <div className="hidden md:flex flex-row items-baseline">
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
            <div className="flex flex-col md:flex-row md:items-center ">
              <p className="md:w-[150px]">제목</p>
              <input
                ref={titleRef}
                placeholder="제목"
                className="flex-1 h-12 bg-white border border-[#E1E1E1] rounded-md px-4 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                value={titleInput.value}
                onChange={titleInput.onChange}
              />
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

            {/* 버튼 */}
            <div className="flex justify-center gap-2 pt-3">
              <button
                onClick={handleCancel}
                disabled={state.isLoading}
                className="w-[110px] px-4 py-2 text-white bg-[#A50A2E] rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              {isAdmin && (
                <button
                  onClick={handleDelete}
                  disabled={state.isLoading}
                  className="w-[110px] px-4 py-2 text-white bg-[#77829B] rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  삭제
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={state.isLoading}
                className="w-[110px] px-4 py-2 text-white bg-[#77829B] rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
