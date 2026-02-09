//app/login/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { useInput } from "@/public/hooks/useInput";
import { useAlert } from "@/public/hooks/useAlert";
import { ApiResponse } from "@/app/login/types/types";

export default function LoginPage() {
  const router = useRouter();
  const [isSmsVerification, setIsSmsVerification] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // input 관련 커스텀 훅 설정
  const userIdInput = useInput("", (value: string) => value.length <= 10);
  const passWordInput = useInput("", (value: string) => value.length <= 24);
  const smsCodeInput = useInput("", (value: string) => value.length <= 4);

  // input 관련 ref
  const userIdRef = useRef<HTMLInputElement>(null);
  const passWordRef = useRef<HTMLInputElement>(null);
  const smsCodeRef = useRef<HTMLInputElement>(null);

  const validateAll = useAlert([
    {
      test: () => userIdInput.value.length > 0,
      message: "아이디를 입력해 주세요.",
      ref: userIdRef,
    },
    {
      test: () => passWordInput.value.length > 0,
      message: "비밀번호를 입력해 주세요.",
      ref: passWordRef,
    },
  ]);

  const validateSmsCode = useAlert([
    {
      test: () => smsCodeInput.value.length === 4,
      message: "수신된 인증번호 4자리를 입력해 주세요.",
      ref: smsCodeRef,
    },
  ]);

  // 로그인 후 토큰 저장 및 리다이렉트 처리
  const handleTokenAndRedirect = (token: string, refreshToken: string) => {
    localStorage.setItem(
      "atKey",
      JSON.stringify({
        token,
        refreshToken,
      })
    );
    router.push("/");
  };

  const handleLogin = async (): Promise<void> => {
    const isValid = validateAll();
    if (!isValid) return;

    try {
      setIsLoading(true);

      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/Login`,
        {
          userId: userIdInput.value,
          password: passWordInput.value,
        }
      );

      const { data } = response;

      if (!data.result) {
        alert(data.errMsg);
        passWordInput.setValue("");
        return;
      }

      if (data.data?.requiresSmsVerification) {
        setIsSmsVerification(true);
        alert("인증번호가 발송되었습니다.");
        return;
      }

      if (data.data?.token && data.data?.refreshToken) {
        handleTokenAndRedirect(data.data.token, data.data.refreshToken);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.errMsg || "네트워크 오류가 발생했습니다.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSmsVerification = async (): Promise<void> => {
    const isValid = validateSmsCode();
    if (!isValid) return;

    try {
      setIsLoading(true);

      const response: AxiosResponse<ApiResponse> = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/Login`,
        {
          params: {
            UserId: userIdInput.value,
            SmsCode: smsCodeInput.value,
          },
        }
      );

      const { data } = response;

      if (!data.result) {
        alert(data.errMsg);
        return;
      }

      if (data.data?.token && data.data?.refreshToken) {
        handleTokenAndRedirect(data.data.token, data.data.refreshToken);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.errMsg || "네트워크 오류가 발생했습니다.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>, handler: () => void): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handler();
    }
  };

  useEffect(() => {
    const checkExistingToken = () => {
      const saveToken = localStorage.getItem("atKey");
      if (saveToken) {
        try {
          const parseToken = JSON.parse(saveToken);
          if (parseToken.token) {
            router.push("/");
          }
        } catch (e) {
          localStorage.removeItem("atKey");
        }
      }
    };

    if (typeof window !== "undefined") {
      checkExistingToken();
    }
  }, [router]);

  return (
    <div className="flex-col min-h-screen">
      {/*데스크톱 로그인*/}
      <main className="flex-col h-screen hidden md:flex">
        <div className="w-full h-12 bg-[#282729] border-b"></div>
        <div className="flex items-center justify-center flex-grow">
          <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
            <div className="w-[134px] mx-auto mb-8">
              <img src="/images/logo_ivoh_m.png" alt="IV Office Hub" />
            </div>
            <div className="flex justify-center">
              {isSmsVerification ? (
                <ul className="space-y-2 w-[328px]">
                  <li>
                    <input
                      ref={smsCodeRef}  
                      placeholder="인증번호"
                      type="password"
                      className="bg-white w-full h-12 border border-[#E1E1E1] rounded-md py-2 pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                      autoFocus
                      value={smsCodeInput.value}
                      onChange={smsCodeInput.onChange}
                      onKeyDown={(e) => handleEnterKey(e, handleSmsVerification)}
                    />
                  </li>
                  <li className="pt-5">
                    <button
                      type="button"
                      onClick={handleSmsVerification}
                      disabled={isLoading}
                      className="w-full h-12 bg-[#A50A2E] hover:bg-[#CCCCCC] text-white py-2 border border-transparent rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      확인
                    </button>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-2 w-[328px]">
                  <li>
                    <input
                      ref={userIdRef}
                      placeholder="아이디 입력"
                      className="loginInput bg-white w-full h-12 border border-[#E1E1E1] rounded-md py-2 pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                      autoFocus
                      value={userIdInput.value}
                      onChange={userIdInput.onChange}
                      onKeyDown={(e) => handleEnterKey(e, handleLogin)}
                    />
                  </li>
                  <li className="pt-3">
                    <input
                      ref={passWordRef}
                      placeholder="비밀번호 입력"
                      type="password"
                      className="loginInput bg-white w-full h-12 border border-[#E1E1E1] rounded-md py-2 pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                      value={passWordInput.value}
                      onChange={passWordInput.onChange}
                      onKeyDown={(e) => handleEnterKey(e, handleLogin)}
                    />
                  </li>
                  <li className="pt-5">
                    <button
                      type="button"
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full h-12 bg-[#A50A2E] hover:bg-[#CCCCCC] text-white py-2 border border-transparent rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      로그인
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>

      {/*모바일 로그인*/}
      <main className="w-full h-screen flex-grow block md:hidden">
        <div className="w-full h-12 bg-[#282729]"></div>
        <div className="w-[134px] mx-auto pt-36">
          <img src="/images/logo_ivoh_m.png" alt="IV Office Hub" />
        </div>
        <div className="max-w-6xl h-screen mx-auto px-4">
          <div className="h-screen flex justify-center pt-8">
            {isSmsVerification ? (
              <ul className="space-y-2 w-[328px]">
                <li>
                  <input
                    ref={smsCodeRef}
                    placeholder="인증번호"
                    type="password"
                    className="bg-white w-full h-12 border border-[#E1E1E1] rounded-md py-2 pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                    autoFocus
                    value={smsCodeInput.value}
                    onChange={smsCodeInput.onChange}
                    onKeyDown={(e) => handleEnterKey(e, handleSmsVerification)}
                  />
                </li>
                <li className="pt-5">
                  <button
                    type="button"
                    onClick={handleSmsVerification}
                    disabled={isLoading}
                    className="w-full h-12 bg-[#A50A2E] hover:bg-[#CCCCCC] text-white py-2 border border-transparent rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    확인
                  </button>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 w-[328px]">
                <li>
                  <input
                    ref={userIdRef}
                    placeholder="아이디 입력"
                    className="loginInput bg-white w-full h-12 border border-[#E1E1E1] rounded-md py-2 pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                    autoFocus
                    value={userIdInput.value}
                    onChange={userIdInput.onChange}
                    onKeyDown={(e) => handleEnterKey(e, handleLogin)}
                  />
                </li>
                <li className="pt-3">
                  <input
                    ref={passWordRef}
                    placeholder="비밀번호 입력"
                    type="password"
                    className="loginInput bg-white w-full h-12 border border-[#E1E1E1] rounded-md py-2 pl-4 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                    value={passWordInput.value}
                    onChange={passWordInput.onChange}
                    onKeyDown={(e) => handleEnterKey(e, handleLogin)}
                  />
                </li>
                <li className="pt-5">
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full h-12 bg-[#A50A2E] hover:bg-[#CCCCCC] text-white py-2 border border-transparent rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    로그인
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
