import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, MemoryPost, FamilyMember } from "../../mocks/types";

// API 기본 URL
const API_BASE_URL = "/api/v1";

// Query Keys
export const memoryPostQueryKeys = {
  all: ["memory-post"] as const,
  recent: (limit?: number) =>
    [...memoryPostQueryKeys.all, "recent", limit] as const,
  timeOrder: (page?: number, limit?: number, order?: string) =>
    [...memoryPostQueryKeys.all, "time-order", { page, limit, order }] as const,
  detail: (postId: string) => [...memoryPostQueryKeys.all, postId] as const,
  familyMembers: (postId: string) =>
    [...memoryPostQueryKeys.detail(postId), "family-members"] as const,
} as const;

// API 함수들
const memoryPostAPI = {
  // 최근 게시글 조회
  getRecentPosts: async (
    limit: number = 10
  ): Promise<ApiResponse<MemoryPost[]>> => {
    const response = await fetch(
      `${API_BASE_URL}/memory-post/recent?limit=${limit}`
    );
    return response.json();
  },

  // 시간순 게시글 조회
  getPostsByTimeOrder: async (
    params: {
      page?: number;
      limit?: number;
      order?: "desc" | "asc";
    } = {}
  ): Promise<
    ApiResponse<{
      posts: MemoryPost[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>
  > => {
    const { page = 1, limit = 20, order = "desc" } = params;
    const response = await fetch(
      `${API_BASE_URL}/memory-post/time-order?page=${page}&limit=${limit}&order=${order}`
    );
    return response.json();
  },

  // 게시글 단일 조회
  getMemoryPostById: async (
    postId: string
  ): Promise<ApiResponse<MemoryPost>> => {
    const response = await fetch(`${API_BASE_URL}/memory-post/${postId}`);
    return response.json();
  },

  // 게시글 참여 가족 조회
  getPostFamilyMembers: async (
    postId: string
  ): Promise<ApiResponse<FamilyMember[]>> => {
    const response = await fetch(
      `${API_BASE_URL}/memory-post/${postId}/family-members`
    );
    return response.json();
  },

  // 게시글 수정
  updateMemoryPost: async (data: {
    postId: string;
    title?: string;
    content?: string;
  }): Promise<ApiResponse<MemoryPost>> => {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.content) formData.append("content", data.content);

    const response = await fetch(`${API_BASE_URL}/memory-post/${data.postId}`, {
      method: "PUT",
      body: formData,
    });
    return response.json();
  },

  // 게시글 삭제
  deleteMemoryPost: async (
    postId: string
  ): Promise<ApiResponse<{ deletedPostId: string }>> => {
    const response = await fetch(`${API_BASE_URL}/memory-post/${postId}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// React Query 훅들

// 최근 게시글 조회 (기존 useRecentMemoryPosts와 호환)
export const useRecentMemoryPosts = (limit: number = 10) => {
  return useQuery({
    queryKey: memoryPostQueryKeys.recent(limit),
    queryFn: () => memoryPostAPI.getRecentPosts(limit),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

// 시간순 게시글 조회
export const useMemoryPostsByTimeOrder = (
  params: {
    page?: number;
    limit?: number;
    order?: "desc" | "asc";
  } = {}
) => {
  return useQuery({
    queryKey: memoryPostQueryKeys.timeOrder(
      params.page,
      params.limit,
      params.order
    ),
    queryFn: () => memoryPostAPI.getPostsByTimeOrder(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 게시글 단일 조회
export const useMemoryPost = (postId: string) => {
  return useQuery({
    queryKey: memoryPostQueryKeys.detail(postId),
    queryFn: () => memoryPostAPI.getMemoryPostById(postId),
    enabled: !!postId, // postId가 있을 때만 실행
    staleTime: 3 * 60 * 1000, // 3분
    gcTime: 5 * 60 * 1000, // 5분
  });
};

// 게시글 참여 가족 조회
export const useMemoryPostFamilyMembers = (postId: string) => {
  return useQuery({
    queryKey: memoryPostQueryKeys.familyMembers(postId),
    queryFn: () => memoryPostAPI.getPostFamilyMembers(postId),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 게시글 수정 뮤테이션
export const useUpdateMemoryPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: memoryPostAPI.updateMemoryPost,
    onSuccess: (data, variables) => {
      // 성공 시 해당 게시글과 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: memoryPostQueryKeys.detail(variables.postId),
      });
      queryClient.invalidateQueries({ queryKey: memoryPostQueryKeys.all });
      console.log("게시글 수정 성공:", data);
    },
    onError: (error) => {
      console.error("게시글 수정 실패:", error);
    },
  });
};

// 게시글 삭제 뮤테이션
export const useDeleteMemoryPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: memoryPostAPI.deleteMemoryPost,
    onSuccess: (data, postId) => {
      // 성공 시 해당 게시글 캐시 제거 및 목록 캐시 무효화
      queryClient.removeQueries({
        queryKey: memoryPostQueryKeys.detail(postId),
      });
      queryClient.invalidateQueries({ queryKey: memoryPostQueryKeys.all });
      console.log("게시글 삭제 성공:", data);
    },
    onError: (error) => {
      console.error("게시글 삭제 실패:", error);
    },
  });
};

// 낙관적 업데이트를 사용한 게시글 수정
export const useOptimisticUpdateMemoryPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: memoryPostAPI.updateMemoryPost,
    onMutate: async (newData) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({
        queryKey: memoryPostQueryKeys.detail(newData.postId),
      });

      // 이전 데이터 스냅샷
      const previousPost = queryClient.getQueryData(
        memoryPostQueryKeys.detail(newData.postId)
      );

      // 낙관적 업데이트
      queryClient.setQueryData(
        memoryPostQueryKeys.detail(newData.postId),
        (old: ApiResponse<MemoryPost> | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              title: newData.title || old.data.title,
              content: newData.content || old.data.content,
              updatedAt: new Date().toISOString(),
            },
          };
        }
      );

      return { previousPost };
    },
    onError: (err, newData, context) => {
      // 에러 시 이전 데이터로 롤백
      if (context?.previousPost) {
        queryClient.setQueryData(
          memoryPostQueryKeys.detail(newData.postId),
          context.previousPost
        );
      }
    },
    onSettled: (data, error, variables) => {
      // 완료 후 관련 쿼리 refetch
      queryClient.invalidateQueries({
        queryKey: memoryPostQueryKeys.detail(variables.postId),
      });
    },
  });
};
