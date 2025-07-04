import { z } from "zod";
// 사용자 정보 스키마
export const UserSchema = z.object({
    id: z.string(),
    nickname: z.string(),
    email: z.string().email(),
    profilePicture: z.string().url().optional(),
    role: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
// 가족 정보 스키마
export const FamilySchema = z.object({
    id: z.string(),
    name: z.string(),
    familyCode: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
// 가족 구성원 스키마
export const FamilyMemberSchema = z.object({
    id: z.string(),
    user: UserSchema,
    role: z.string(),
    joinedAt: z.string(),
});
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
// 댓글 스키마
export const CommentSchema = z.object({
    id: z.string(),
    content: z.string(),
    author: UserSchema,
    postId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
// API 엔드포인트 상수
export const API_BASE_URL = "/api/v1";
