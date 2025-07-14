import { EventSlideContainer } from "./EventSlideContainer";
import { useHeaderStore } from "@/context/store/headerStore";

import * as React from "react";
import { HomeSlider } from "./HomeSlider";
import { EventGallery } from "./EventGallery";

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
