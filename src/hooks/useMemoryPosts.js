import { useQuery } from '@tanstack/react-query';
import { getAllMemoryPostsByTimeOrder } from '@/lib/api/memory-post';
export const useMemoryPosts = () => {
    return useQuery({
        queryKey: ['memoryPosts'],
        queryFn: getAllMemoryPostsByTimeOrder,
        staleTime: 1000 * 60 * 5, // 5분 캐시
        refetchOnWindowFocus: false,
    });
};
