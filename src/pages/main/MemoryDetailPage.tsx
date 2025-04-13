import { EventHeader } from "@/views/main/mainDetailPage/EventHeader";
import { HeaderNav } from "@/views/main/mainDetailPage/headerNav";
import { ImageSlider } from "@/views/main/mainDetailPage/imageSlider";
import * as React from "react";

export function MemoryDetailPage() {
  return (
    <div>
      <HeaderNav />
      <EventHeader />
      <ImageSlider />
    </div>
  );
}
