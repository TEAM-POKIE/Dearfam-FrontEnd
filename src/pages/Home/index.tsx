import { EventSlideContainer } from "./EventSlideContainer";
import { useHeaderStore } from "@/context/store/headerStore";
import { BasicLoading } from "@/components/BasicLoading";

import * as React from "react";
import { useState, useEffect } from "react";
import { HomeSlider } from "./HomeSlider";
import { EventGallery } from "./EventGallery";

export function HomePage() {
  const { mode } = useHeaderStore();
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트가 마운트되면 로딩 완료
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // 1초 후 로딩 완료

    return () => clearTimeout(timer);
  }, []);

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="bg-bg-1 min-h-screen">
        <BasicLoading fullscreen text="일상 페이지 로딩 중..." size={80} />
      </div>
    );
  }

  return (
    <div className="h-full ">
      {mode === "gallery" && <EventGallery />}
      {mode === "slider" && (
        <div>
          <EventSlideContainer />
          <HomeSlider />
        </div>
      )}
    </div>
  );
}
