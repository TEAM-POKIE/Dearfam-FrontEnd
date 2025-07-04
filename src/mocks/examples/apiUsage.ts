/**
 * MSW API 사용 예시
 *
 * 이 파일은 구현된 MSW API들을 어떻게 사용하는지 보여주는 예시입니다.
 * 실제 컴포넌트나 서비스에서 이런 식으로 API를 호출할 수 있습니다.
 */

import {
  ApiResponse,
  User,
  MemoryPost,
  Comment,
  Family,
  FamilyMember,
} from "../types";

// API 기본 URL
const API_BASE_URL = "/api/v1";

// 인증 API 예시
export const authExamples = {
  // 카카오 로그인
  async kakaoLogin(code: string) {
    const response = await fetch(`${API_BASE_URL}/auth/oauth2/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "kakao",
        code,
      }),
    });

    const result: ApiResponse<{
      user: User;
      accessToken: string;
      refreshToken: string;
      isNewUser: boolean;
    }> = await response.json();

    return result;
  },

  // 토큰 새로고침
  async refreshToken(refreshToken: string) {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const result: ApiResponse<{
      accessToken: string;
      refreshToken: string;
    }> = await response.json();

    return result;
  },
};

// 사용자 API 예시
export const userExamples = {
  // 현재 사용자 정보 조회
  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/users/user`);
    const result: ApiResponse<User> = await response.json();
    return result;
  },

  // 사용자 닉네임 변경
  async updateNickname(nickname: string) {
    const response = await fetch(`${API_BASE_URL}/users/nickname`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    });

    const result: ApiResponse<User> = await response.json();
    return result;
  },

  // 특정 사용자 정보 조회
  async getUserById(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    const result: ApiResponse<User> = await response.json();
    return result;
  },
};

