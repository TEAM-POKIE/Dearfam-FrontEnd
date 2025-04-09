import { EventSlideContainer } from "@/views/home/event_slide_container";
import { useHeaderStore } from "@/lib/store/headerStore";

import * as React from "react";
import { HomeSlider } from "@/views/home/homeSlider";
import EventGallery from "@/views/home/eventGallery";
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
