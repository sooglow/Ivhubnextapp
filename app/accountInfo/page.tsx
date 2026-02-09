"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useInput } from "@/public/hooks/useInput";
import { useAlert } from "@/public/hooks/useAlert";
import { useUserData } from "@/public/hooks/useUserData";
import axiosInstance from "@/public/lib/axiosInstance";

interface AdminLoginItem {
    code: string;
    codeName: string;
}

interface AccountData {
    hp0: string;
    hp1: string;
    hp2: string;
}

export default function AccountInfo() {
    const router = useRouter();
    const userInfo = useUserData();

    const [areaMan, setAreaMan] = useState<string>("");
    const [list, setList] = useState<AdminLoginItem[]>([]);
    const [password, setPassword] = useState<string>("");
    const [showKoreanWarning, setShowKoreanWarning] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // 수정사항 길이제한 설정
    const hp0Len = (value: string) => value.length <= 3;
    const maxTelLen = (value: string) => value.length <= 4;

    // input 관련 커스텀 훅 설정
    const hp0Input = useInput("", hp0Len);
    const hp1Input = useInput("", maxTelLen);
    const hp2Input = useInput("", maxTelLen);

    // input 관련 ref
    const passwordRef = useRef<HTMLInputElement>(null);
    const hp0Ref = useRef<HTMLInputElement>(null);
    const hp1Ref = useRef<HTMLInputElement>(null);
    const hp2Ref = useRef<HTMLInputElement>(null);

    const validateAll = useAlert([
        {
            test: () =>
                password.length === 0 ||
                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,20}$/.test(
                    password
                ),
            message: "비밀번호는 영문과 숫자를 포함하여 8~20자 사이여야 합니다.",
            ref: passwordRef,
        },
        {
            test: () => hp0Input.value.length > 0,
            message: "전화번호를 입력해 주세요.",
            ref: hp0Ref,
        },
        {
            test: () => hp1Input.value.length > 0,
            message: "전화번호를 입력해 주세요.",
            ref: hp1Ref,
        },
        {
            test: () => hp2Input.value.length > 0,
            message: "전화번호를 입력해 주세요.",
            ref: hp2Ref,
        },
    ]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(e.target.value);
        setShowKoreanWarning(hasKorean);

        if (!hasKorean) {
            setPassword(e.target.value);
        }
    };

    // 내 정보 조회
    const fetchAccountInfo = async () => {
        if (!userInfo?.userId) return;

        try {
            const response = await axiosInstance.get(
                `${process.env.NEXT_PUBLIC_API_URL}/account/${userInfo.userId}`
            );

            if (!response.data.result) {
                alert(response.data.errMsg);
                return;
            }

            const data: AccountData = response.data.data;
            hp0Input.setValue(data.hp0 || "");
            hp1Input.setValue(data.hp1 || "");
            hp2Input.setValue(data.hp2 || "");
        } catch (error: any) {
            alert("Network error: " + error.message);
        }
    };

    // 관리자 로그인 목록 조회
    const fetchAdminLoginList = async () => {
        try {
            const response = await axiosInstance.get(
                `${process.env.NEXT_PUBLIC_API_URL}/Code?Kind=admin_login`
            );

            if (!response.data.result) {
                alert(response.data.errMsg);
                return;
            }

            const items: AdminLoginItem[] = response.data.data.items;
            setList(items);
            if (items.length > 0) {
                setAreaMan(items[0].code);
            }
        } catch (error: any) {
            alert("Network error: " + error.message);
        }
    };

    // 정보 수정 요청
    const handleEdit = async () => {
        const isValid = validateAll();
        if (!isValid) return;

        if (!window.confirm("수정하시겠습니까?")) return;

        try {
            setIsLoading(true);
            const response = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_API_URL}/Account`,
                {
                    userId: userInfo?.userId,
                    password: password ?? "",
                    hp0: hp0Input.value,
                    hp1: hp1Input.value,
                    hp2: hp2Input.value,
                }
            );

            if (!response.data.result) {
                alert(response.data.errMsg);
                return;
            }

            alert("수정되었습니다.");
            window.location.replace("/accountInfo");
        } catch (error: any) {
            alert("Network error: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 관리자 로그인
    const handleAdminLogin = async () => {
        if (!window.confirm("로그인 하시겠습니까?")) return;

        try {
            setIsLoading(true);
            const response = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_API_URL}/Login/byAdmin?UserId=${areaMan}`
            );

            if (!response.data.result) {
                alert(response.data.errMsg);
                return;
            }

            const data = response.data.data;
            localStorage.setItem(
                "atKey",
                JSON.stringify({
                    token: data.token,
                    refreshToken: data.refreshToken,
                })
            );
            localStorage.removeItem("menu");
            router.push("/");
        } catch (error: any) {
            alert("Network error: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userInfo?.userId) {
            fetchAccountInfo();

            if (userInfo.userPower === "0") {
                fetchAdminLoginList();
            }
        }
    }, [userInfo?.userId]);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="w-full flex-grow p-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl md:pt-[100px] text-black font-semibold text-center">
                        내 정보 수정
                    </h2>
                    <div>
                        <ul className="w-[328px] pt-4 md:pt-[30px] mx-auto">
                            <li className="flex justify-between">
                                <span className="pl-2 text-[#999999] text-md">아이디</span>
                            </li>
                            <input
                                type="text"
                                className="bg-transparent bg-white w-full h-[48px] border border-[#E1E1E1] rounded-md py-2 pl-4 pr-3 focus:outline-none"
                                value={userInfo?.userId ?? ""}
                                disabled
                            />
                            <li className="pt-5 flex justify-between">
                                <span className="pl-2 text-[#999999] text-md">비밀번호</span>
                            </li>
                            <input
                                ref={passwordRef}
                                type="text"
                                className="bg-transparent bg-white w-full h-[48px] border border-[#E1E1E1] rounded-md py-2 pl-4 pr-3 focus:outline-none"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            {showKoreanWarning && (
                                <div className="text-red-500 text-sm pl-2 mt-2">
                                    한글은 입력할 수 없습니다.
                                </div>
                            )}
                            <li className="pt-5 flex justify-between">
                                <span className="pl-2 text-[#999999] text-md">휴대폰 번호</span>
                            </li>
                            <div className="flex justify-between">
                                <input
                                    ref={hp0Ref}
                                    type="tel"
                                    className="bg-transparent bg-white w-[105px] h-[48px] border border-[#E1E1E1] rounded-md py-2 pl-4 pr-3 focus:outline-none"
                                    value={hp0Input.value}
                                    onChange={hp0Input.onChange}
                                />
                                <input
                                    ref={hp1Ref}
                                    type="text"
                                    className="bg-transparent bg-white w-[105px] h-[48px] border border-[#E1E1E1] rounded-md py-2 pl-4 pr-3 focus:outline-none"
                                    value={hp1Input.value}
                                    onChange={hp1Input.onChange}
                                />
                                <input
                                    ref={hp2Ref}
                                    type="text"
                                    className="bg-transparent bg-white w-[105px] h-[48px] border border-[#E1E1E1] rounded-md py-2 pl-4 pr-3 focus:outline-none"
                                    value={hp2Input.value}
                                    onChange={hp2Input.onChange}
                                />
                            </div>
                            <button
                                onClick={handleEdit}
                                disabled={isLoading}
                                className="w-full h-[48px] mt-[20px] bg-[#A50A2E] hover:bg-[#CCCCCC] text-white py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                저장
                            </button>

                            {userInfo?.userPower === "0" && (
                                <>
                                    <li className="pt-5 flex justify-between">
                                        <span className="pl-2 text-[#999999] text-md">
                                            관리자 로그인
                                        </span>
                                    </li>
                                    <select
                                        value={areaMan}
                                        onChange={(e) => setAreaMan(e.target.value)}
                                        className="pl-4 border border-[#E1E1E1] rounded-md appearance-none select_shop focus:outline-none w-[328px] h-12"
                                    >
                                        {list.map((item) => (
                                            <option key={item.codeName} value={item.code}>
                                                {item.codeName}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="w-full h-[48px] bg-[#77829B] hover:bg-[#CCCCCC] text-white py-2 border border-transparent rounded-md shadow-sm font-medium focus:outline-none mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleAdminLogin}
                                        disabled={isLoading}
                                    >
                                        로그인
                                    </button>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
