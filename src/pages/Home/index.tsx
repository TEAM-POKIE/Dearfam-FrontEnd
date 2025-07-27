import { EventSlideContainer } from "./EventSlideContainer";
import { useHeaderStore } from "@/context/store/headerStore";
import { BasicLoading } from "@/components/BasicLoading";

import { HomeSlider } from "./HomeSlider";
import { EventGallery } from "./EventGallery";
import {
  useGetMemoryRecentPosts,
  useGetMemoryTimeOrder,
} from "@/data/api/memory-post/memory";
import { memo } from "react";

const HomePage = memo(function HomePage() {
  const { mode } = useHeaderStore();

  // 최근 메모리 포스트 데이터 가져오기
  const { data: memoryPostsData, isLoading, error } = useGetMemoryRecentPosts();
  useGetMemoryTimeOrder();
  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="bg-bg-1 min-h-screen">
        <BasicLoading fullscreen text="추억 데이터 로딩 중..." size={80} />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-bg-1 min-h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-h4 text-gray-3">
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
          <div className="text-body4 text-gray-4">
            잠시 후 다시 시도해주세요.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full ">
      {mode === "gallery" && <EventGallery />}
      {mode === "slider" && (
        <div>
          <EventSlideContainer memoryPostsData={memoryPostsData} />
          <HomeSlider />
        </div>
      )}
    </div>
  );
});

export { HomePage };
