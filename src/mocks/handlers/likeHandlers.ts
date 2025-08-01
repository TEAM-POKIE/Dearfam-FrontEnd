import { http, HttpResponse } from "msw";
import { findMemoryPostById, currentUser } from "../data/mockData";
import { ApiResponse } from "../types";

// 메모리에 좋아요 상태 저장 (실제 프로덕션에서는 데이터베이스 사용)
const likeStorage: Map<string, Set<string>> = new Map(); // postId -> Set<userId>

// 게시글 좋아요 - PUT /memory-post/{postId}/like
const toggleLike = http.put(
  "/api/v1/memory-post/:postId/like",
  ({ params }) => {
    const { postId } = params;
    const post = findMemoryPostById(postId as string);

    if (!post) {
      const errorResponse: ApiResponse = {
        success: false,
        message: "게시글을 찾을 수 없습니다.",
        code: "POST_NOT_FOUND",
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    // 해당 게시글의 좋아요 사용자 Set 가져오기
    let likedUsers = likeStorage.get(postId as string);
    if (!likedUsers) {
      likedUsers = new Set();
      likeStorage.set(postId as string, likedUsers);
    }

    const userId = String(currentUser.id);
    const isLiked = likedUsers.has(userId);

    if (isLiked) {
      // 좋아요 취소
      likedUsers.delete(userId);
    } else {
      // 좋아요 추가
      likedUsers.add(userId);
    }

    const newLikeCount = likedUsers.size;
    const newIsLiked = !isLiked;

    const response: ApiResponse<{
      postId: string;
      likeCount: number;
      isLiked: boolean;
      action: "liked" | "unliked";
    }> = {
      success: true,
      data: {
        postId: postId as string,
        likeCount: newLikeCount,
        isLiked: newIsLiked,
        action: newIsLiked ? "liked" : "unliked",
      },
      message: newIsLiked
        ? "게시글에 좋아요를 눌렀습니다."
        : "게시글 좋아요를 취소했습니다.",
    };

    return HttpResponse.json(response);
  }
);

// 게시글 좋아요 상태 조회 - GET /memory-post/{postId}/like
const getLikeStatus = http.get(
  "/api/v1/memory-post/:postId/like",
  ({ params }) => {
    const { postId } = params;
    const post = findMemoryPostById(postId as string);

    if (!post) {
      const errorResponse: ApiResponse = {
        success: false,
        message: "게시글을 찾을 수 없습니다.",
        code: "POST_NOT_FOUND",
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    const likedUsers = likeStorage.get(postId as string) || new Set();
    const isLiked = likedUsers.has(String(currentUser.id));
    const likeCount = likedUsers.size;

    const response: ApiResponse<{
      postId: string;
      likeCount: number;
      isLiked: boolean;
    }> = {
      success: true,
      data: {
        postId: postId as string,
        likeCount,
        isLiked,
      },
      message: "좋아요 상태 조회가 완료되었습니다.",
    };

    return HttpResponse.json(response);
  }
);

export const likeHandlers = [toggleLike, getLikeStatus];
