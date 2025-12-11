//public/components/LoginHeader.tsx
import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deptCodeName, parseJWT } from "@/public/utils/utils";
import { userInfo } from "@/public/types/user";

const LoginHeader = (): React.ReactElement => {
    const [userInfo, setUserInfo] = useState<userInfo>({});
    const router = useRouter();
    const deptCode = deptCodeName(userInfo.deptCode);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = JSON.parse(localStorage.getItem("atKey") || "{}")?.token;
            if (token) {
                const payload = parseJWT(token);
                setUserInfo(payload || {});
            }
        }
    }, []);

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("atKey");
            localStorage.removeItem("menu");
            router.push("/login");
        }
    };

    return (
        <div className="w-full h-12 bg-[#282729] border-b border-white hidden md:block">
            <div className="max-w-6xl mx-auto px-4 flex justify-between ">
                <div className="w-1/2 h-12 float-left pt-2 ">
                    <Link href="/">
                        <img src="/images/logo_ivoh.png" alt="IV Office Hub" />
                    </Link>
                </div>
                <div className="w-1/2 h-12 flex items-center justify-end">
                    <p className="text-white pr-2 text-md ">
                        {deptCode} {userInfo.userId ? userInfo.userId + "님" : ""}
                    </p>
                    <Link href="/accountInfo">
                        <img src="/images/icon_human.png" alt="userInfo" />
                    </Link>
                    <a onClick={handleLogout} className="cursor-pointer">
                        <img src="/images/icon_logout.png" alt="logout" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginHeader;
