import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// API 기본 URL
const API_BASE_URL = "/api/v1";
// Query Keys
export const userQueryKeys = {
    all: ["users"],
    currentUser: () => [...userQueryKeys.all, "current"],
    user: (userId) => [...userQueryKeys.all, userId],
};
// API 함수들
const userAPI = {
    // 현재 사용자 정보 조회
    getCurrentUser: async () => {
        const response = await fetch(`${API_BASE_URL}/users/user`);
        return response.json();
    },
    // 특정 사용자 정보 조회
    getUserById: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        return response.json();
    },
    // 닉네임 변경
    updateNickname: async (nickname) => {
        const response = await fetch(`${API_BASE_URL}/users/nickname`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nickname }),
        });
        return response.json();
    },
};
// React Query 훅들
// 현재 사용자 정보 조회
export const useCurrentUser = () => {
    return useQuery({
        queryKey: userQueryKeys.currentUser(),
        queryFn: userAPI.getCurrentUser,
        staleTime: 10 * 60 * 1000, // 10분
        gcTime: 15 * 60 * 1000, // 15분
    });
};
// 특정 사용자 정보 조회
export const useUser = (userId) => {
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
            console.log("닉네임 변경 성공:", data);
        },
        onError: (error) => {
            console.error("닉네임 변경 실패:", error);
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
            const previousUser = queryClient.getQueryData(userQueryKeys.currentUser());
            // 낙관적 업데이트
            queryClient.setQueryData(userQueryKeys.currentUser(), (old) => {
                if (!old?.data)
                    return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        nickname: newNickname,
                        updatedAt: new Date().toISOString(),
                    },
                };
            });
            return { previousUser };
        },
        onError: (err, newNickname, context) => {
            // 에러 시 이전 데이터로 롤백
            if (context?.previousUser) {
                queryClient.setQueryData(userQueryKeys.currentUser(), context.previousUser);
            }
        },
        onSettled: () => {
            // 완료 후 관련 쿼리 refetch
            queryClient.invalidateQueries({ queryKey: userQueryKeys.currentUser() });
        },
    });
};
