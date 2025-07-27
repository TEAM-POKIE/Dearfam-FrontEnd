// 쿼리 키 팩토리 패턴
export const queryKeys = {
  // 가족 관련 쿼리 키
  family: {
    all: ["family"] as const,
    members: () => [...queryKeys.family.all, "members"] as const,
    member: (id: number) => [...queryKeys.family.all, "member", id] as const,
    profile: (id: number) => [...queryKeys.family.all, "profile", id] as const,
  },

  // 사용자 관련 쿼리 키
  user: {
    all: ["user"] as const,
    profile: () => [...queryKeys.user.all, "profile"] as const,
    settings: () => [...queryKeys.user.all, "settings"] as const,
  },

  // 메모리 포스트 관련 쿼리 키
  memory: {
    all: ["memory"] as const,
    posts: () => [...queryKeys.memory.all, "posts"] as const,
    post: (id: number) => [...queryKeys.memory.all, "post", id] as const,
    comments: (postId: number) =>
      [...queryKeys.memory.all, "post", postId, "comments"] as const,
  },
} as const;
