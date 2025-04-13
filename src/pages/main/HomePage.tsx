import { EventSlideContainer } from "@/views/main/event_slide_container";
import { useHeaderStore } from "@/lib/store/headerStore";

import * as React from "react";
import { HomeSlider } from "@/views/main/homeSlider";
import EventGallery from "@/views/main/eventGallery";
export function HomePage() {
  const { mode } = useHeaderStore();
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
