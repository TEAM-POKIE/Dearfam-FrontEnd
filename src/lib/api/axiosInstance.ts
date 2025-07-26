// src/lib/api/axiosInstance.ts
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Axios 설정 타입 확장
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: { startTime: Date };
  _retry?: boolean;
}


const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? "" : import.meta.env.VITE_API_URL,
  timeout: 5000,
  withCredentials: true,
});

// 요청 인터셉터 - 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 중복 요청 방지를 위한 요청 ID 추가
    (config as ExtendedAxiosRequestConfig).metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 처리
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    
    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 토큰 새로고침 시도
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("리프레시 토큰이 없습니다.");
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || "/api/v1"}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        // 새 토큰 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        
        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 토큰 새로고침 실패 시 로그아웃 처리
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        
        // 로그인 페이지로 리다이렉트 (필요시)
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
export default axiosInstance;
