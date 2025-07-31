// 가족 관련 API 훅들
export {
  familyQueryKeys,
  useFamilyMembers,
  useFamilyMembersByFamilyId,
  useFamilyInviteLink,
  useCreateFamily,
  useSetFamilyRole,
  useJoinFamily,
} from "./useFamilyAPI";

// 메모리 포스트 관련 API 훅들
export {
  memoryPostQueryKeys,
  useRecentMemoryPosts,
  useMemoryPostsByTimeOrder,
  useMemoryPost,
  useMemoryPostFamilyMembers,
  useUpdateMemoryPost,
  useDeleteMemoryPost,
  useOptimisticUpdateMemoryPost,
} from "./useMemoryPostAPI";

// 사용자 관련 API 훅들
export {
  userQueryKeys,
  useCurrentUser,
  useUser,
  useUpdateNickname,
  useOptimisticUpdateNickname,
} from "./useUserAPI";

// 댓글 관련 API 훅들
export {
  commentQueryKeys,
  useComments,
  useCreateComment,
  useDeleteComment,
  useOptimisticCreateComment,
  useOptimisticDeleteComment,
} from "./useCommentAPI";

// 좋아요 관련 API 훅들
export {
  likeQueryKeys,
  useLikeStatus,
  useToggleLike,
  useOptimisticToggleLike,
} from "./useLikeAPI";

// 인증 관련 API 훅들
export {
  useKakaoLogin,
  // useRefreshToken, // 임시 비활성화
  useLogout,
  authUtils,
} from "./useAuthAPI";

// 타입 재export
export type {
  ApiResponse,
  User,
  Family,
  FamilyMember,
  MemoryPost,
  Comment,
  PaginatedResponse,
  PaginationParams,
  MockDataOptions,
} from "../../mocks/types";

// 타입 import
import type { ApiResponse } from "../../mocks/types";

// 유틸리티 함수들
export const apiUtils = {
  // API 베이스 URL
  baseUrl: "/api/v1",

  // 공통 헤더 생성
  createHeaders: (includeAuth: boolean = true): HeadersInit => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  },

  // 에러 처리
  handleApiError: (error: unknown): string => {
    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      if (apiError.response?.data?.message) {
        return apiError.response.data.message;
      }
    }
    if (error && typeof error === "object" && "message" in error) {
      const messageError = error as { message: string };
      return messageError.message;
    }
    return "알 수 없는 오류가 발생했습니다.";
  },

  // 성공 응답 확인
  isSuccessResponse: <T>(
    response: ApiResponse<T>
  ): response is ApiResponse<T> & { success: true } => {
    return response.success === true;
  },
} as const;
