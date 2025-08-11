import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, User } from "../../mocks/types";
import axiosInstance from "../../data/api/axiosInstance";

// API 기본 URL - 환경변수 사용
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Query Keys
export const userQueryKeys = {
  all: ["users"] as const,
  currentUser: () => [...userQueryKeys.all, "current"] as const,
  user: (userId: string) => [...userQueryKeys.all, userId] as const,
} as const;

// API 함수들
export const userAPI = {
  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/users/user`);
    return response.data;
  },

  // 특정 사용자 정보 조회
  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  },

  // 닉네임 변경
  updateNickname: async (nickname: string): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.put(`${API_BASE_URL}/users/nickname`, {
      nickname,
    });
    return response.data;
  },

  // 프로필 이미지 업로드
  updateProfileImage: async (file: File): Promise<ApiResponse<{ profileImageUrl: string }>> => {
    const formData = new FormData();
    formData.append('profileImage', file);

    const response = await axiosInstance.put(`${API_BASE_URL}/users/profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// React Query 훅들

// 현재 사용자 정보 조회
export const useCurrentUser = (enabled: boolean = true) => {
  const accessToken = localStorage.getItem('accessToken');
  return useQuery({
    queryKey: userQueryKeys.currentUser(),
    queryFn: userAPI.getCurrentUser,
    enabled: !!accessToken && enabled, // accessToken이 있고 enabled가 true일 때만 실행
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: false, // Prevent retries on 401
    retryDelay: 1000, // 재시도 간격
    retryOnMount: false, // 마운트 시 재시도 비활성화
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 비활성화
    refetchOnReconnect: false, // 네트워크 재연결 시 재요청 비활성화
  });
};

// 특정 사용자 정보 조회
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: userQueryKeys.user(userId),
    queryFn: () => userAPI.getUserById(userId),
    enabled: !!userId, // userId가 있을 때만 실행
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 15 * 60 * 1000, // 15분
  });
};

// 닉네임 변경 뮤테이션
export const useUpdateNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.updateNickname,
    onSuccess: (data) => {
      // 성공 시 현재 사용자 캐시 업데이트
      queryClient.setQueryData(userQueryKeys.currentUser(), data);
      // 사용자 관련 모든 캐시 무효화
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
    onError: () => {
      // 에러 로그 제거 - 컴포넌트에서 처리
    },
  });
};

// 낙관적 업데이트를 사용한 닉네임 변경
export const useOptimisticUpdateNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.updateNickname,
    onMutate: async (newNickname) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({
        queryKey: userQueryKeys.currentUser(),
      });

      // 이전 데이터 스냅샷
      const previousUser = queryClient.getQueryData(
        userQueryKeys.currentUser()
      );

      // 낙관적 업데이트
      queryClient.setQueryData(
        userQueryKeys.currentUser(),
        (old: ApiResponse<User> | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              nickname: newNickname,
              updatedAt: new Date().toISOString(),
            },
          };
        }
      );

      return { previousUser };
    },
    onError: (err, newNickname, context) => {
      // 에러 시 이전 데이터로 롤백
      if (context?.previousUser) {
        queryClient.setQueryData(
          userQueryKeys.currentUser(),
          context.previousUser
        );
      }
    },
    onSettled: () => {
      // 완료 후 관련 쿼리 refetch
      queryClient.invalidateQueries({ queryKey: userQueryKeys.currentUser() });
    },
  });
};

// SettingsPage 등에서 사용할 수 있는 훅
export const useUserData = () => {
  const { data: userData } = useCurrentUser();
  return userData?.data;
};

// 프로필 이미지 업로드 뮤테이션
export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.updateProfileImage,
    onSuccess: (data) => {
      // 성공 시 현재 사용자 캐시 업데이트
      const currentUserData = queryClient.getQueryData(userQueryKeys.currentUser());
      if (currentUserData && data.data?.profileImageUrl) {
        const updatedUserData = {
          ...currentUserData,
          data: {
            ...(currentUserData as any).data,
            profileImage: data.data.profileImageUrl,
          },
        };
        queryClient.setQueryData(userQueryKeys.currentUser(), updatedUserData);
      }
      
      // 사용자 관련 모든 캐시 무효화
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
    onError: () => {
      // 에러 로그 제거 - 컴포넌트에서 처리
    },
  });
};
