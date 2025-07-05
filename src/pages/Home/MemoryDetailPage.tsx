import { InputContainer } from "./components/InputContainer";
import { CommentContainer } from "./mainDetailPage/CommentContainer";
import { DetailContent } from "./mainDetailPage/DetailContent";
import { DetailContentHeader } from "./mainDetailPage/DetailContentHeader";
import { EventHeader } from "./mainDetailPage/EventHeader";
import { HeaderNav } from "./mainDetailPage/HeaderNav";
import { ImageSlider } from "./mainDetailPage/ImageSlider";
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
