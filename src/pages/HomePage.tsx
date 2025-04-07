import { EventSlideContainer } from "@/views/home/event_slide_container";

import * as React from "react";
import { HomeSlider } from "@/views/home/homeSlider";
export function HomePage() {
  // 스토어에서 상태 및 액션 가져오기

  return (
    <div>
      <EventSlideContainer />

      <HomeSlider />
    </div>
  );
}
