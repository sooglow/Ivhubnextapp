import axios from "axios";

const axiosInstance = axios.create();

// 요청 interceptor - 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const tokenItem = localStorage.getItem("atKey");
      const token = tokenItem ? JSON.parse(tokenItem)?.token : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 interceptor - 401 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokenItem = localStorage.getItem("atKey");
        const refreshToken = tokenItem ? JSON.parse(tokenItem)?.refreshToken : null;

        if (!refreshToken) {
          handleLogout();
          return Promise.reject(error);
        }

        // 토큰 갱신 시도
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/Login/refresh`,
          { refreshToken }
        );

        if (response.data?.data) {
          const newToken = response.data.data.token;
          const newRefreshToken = response.data.data.refreshToken;

          localStorage.setItem(
            "atKey",
            JSON.stringify({
              token: newToken,
              refreshToken: newRefreshToken,
            })
          );

          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
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

function handleLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("atKey");
    localStorage.removeItem("menu");
    window.location.replace("/login");
  }
}

export default axiosInstance;
