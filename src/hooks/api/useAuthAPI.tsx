import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, User } from "../../mocks/types";
import { userQueryKeys } from "./useUserAPI";
import axiosInstance from "../../lib/api/axiosInstance";
import axios from "axios";
import { useAuthStore } from "../../context/store/authStore";

// API 기본 URL - 환경변수 사용
const API_BASE_URL = import.meta.env.VITE_API_URL;

// 타입 정의
interface KakaoLoginRequest {
  code: string;
  redirectUri?: string;
}

interface KakaoLoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  isNewUser: boolean;
}

interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}


// API 함수들
const authAPI = {
  // 카카오 로그인
  kakaoLogin: async (params: KakaoLoginRequest): Promise<ApiResponse<KakaoLoginResponse>> => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/auth/oauth2/login`, {
        provider: "kakao",
        code: params.code,
        redirectUri: params.redirectUri,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "카카오 로그인에 실패했습니다.");
      }
      throw error;
    }
  },

  // 토큰 새로고침 (임시 비활성화)
  /*
  refreshToken: async (): Promise<ApiResponse<TokenRefreshResponse>> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("리프레시 토큰이 없습니다.");
      }

      const response = await axiosInstance.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "토큰 새로고침에 실패했습니다.");
      }
      throw error;
    }

  },
  */

  // 로그아웃
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/auth/logout`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "로그아웃에 실패했습니다.");
      }
      throw error;
    }

  },
};

// React Query 훅들

// 카카오 로그인 뮤테이션
export const useKakaoLogin = () => {
  const queryClient = useQueryClient();
  const { setUser, setError } = useAuthStore();


  return useMutation({
    mutationFn: authAPI.kakaoLogin,
    onSuccess: (data) => {
      if (data.data?.accessToken) {
        // JSON 객체인 경우 실제 토큰 값만 추출
        let actualAccessToken = data.data.accessToken;
        if (typeof data.data.accessToken === 'object' && data.data.accessToken.token) {
          actualAccessToken = data.data.accessToken.token;
        }
        
        localStorage.setItem("accessToken", String(actualAccessToken));
      }
      
      if (data.data?.refreshToken) {
        // JSON 객체인 경우 실제 토큰 값만 추출
        let actualRefreshToken = data.data.refreshToken;
        if (typeof data.data.refreshToken === 'object' && data.data.refreshToken.token) {
          actualRefreshToken = data.data.refreshToken.token;
        }
        
        localStorage.setItem("refreshToken", String(actualRefreshToken));
      }
      
      // 성공 시 사용자 정보 캐시 설정
      if (data.data?.user) {
        queryClient.setQueryData(userQueryKeys.currentUser(), {
          success: true,
          data: data.data.user,
        });
        // Zustand 스토어에 사용자 정보 저장
        setUser(data.data.user);
      }
    },
    onError: (error) => {
      console.error("카카오 로그인 실패:", error);
      // 에러 시 토큰 정리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      // 에러 상태 설정
      setError(error instanceof Error ? error.message : "로그인에 실패했습니다.");
    },
  });
};

// 토큰 새로고침 뮤테이션 (임시 비활성화)
/*
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: authAPI.refreshToken,
    onSuccess: (data) => {
      // 성공 시 새로운 토큰 저장
      if (data.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
      }
      if (data.data?.refreshToken) {
        localStorage.setItem("refreshToken", data.data.refreshToken);
      }

      console.log("토큰 새로고침 성공:", data);
    },
    onError: (error) => {
      console.error("토큰 새로고침 실패:", error);
      // 토큰 새로고침 실패 시 로컬 스토리지 정리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  });
};
*/

// 로그아웃 뮤테이션
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();


  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: (data) => {
      // 성공 시 모든 캐시 정리
      queryClient.clear();

      // 로컬 스토리지 정리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Zustand 스토어 정리
      logout();

      console.log("로그아웃 성공:", data);
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
      // 에러가 발생해도 로컬 정리는 수행
      queryClient.clear();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Zustand 스토어 정리
      logout();

    },
  });
};

// 유틸리티 함수들
export const authUtils = {
  // 토큰 존재 여부 확인
  hasToken: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },

  // 토큰 가져오기
  getToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  // 토큰 설정 (헤더에 자동 추가용)
  setAuthHeader: (token: string): void => {
    localStorage.setItem("accessToken", token);
  },

  // 로그인 상태 확인
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    // 토큰 만료 확인 (실제 프로덕션에서는 JWT 디코딩 등을 사용)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  },
  // 카카오 로그인 URL 생성
  getKakaoLoginUrl: (): string => {
    const KAKAO_REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY;
    const REDIRECT_URI = `${window.location.origin}/kakao/callback`;
    
    if (!KAKAO_REST_KEY) {
      throw new Error("카카오 REST API 키가 설정되지 않았습니다.");
    }

    return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
  },

  // URL에서 인증 코드 추출
  extractAuthCode: (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("code");
  },
};
