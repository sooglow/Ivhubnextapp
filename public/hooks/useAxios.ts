import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { useEffect, useState } from "react";

interface AxiosState<T> {
    loading: boolean;
    error: AxiosError | null;
    res: AxiosResponse<T> | null;
}

interface TriggerState {
    timestamp: number;
    options: AxiosRequestConfig;
}

export const useAxios = <T>(opts: AxiosRequestConfig) => {
    const [state, setState] = useState<AxiosState<T>>({ loading: false, error: null, res: null });
    const [trigger, setTrigger] = useState<TriggerState>({
        timestamp: 0,
        options: {} as AxiosRequestConfig,
    });

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("atKey");
            localStorage.removeItem("menu");
            setTimeout(() => {
                window.location.replace("/login");
            }, 0);
        }
    };

    const refetch = (newOpts?: AxiosRequestConfig) => {
        if (!state.loading) {
            setState({ ...state, loading: true });
            setTrigger({ timestamp: Date.now(), options: { ...opts, ...newOpts } });
        }
    };

    useEffect(() => {
        if (!trigger.options || trigger.timestamp === 0) {
            return;
        }

        const tokenInfo = JSON.parse(localStorage.getItem("atKey") || "{}");
        const headers: Record<string, string> = {};

        if (opts.requiresAuth && !tokenInfo) {
            handleLogout();
            return;
        }

        if (opts.requiresAuth && tokenInfo) {
            headers["Authorization"] = "Bearer " + tokenInfo.token;
        }

        const axiosInstance = axios.create({ headers, responseType: opts.responseType || "json" });

        axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && originalRequest.url?.includes("/refresh")) {
                    handleLogout();
                    return Promise.reject(error);
                }

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const refreshToken = JSON.parse(
                        localStorage.getItem("atKey") || "{}"
                    )?.refreshToken;
                    try {
                        const response = await axios.post(
                            process.env.REACT_APP_API_URL + "/Login/refresh",
                            { refreshToken }
                        );

                        if (response.data) {
                            const _data = response.data;
                            localStorage.setItem(
                                "atKey",
                                JSON.stringify({
                                    token: _data.data.token,
                                    refreshToken: _data.data.refreshToken,
                                })
                            );

                            axios.defaults.headers.common["Authorization"] =
                                "Bearer " + _data.data.token;
                            originalRequest.headers["Authorization"] = "Bearer " + _data.data.token;

                            return axiosInstance(originalRequest);
                        }
                    } catch (refreshError) {
                        handleLogout();
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        axiosInstance(trigger.options)
            .then((data) => {
                setState({ ...state, loading: false, res: data });
            })
            .catch((error) => {
                setState({ ...state, loading: false, error });
            });
    }, [trigger]);

    return { ...state, refetch };
};
