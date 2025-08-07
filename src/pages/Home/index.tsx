import { EventSlideContainer } from "./EventSlideContainer";
import { useHeaderStore } from "@/context/store/headerStore";
import { BasicLoading } from "@/components/BasicLoading";
import { HomeSlider } from "./HomeSlider";
import { EventGallery } from "./EventGallery";
import {
  useGetMemoryRecentPosts,
  useGetMemoryTimeOrder,
} from "@/data/api/memory-post/Memory";
import { memo } from "react";
import React from "react";
import { Banner } from "./Banner";

const HomePage = memo(function HomePage() {
  const { mode, setMode } = useHeaderStore();

  // 최근 메모리 포스트 데이터 가져오기
  const { data: memoryPostsData, isLoading, error } = useGetMemoryRecentPosts();
  const { isLoading: timeOrderLoading } = useGetMemoryTimeOrder();

  // 컴포넌트 마운트 시 헤더 모드 초기화
  React.useEffect(() => {
    // 헤더 모드가 설정되지 않은 경우 기본값으로 설정
    if (!mode || (mode !== "gallery" && mode !== "slider")) {
      setMode("slider");
    }
  }, [mode, setMode]);

  // 전체 로딩 상태 계산
  const isOverallLoading = isLoading || timeOrderLoading;

  // 로딩 중일 때 로딩 화면 표시
  if (isOverallLoading) {
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

  // 데이터가 없는 경우
  if (!memoryPostsData?.data || memoryPostsData.data.length === 0) {
    return (
      <div className="bg-bg-1 min-h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-h4 text-gray-3">아직 등록된 추억이 없어요.</div>
          <div className="text-body4 text-gray-4">
            첫 번째 추억을 작성해보세요!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {mode === "gallery" && <EventGallery />}
      {mode === "slider" && (
        <div>
          <Banner />
          <EventSlideContainer memoryPostsData={memoryPostsData} />
          <HomeSlider />
        </div>
      )}
    </div>
  );
});

export { HomePage };
