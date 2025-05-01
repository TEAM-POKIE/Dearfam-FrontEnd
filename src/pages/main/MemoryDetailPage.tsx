import { InputContainer } from "@/components/section2/InputContainer";
import { CommentContainer } from "@/views/main/mainDetailPage/CommentContainer";
import { DetailContent } from "@/views/main/mainDetailPage/DetailContent";
import { DetailContentHeader } from "@/views/main/mainDetailPage/DetailContentHeader";
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
      <DetailContentHeader />
      <DetailContent />
      <div className=" border-t-[0.0625rem] border-gray-3 ">
        <CommentContainer />
      </div>

      <div className="fixed w-[24.375rem] bottom-0 ">
        <InputContainer />
      </div>
    </div>
  );
}
