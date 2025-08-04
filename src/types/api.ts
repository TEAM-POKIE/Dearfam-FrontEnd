import { z } from 'zod';

// 기본 API 응답 구조
export const BaseApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  code: z.string().optional(),
});

export const ApiSuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  BaseApiResponseSchema.extend({
    success: z.literal(true),
    data: dataSchema,
  });

export const ApiErrorResponseSchema = BaseApiResponseSchema.extend({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.any()).optional(),
  }).optional(),
});

// 페이지네이션 응답
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  ApiSuccessResponseSchema(
    z.object({
      items: z.array(itemSchema),
      pagination: PaginationSchema,
    })
  );

// 사용자 관련 스키마들
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  nickname: z.string(),
  profileImage: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AuthResponseSchema = ApiSuccessResponseSchema(
  z.object({
    user: UserSchema,
    accessToken: z.string(),
    refreshToken: z.string(),
  })
);

// 가족 관련 스키마들
export const FamilyMemberSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  role: z.enum(['admin', 'member']),
  profileImage: z.string().nullable(),
  joinedAt: z.string(),
});

export const FamilySchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  members: z.array(FamilyMemberSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const FamilyResponseSchema = ApiSuccessResponseSchema(FamilySchema);
export const FamilyListResponseSchema = ApiSuccessResponseSchema(z.array(FamilySchema));

// 메모리 포스트 관련 스키마들
export const MemoryPostImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  order: z.number(),
});

export const MemoryPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  images: z.array(MemoryPostImageSchema),
  authorId: z.string(),
  authorNickname: z.string(),
  authorProfileImage: z.string().nullable(),
  familyId: z.string(),
  likeCount: z.number(),
  commentCount: z.number(),
  isLiked: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const MemoryPostResponseSchema = ApiSuccessResponseSchema(MemoryPostSchema);
export const MemoryPostListResponseSchema = PaginatedResponseSchema(MemoryPostSchema);

// 댓글 관련 스키마들
export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  authorId: z.string(),
  authorNickname: z.string(),
  authorProfileImage: z.string().nullable(),
  memoryPostId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CommentResponseSchema = ApiSuccessResponseSchema(CommentSchema);
export const CommentListResponseSchema = PaginatedResponseSchema(CommentSchema);

// 좋아요 관련 스키마들
export const LikeResponseSchema = ApiSuccessResponseSchema(
  z.object({
    isLiked: z.boolean(),
    likeCount: z.number(),
  })
);

// 타입 추출
export type BaseApiResponse = z.infer<typeof BaseApiResponseSchema>;
export type ApiSuccessResponse<T = any> = {
  success: true;
  data: T;
  message?: string;
  code?: string;
};
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

export type User = z.infer<typeof UserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export type FamilyMember = z.infer<typeof FamilyMemberSchema>;
export type Family = z.infer<typeof FamilySchema>;

export type MemoryPostImage = z.infer<typeof MemoryPostImageSchema>;
export type MemoryPost = z.infer<typeof MemoryPostSchema>;

export type Comment = z.infer<typeof CommentSchema>;

export type Pagination = z.infer<typeof PaginationSchema>;
export type PaginatedResponse<T = any> = {
  items: T[];
  pagination: Pagination;
};

// API 응답 검증 유틸리티
export const validateApiResponse = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('API Response validation failed:', {
        error: error.errors,
        data,
      });
      
      throw new Error(
        `API 응답 형식이 올바르지 않습니다: ${error.errors
          .map(e => `${e.path.join('.')}: ${e.message}`)
          .join(', ')}`
      );
    }
    throw error;
  }
};

// 타입 가드 함수들
export const isApiSuccessResponse = (response: any): response is ApiSuccessResponse => {
  return response && response.success === true && 'data' in response;
};

export const isApiErrorResponse = (response: any): response is ApiErrorResponse => {
  return response && response.success === false;
};

// HTTP 에러 상태 코드 상수
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    KAKAO_LOGIN: '/auth/kakao',
  },
  
  // User
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
  },
  
  // Family
  FAMILY: {
    LIST: '/families',
    CREATE: '/families',
    DETAIL: (id: string) => `/families/${id}`,
    JOIN: '/families/join',
    LEAVE: (id: string) => `/families/${id}/leave`,
    MEMBERS: (id: string) => `/families/${id}/members`,
  },
  
  // Memory Posts
  MEMORY_POSTS: {
    LIST: (familyId: string) => `/families/${familyId}/memory-posts`,
    CREATE: (familyId: string) => `/families/${familyId}/memory-posts`,
    DETAIL: (id: string) => `/memory-posts/${id}`,
    UPDATE: (id: string) => `/memory-posts/${id}`,
    DELETE: (id: string) => `/memory-posts/${id}`,
  },
  
  // Comments
  COMMENTS: {
    LIST: (postId: string) => `/memory-posts/${postId}/comments`,
    CREATE: (postId: string) => `/memory-posts/${postId}/comments`,
    UPDATE: (id: string) => `/comments/${id}`,
    DELETE: (id: string) => `/comments/${id}`,
  },
  
  // Likes
  LIKES: {
    TOGGLE: (postId: string) => `/memory-posts/${postId}/like`,
  },
  
  // Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    IMAGES: '/upload/images',
  },
} as const;