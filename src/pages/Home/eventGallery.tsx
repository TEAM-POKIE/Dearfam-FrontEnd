import * as React from "react";
import imageNotFound from "../../assets/image/section2/image_not_found_170x130.svg";
import { ImageWithProfiles } from "./components/ImageWithProfiles";
import { useMemoryPostsByTimeOrder } from "../../hooks/api";
import { Skeleton } from "../../components/ui/skeleton";

const EventGallery = () => {
  const { data, isLoading, error } = useMemoryPostsByTimeOrder({
    page: 1,
    limit: 50, // 충분한 데이터를 가져와서 연도별 그룹화
    order: "desc", // 최신순 정렬
  });

  // 디버깅용 로그
  React.useEffect(() => {
    console.log("📊 EventGallery 상태:", {
      isLoading,
      error: error?.message,
      dataLength: data?.data?.posts?.length,
      data: data?.data,
    });

    // 데이터가 있을 때 추가 정보 로그
    if (data?.data?.posts && data.data.posts.length > 0) {
      console.log("📝 첫 번째 포스트:", data.data.posts[0]);
      console.log(
        "📅 포스트 날짜들:",
        data.data.posts.map((p: MemoryPostResponse) => ({
          id: p.postId,
          createdAt: p.createdAt,
          year: new Date(p.createdAt).getFullYear(),
        }))
      );
    }
  }, [data, isLoading, error]);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] px-5 overflow-y-auto hide-scrollbar">
        {/* 스켈레톤 - 연도별 그룹 2개 정도 표시 */}
        {Array.from({ length: 2 }).map((_, yearIndex) => (
          <div key={yearIndex} className="mb-6">
            {/* 연도 제목 스켈레톤 */}
            <Skeleton className="h-6 w-16 mb-4 ml-2.5" />

            {/* 이미지 그리드 스켈레톤 */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {Array.from({ length: 6 }).map((_, imageIndex) => (
                <div key={imageIndex} className="relative">
                  {/* 이미지 스켈레톤 */}
                  <Skeleton className="rounded-[0.94rem] w-[10.625rem] h-[8.125rem]" />

                  {/* 프로필 아이콘들 스켈레톤 */}
                  <div className="absolute bottom-2 right-2 flex -space-x-1">
                    {Array.from({ length: 2 }).map((_, profileIndex) => (
                      <Skeleton
                        key={profileIndex}
                        className="w-6 h-6 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-4rem)] px-5 flex items-center justify-center">
        <div className="text-center">
          <div className="text-h4 text-[#9a9893]">
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data?.posts || data.data.posts.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem)] px-5 flex items-center justify-center">
        <div className="text-center">
          <div className="text-h4 text-[#9a9893]">
            표시할 메모리가 없습니다.
          </div>
        </div>
      </div>
    );
  }

  // 실제 API 응답 구조에 맞춰 타입 변환
  interface MemoryPostResponse {
    postId: number;
    title: string;
    content: string;
    images: string[];
    commentCount: number;
    memoryDate: string;
    participants: {
      familyMemberId: number;
      nickname: string;
    }[];
    liked: boolean;
    likeCount: number;
    createdAt: string;
    updatedAt: string;
  }

  const posts = data.data.posts as MemoryPostResponse[];

  // 데이터를 연도별로 그룹화
  const groupedByYear = posts.reduce((acc, post) => {
    const year = new Date(
      post.createdAt || post.updatedAt || Date.now()
    ).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<number, MemoryPostResponse[]>);

  return (
    <div className="h-[calc(100vh-4rem)] px-5 overflow-y-auto hide-scrollbar">
      {Object.entries(groupedByYear)
        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)) // 최신 연도부터
        .map(([year, posts]) => (
          <div key={year} className="mb-6">
            <div className="text-h4 text-[#9a9893] mb-4 ml-2.5">{year}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {posts.map((post) => (
                <ImageWithProfiles
                  key={post.postId}
                  imageSrc={
                    post.images && post.images.length > 0
                      ? post.images[0]
                      : imageNotFound
                  }
                  imageAlt={post.title || "이미지"}
                  imageClassName="rounded-[0.94rem] w-[10.625rem] h-[8.125rem]"
                  profileCount={post.participants?.length || 1}
                  profileSize="small"
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default EventGallery;
