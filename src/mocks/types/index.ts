import { z } from "zod";

// 공통 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

// 에러 응답 타입
export interface ApiError {
  success: false;
  message: string;
  code: string;
  details?: unknown;
}

// 사용자 정보 스키마 (백엔드 응답 형식)
export const UserSchema = z.object({
  id: z.number(),
  familyId: z.number(),
  userNickname: z.string(),
  userRole: z.string(),
  userFamilyRole: z.string(),
  isFamilyRoomManager: z.boolean(),
  profileImage: z.string(),
});

export type User = z.infer<typeof UserSchema>;

// 가족 정보 스키마 (기존)
export const FamilySchema = z.object({
  id: z.string(),
  name: z.string(),
  familyCode: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Family = z.infer<typeof FamilySchema>;

// 가족 생성 API 응답 스키마 (POST /family)
export const FamilyCreateResponseSchema = z.object({
  id: z.number(),
  familyName: z.string(),
  parentCount: z.number(),
  childCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type FamilyCreateResponse = z.infer<typeof FamilyCreateResponseSchema>;

// 가족 구성원 정보 스키마
export const FamilyMemberInfoSchema = z.object({
  familyMemberId: z.number(),
  familyMemberNickname: z.string(),
  familyMemberRole: z.string(),
  familyMemberProfileImage: z.string(),
});

export type FamilyMemberInfo = z.infer<typeof FamilyMemberInfoSchema>;

// GET /family/members 응답 스키마
export const FamilyMembersResponseSchema = z.object({
  familyId: z.number(),
  familyName: z.string(),
  familyMembers: z.array(FamilyMemberInfoSchema),
});

export type FamilyMembersResponse = z.infer<typeof FamilyMembersResponseSchema>;

// 가족 구성원 스키마 (기존 - 다른 용도)
export const FamilyMemberSchema = z.object({
  id: z.string(),
  user: UserSchema,
  role: z.string(),
  joinedAt: z.string(),
});

export type FamilyMember = z.infer<typeof FamilyMemberSchema>;

// 메모리 포스트 스키마
export const MemoryPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  images: z.array(z.string().url()),
  author: UserSchema,
  familyMembers: z.array(FamilyMemberSchema),
  likeCount: z.number(),
  isLiked: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type MemoryPost = z.infer<typeof MemoryPostSchema>;

// 댓글 스키마
export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  author: UserSchema,
  postId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Comment = z.infer<typeof CommentSchema>;

// 페이지네이션 타입
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// API 엔드포인트 상수
export const API_BASE_URL = "/api/v1";

// Mock 데이터 생성을 위한 유틸리티 타입
export interface MockDataOptions {
  count?: number;
  familyId?: string;
  userId?: string;
}
