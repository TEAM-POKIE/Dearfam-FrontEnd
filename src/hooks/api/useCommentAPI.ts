import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, Comment } from "../../mocks/types";

// API 기본 URL
const API_BASE_URL = "/api/v1";

// Query Keys
export const commentQueryKeys = {
  all: ["comments"] as const,
  byPost: (postId: string) =>
    [...commentQueryKeys.all, "post", postId] as const,
} as const;

// API 함수들
const commentAPI = {
  // 댓글 조회
  getCommentsByPostId: async (
    postId: string
  ): Promise<ApiResponse<Comment[]>> => {
    const response = await fetch(
      `${API_BASE_URL}/memory-post/${postId}/comment`
    );
    return response.json();
  },

  // 댓글 생성
  createComment: async (data: {
    postId: string;
    content: string;
    parentCommentId?: string;
  }): Promise<ApiResponse<Comment>> => {
    const response = await fetch(
      `${API_BASE_URL}/memory-post/${data.postId}/comment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: data.content,
          parentCommentId: data.parentCommentId,
        }),
      }
    );
    return response.json();
  },

  // 댓글 삭제
  deleteComment: async (data: {
    postId: string;
    commentId: string;
  }): Promise<ApiResponse<{ deletedCommentId: string }>> => {
    const response = await fetch(
      `${API_BASE_URL}/memory-post/${data.postId}/comment/${data.commentId}`,
      {
        method: "DELETE",
      }
    );
    return response.json();
  },
};

// React Query 훅들

// 댓글 조회
export const useComments = (postId: string) => {
  return useQuery({
    queryKey: commentQueryKeys.byPost(postId),
    queryFn: () => commentAPI.getCommentsByPostId(postId),
    enabled: !!postId, // postId가 있을 때만 실행
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000, // 5분
  });
};

// 댓글 생성 뮤테이션
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentAPI.createComment,
    onSuccess: (data, variables) => {
      // 성공 시 해당 포스트의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: commentQueryKeys.byPost(variables.postId),
      });
      console.log("댓글 생성 성공:", data);
    },
    onError: (error) => {
      console.error("댓글 생성 실패:", error);
    },
  });
};

// 댓글 삭제 뮤테이션
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentAPI.deleteComment,
    onSuccess: (data, variables) => {
      // 성공 시 해당 포스트의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: commentQueryKeys.byPost(variables.postId),
      });
      console.log("댓글 삭제 성공:", data);
    },
    onError: (error) => {
      console.error("댓글 삭제 실패:", error);
    },
  });
};

// 낙관적 업데이트를 사용한 댓글 생성
export const useOptimisticCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentAPI.createComment,
    onMutate: async (newComment) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({
        queryKey: commentQueryKeys.byPost(newComment.postId),
      });

      // 이전 데이터 스냅샷
      const previousComments = queryClient.getQueryData(
        commentQueryKeys.byPost(newComment.postId)
      );

      // 낙관적 업데이트
      queryClient.setQueryData(
        commentQueryKeys.byPost(newComment.postId),
        (old: ApiResponse<Comment[]> | undefined) => {
          if (!old?.data) return old;

          // 임시 댓글 객체 생성
          const tempComment: Comment = {
            id: `temp-${Date.now()}`,
            postId: newComment.postId,
            content: newComment.content,
            author: {
              id: "current-user",
              nickname: "나",
              email: "current@user.com",
              profilePicture: undefined,
              role: "user",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return {
            ...old,
            data: [...old.data, tempComment],
          };
        }
      );

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      // 에러 시 이전 데이터로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentQueryKeys.byPost(newComment.postId),
          context.previousComments
        );
      }
    },
    onSettled: (data, error, variables) => {
      // 완료 후 관련 쿼리 refetch
      queryClient.invalidateQueries({
        queryKey: commentQueryKeys.byPost(variables.postId),
      });
    },
  });
};

// 낙관적 업데이트를 사용한 댓글 삭제
export const useOptimisticDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentAPI.deleteComment,
    onMutate: async (variables) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({
        queryKey: commentQueryKeys.byPost(variables.postId),
      });

      // 이전 데이터 스냅샷
      const previousComments = queryClient.getQueryData(
        commentQueryKeys.byPost(variables.postId)
      );

      // 낙관적 업데이트 - 댓글 제거
      queryClient.setQueryData(
        commentQueryKeys.byPost(variables.postId),
        (old: ApiResponse<Comment[]> | undefined) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.filter(
              (comment) => comment.id !== variables.commentId
            ),
          };
        }
      );

      return { previousComments };
    },
    onError: (err, variables, context) => {
      // 에러 시 이전 데이터로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentQueryKeys.byPost(variables.postId),
          context.previousComments
        );
      }
    },
    onSettled: (data, error, variables) => {
      // 완료 후 관련 쿼리 refetch
      queryClient.invalidateQueries({
        queryKey: commentQueryKeys.byPost(variables.postId),
      });
    },
  });
};
