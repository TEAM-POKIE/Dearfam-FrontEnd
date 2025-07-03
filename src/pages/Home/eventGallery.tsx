import * as React from "react";
import imageNotFound from "../../assets/image/section2/image_not_found_170x130.svg";
import { ImageWithProfiles } from "./components/ImageWithProfiles";
import { useMemoryPostsByTimeOrder } from "../../hooks/api";

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
  }, [data, isLoading, error]);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] px-5 flex items-center justify-center">
        <div className="text-center">
          <div className="text-h4 text-[#9a9893]">로딩 중...</div>
        </div>
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

  // 데이터를 연도별로 그룹화
  const groupedByYear = data.data.posts.reduce((acc, post) => {
    const year = new Date(post.createdAt).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<number, typeof data.data.posts>);

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
                  key={post.id}
                  imageSrc={imageNotFound} // 추후 실제 이미지 URL이 있으면 사용
                  imageAlt={post.title}
                  imageClassName="rounded-[0.94rem]"
                  profileCount={post.familyMembers.length}
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
