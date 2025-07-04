import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { memoryPostQueryKeys } from "./useMemoryPostAPI";
// API 기본 URL
const API_BASE_URL = "/api/v1";
// Query Keys
export const likeQueryKeys = {
    all: ["likes"],
    byPost: (postId) => [...likeQueryKeys.all, "post", postId],
};
// API 함수들
const likeAPI = {
    // 좋아요 상태 조회
    getLikeStatus: async (postId) => {
        const response = await fetch(`${API_BASE_URL}/memory-post/${postId}/like`);
        return response.json();
    },
    // 좋아요 토글
    toggleLike: async (postId) => {
        const response = await fetch(`${API_BASE_URL}/memory-post/${postId}/like`, {
            method: "PUT",
        });
        return response.json();
    },
};
// React Query 훅들
// 좋아요 상태 조회
export const useLikeStatus = (postId) => {
    return useQuery({
        queryKey: likeQueryKeys.byPost(postId),
        queryFn: () => likeAPI.getLikeStatus(postId),
        enabled: !!postId, // postId가 있을 때만 실행
        staleTime: 2 * 60 * 1000, // 2분
        gcTime: 5 * 60 * 1000, // 5분
    });
};
// 좋아요 토글 뮤테이션
export const useToggleLike = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: likeAPI.toggleLike,
        onSuccess: (data, postId) => {
            // 성공 시 해당 포스트의 좋아요 상태 캐시 업데이트
            queryClient.setQueryData(likeQueryKeys.byPost(postId), data);
            // 메모리 포스트 목록 캐시도 무효화 (좋아요 수 업데이트)
            queryClient.invalidateQueries({ queryKey: memoryPostQueryKeys.all });
            console.log("좋아요 토글 성공:", data);
        },
        onError: (error) => {
            console.error("좋아요 토글 실패:", error);
        },
    });
};
// 낙관적 업데이트를 사용한 좋아요 토글
export const useOptimisticToggleLike = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: likeAPI.toggleLike,
        onMutate: async (postId) => {
            // 진행 중인 refetch 취소
            await queryClient.cancelQueries({
                queryKey: likeQueryKeys.byPost(postId),
            });
            // 이전 데이터 스냅샷
            const previousLikeStatus = queryClient.getQueryData(likeQueryKeys.byPost(postId));
            // 낙관적 업데이트
            queryClient.setQueryData(likeQueryKeys.byPost(postId), (old) => {
                if (!old?.data)
                    return old;
                return {
                    ...old,
                    data: {
                        isLiked: !old.data.isLiked,
                        likeCount: old.data.isLiked
                            ? old.data.likeCount - 1
                            : old.data.likeCount + 1,
                    },
                };
            });
            return { previousLikeStatus };
        },
        onError: (err, postId, context) => {
            // 에러 시 이전 데이터로 롤백
            if (context?.previousLikeStatus) {
                queryClient.setQueryData(likeQueryKeys.byPost(postId), context.previousLikeStatus);
            }
        },
        onSettled: (data, error, postId) => {
            // 완료 후 관련 쿼리 refetch
            queryClient.invalidateQueries({ queryKey: likeQueryKeys.byPost(postId) });
            queryClient.invalidateQueries({ queryKey: memoryPostQueryKeys.all });
        },
    });
};
