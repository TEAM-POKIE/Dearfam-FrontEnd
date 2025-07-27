import { InputContainer } from "./components/InputContainer";
import { CommentContainer } from "./MainDetailPage/CommentContainer";
import { DetailContent } from "./MainDetailPage/DetailContent";
import { DetailContentHeader } from "./MainDetailPage/DetailContentHeader";
import { EventHeader } from "./MainDetailPage/EventHeader";
import { SemiHeader } from "@/components/SemiHeader";
import { ImageSlider } from "./MainDetailPage/ImageSlider";

export function MemoryDetailPage() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="flex-1 pb-[4.125rem] overflow-y-auto">
        <SemiHeader title="이벤트 제목" exit={false} />
        <EventHeader />
        <ImageSlider />
        <DetailContentHeader />
        <DetailContent />
        <div className=" border-t-[0.0625rem] border-gray-3 ">
          <CommentContainer />
        </div>
      </div>

      <div className="fixed left-0 right-0 bottom-0 w-full sm:w-[24.375rem] m-auto z-10">
        <InputContainer />
      </div>
    </div>
  );
}