// 가족 API 예시
export const familyExamples = {
  // 가족 생성
  async createFamily(name: string) {
    const response = await fetch(`${API_BASE_URL}/family`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const result: ApiResponse<Family> = await response.json();
    return result;
  },

  // 가족 초대 링크 생성
  async generateInviteLink() {
    const response = await fetch(`${API_BASE_URL}/family/generate-link`);
    const result: ApiResponse<{ inviteLink: string; familyCode: string }> =
      await response.json();
    return result;
  },

  // 가족 참여
  async joinFamily(familyCode: string, nickname?: string) {
    const response = await fetch(`${API_BASE_URL}/family/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ familyCode, nickname }),
    });

    const result: ApiResponse<FamilyMember> = await response.json();
    return result;
  },

  // 가족 구성원 조회
  async getFamilyMembers() {
    const response = await fetch(`${API_BASE_URL}/family/members`);
    const result: ApiResponse<FamilyMember[]> = await response.json();
    return result;
  },
};

// 메모리 포스트 API 예시
export const memoryPostExamples = {
  // 최근 게시글 조회
  async getRecentPosts(limit: number = 10) {
    const response = await fetch(
      `${API_BASE_URL}/memory-post/recent?limit=${limit}`
    );
    const result: ApiResponse<MemoryPost[]> = await response.json();
    return result;
  },

  // 게시글 생성
  async createMemoryPost(title: string, content: string, images: File[]) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    images.forEach((image) => formData.append("images", image));

    const response = await fetch(`${API_BASE_URL}/memory-post`, {
      method: "POST",
      body: formData,
    });

    const result: ApiResponse<MemoryPost> = await response.json();
    return result;
  },

  // 특정 게시글 조회
  async getMemoryPostById(postId: string) {
    const response = await fetch(`${API_BASE_URL}/memory-post/${postId}`);
    const result: ApiResponse<MemoryPost> = await response.json();
    return result;
  },

  // 게시글 수정
  async updateMemoryPost(postId: string, title?: string, content?: string) {
    const formData = new FormData();
    if (title) formData.append("title", title);
    if (content) formData.append("content", content);

    const response = await fetch(`${API_BASE_URL}/memory-post/${postId}`, {
      method: "PUT",
      body: formData,
    });

    const result: ApiResponse<MemoryPost> = await response.json();
    return result;
  },

  // 게시글 삭제
  async deleteMemoryPost(postId: string) {
    const response = await fetch(`${API_BASE_URL}/memory-post/${postId}`, {
      method: "DELETE",
    });

    const result: ApiResponse<{ deletedPostId: string }> =
      await response.json();
    return result;
  },
};

// 댓글 API 예시
export const commentExamples = {
  // 댓글 생성
  async createComment(postId: string, content: string) {
    const response = await fetch(
      `${API_BASE_URL}/memory-post/${postId}/comment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }
    );

    const result: ApiResponse<Comment> = await response.json();
    return result;
  },

  // 댓글 조회
  async getComments(postId: string, page: number = 1, limit: number = 10) {
    const response = await fetch(
      `${API_BASE_URL}/memory-post/${postId}/comment?page=${page}&limit=${limit}`
    );
    const result: ApiResponse<{
      comments: Comment[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }> = await response.json();
    return result;
  },

  // 댓글 삭제
  async deleteComment(postId: string, commentId: string) {
    const response = await fetch(
      `${API_BASE_URL}/memory-post/${postId}/comment/${commentId}`,
      {
        method: "DELETE",
      }
    );

    const result: ApiResponse<{ deletedCommentId: string }> =
      await response.json();
    return result;
  },
};

// 좋아요 API 예시
export const likeExamples = {
  // 좋아요 토글
  async toggleLike(postId: string) {
    const response = await fetch(`${API_BASE_URL}/memory-post/${postId}/like`, {
      method: "PUT",
    });

    const result: ApiResponse<{
      postId: string;
      likeCount: number;
      isLiked: boolean;
      action: "liked" | "unliked";
    }> = await response.json();

    return result;
  },

  // 좋아요 상태 조회
  async getLikeStatus(postId: string) {
    const response = await fetch(`${API_BASE_URL}/memory-post/${postId}/like`);
    const result: ApiResponse<{
      postId: string;
      likeCount: number;
      isLiked: boolean;
    }> = await response.json();

    return result;
  },
};

// 사용 예시
export const usageExamples = {
  // 로그인 후 사용자 정보 조회
  async loginAndGetUser() {
    try {
      // 1. 카카오 로그인
      const loginResult = await authExamples.kakaoLogin("test_code");

      if (loginResult.success) {
        console.log("로그인 성공:", loginResult.data);

        // 2. 사용자 정보 조회
        const userResult = await userExamples.getCurrentUser();

        if (userResult.success) {
          console.log("사용자 정보:", userResult.data);
          return userResult.data;
        }
      }
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  },

  // 게시글 생성 후 댓글 작성
  async createPostAndComment() {
    try {
      // 1. 게시글 생성
      const postResult = await memoryPostExamples.createMemoryPost(
        "우리 가족 여행",
        "오늘 정말 즐거운 하루였어요!",
        []
      );

      if (postResult.success && postResult.data) {
        console.log("게시글 생성 성공:", postResult.data);

        // 2. 댓글 작성
        const commentResult = await commentExamples.createComment(
          postResult.data.id,
          "정말 즐거워 보여요!"
        );

        if (commentResult.success) {
          console.log("댓글 작성 성공:", commentResult.data);

          // 3. 좋아요 누르기
          const likeResult = await likeExamples.toggleLike(postResult.data.id);

          if (likeResult.success) {
            console.log("좋아요 성공:", likeResult.data);
          }
        }
      }
    } catch (error) {
      console.error("작업 실패:", error);
    }
  },
};

// React 컴포넌트에서 사용하는 예시
export const ReactUsageExample = `
// React 컴포넌트에서 사용하는 예시
import React, { useState, useEffect } from 'react';
import { memoryPostExamples } from './mocks/examples/apiUsage';

function MemoryPostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const result = await memoryPostExamples.getRecentPosts(10);
        if (result.success) {
          setPosts(result.data);
        }
      } catch (error) {
        console.error('게시글 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>좋아요: {post.likeCount}</p>
        </div>
      ))}
    </div>
  );
}
`;

export default {
  authExamples,
  userExamples,
  familyExamples,
  memoryPostExamples,
  commentExamples,
  likeExamples,
  usageExamples,
  ReactUsageExample,
};
