import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userQueryKeys } from "./useUserAPI";
// API 기본 URL
const API_BASE_URL = "/api/v1";
// API 함수들
const authAPI = {
    // 카카오 로그인
    kakaoLogin: async (code) => {
        const response = await fetch(`${API_BASE_URL}/auth/oauth2/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
        });
        return response.json();
    },
    // 토큰 새로고침
    refreshToken: async () => {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        return response.json();
    },
    // 로그아웃
    logout: async () => {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        return response.json();
    },
};
// React Query 훅들
// 카카오 로그인 뮤테이션
export const useKakaoLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: authAPI.kakaoLogin,
        onSuccess: (data) => {
            // 성공 시 사용자 정보 캐시 설정
            if (data.data?.user) {
                queryClient.setQueryData(userQueryKeys.currentUser(), {
                    success: true,
                    data: data.data.user,
                });
            }
            // 토큰 저장 (실제 프로덕션에서는 secure storage 사용)
            if (data.data?.accessToken) {
                localStorage.setItem("accessToken", data.data.accessToken);
            }
            if (data.data?.refreshToken) {
                localStorage.setItem("refreshToken", data.data.refreshToken);
            }
            console.log("카카오 로그인 성공:", data);
        },
        onError: (error) => {
            console.error("카카오 로그인 실패:", error);
        },
    });
};
// 토큰 새로고침 뮤테이션
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
// 로그아웃 뮤테이션
export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: authAPI.logout,
        onSuccess: (data) => {
            // 성공 시 모든 캐시 정리
            queryClient.clear();
            // 로컬 스토리지 정리
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            console.log("로그아웃 성공:", data);
        },
        onError: (error) => {
            console.error("로그아웃 실패:", error);
            // 에러가 발생해도 로컬 정리는 수행
            queryClient.clear();
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },
    });
};
// 유틸리티 함수들
export const authUtils = {
    // 토큰 존재 여부 확인
    hasToken: () => {
        return !!localStorage.getItem("accessToken");
    },
    // 토큰 가져오기
    getToken: () => {
        return localStorage.getItem("accessToken");
    },
    // 토큰 설정 (헤더에 자동 추가용)
    setAuthHeader: (token) => {
        // 글로벌 fetch 설정이나 axios 인터셉터에서 사용
        localStorage.setItem("accessToken", token);
    },
    // 로그인 상태 확인
    isAuthenticated: () => {
        const token = localStorage.getItem("accessToken");
        if (!token)
            return false;
        // 토큰 만료 확인 (실제 프로덕션에서는 JWT 디코딩 등을 사용)
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.exp > Date.now() / 1000;
        }
        catch {
            return false;
        }
    },
};
