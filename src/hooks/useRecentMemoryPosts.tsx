// 기존 API 함수 기반 훅 (deprecated)
import { useQuery } from "@tanstack/react-query";
import { getRecentMemoryPosts } from "../data/api/memory-post/memory";

export const useRecentMemoryPostsLegacy = () => {
  return useQuery({
    queryKey: ["memory-posts", "recent"],
    queryFn: getRecentMemoryPosts,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

// 새로운 MSW 기반 API 훅 (권장)
export { useRecentMemoryPosts } from "./api/useMemoryPostAPI";
