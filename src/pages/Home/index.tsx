import { EventSlideContainer } from "./event_slide_container";
import { useHeaderStore } from "@/context/store/headerStore";

import * as React from "react";
import { HomeSlider } from "./homeSlider";
import EventGallery from "./eventGallery";

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
