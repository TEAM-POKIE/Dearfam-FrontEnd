import * as React from "react";
import imageNotFound from "../../assets/image/section2/image_not_found_170x130.svg";
import { ImageWithProfiles } from "./components/ImageWithProfiles";
import { useMemoryPostsByTimeOrder } from "../../hooks/api";
import { Skeleton } from "../../components/ui/shadcn/skeleton";

export const EventGallery = () => {
  const { data, isLoading, error } = useMemoryPostsByTimeOrder({
    page: 1,
    limit: 50, // 충분한 데이터를 가져와서 연도별 그룹화
    order: "desc", // 최신순 정렬
  });

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
        data.data.posts.map((p: { id: string; createdAt: string }) => ({
          id: p.id,
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

  const posts = data.data.posts || [];

  // 데이터를 연도별로 그룹화
  const groupedByYear = posts.reduce(
    (
      acc: Record<number, unknown[]>,
      post: {
        id: string;
        createdAt: string;
        updatedAt: string;
        title?: string;
        images?: string[];
        familyMembers?: unknown[];
      }
    ) => {
      const year = new Date(
        post.createdAt || post.updatedAt || Date.now()
      ).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    },
    {} as Record<number, unknown[]>
  );

  return (
    <div className=" flex justify-center pt-[1.25rem] pb-[3rem] overflow-y-auto hide-scrollbar">
      {Object.entries(groupedByYear)
        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)) // 최신 연도부터
        .map(([year, posts], groupIndex, groupArray) => (
          <div
            key={year}
            className={`${
              groupIndex === groupArray.length - 1 ? "mb-16" : "mb-6"
            }`}
          >
            <div className="text-h4 text-[#9a9893] mb-[0.62rem] ml-[0.62rem]">
              {year}
            </div>
            <div className=" grid grid-cols-2 gap-[0.62rem]">
              {(
                posts as {
                  id: string;
                  title?: string;
                  images?: string[];
                  familyMembers?: unknown[];
                }[]
              ).map((post) => (
                <div
                  key={post.id}
                  className="group cursor-pointer block"
                  style={{
                    transition:
                      "transform 500ms linear(0, 0.1144, 0.3475, 0.5885, 0.7844, 0.9194, 0.9987, 1.0359, 1.046, 1.0413, 1.0308, 1.0196, 1.0104, 1.004, 1.0002, 0.9984, 1), box-shadow 500ms linear(0, 0.1144, 0.3475, 0.5885, 0.7844, 0.9194, 0.9987, 1.0359, 1.046, 1.0413, 1.0308, 1.0196, 1.0104, 1.004, 1.0002, 0.9984, 1)",
                    transform: "scale(1)",
                    margin: "0",
                    padding: "0",
                    lineHeight: "0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <ImageWithProfiles
                    imageSrc={
                      post.images && post.images.length > 0
                        ? post.images[0]
                        : imageNotFound
                    }
                    imageAlt={post.title || "이미지"}
                    imageClassName="object-cover rounded-[0.94rem] w-[10.625rem] h-[8.125rem] block"
                    profileCount={post.familyMembers?.length || 1}
                    profileSize="small"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};
