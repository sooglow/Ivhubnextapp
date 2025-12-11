import { useLoading } from "@/public/contexts/LoadingContext";
import { parseJWT } from "@/public/utils/utils";
import { useEffect, useState } from "react";

export function useUserData() {
    const [userInfo, setUserInfo] = useState({});
    const { dispatch } = useLoading();

    useEffect(() => {
        async function loadUserData() {
            dispatch({ type: "SET_LOADING", payload: true });
            try {
                const token = localStorage.getItem("atKey");
                if (!token) throw new Error("로그인 후 다시 시도해 주세요.");

                const payload = parseJWT(JSON.parse(token).token);
                setUserInfo(payload);
            } catch (error) {
                console.error("Error loading user data:", error);
                window.location.href = "/login";
            } finally {
                dispatch({ type: "SET_LOADING", payload: false });
            }
        }

        loadUserData();
    }, [dispatch]);

    return userInfo;
}
