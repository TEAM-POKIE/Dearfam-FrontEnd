import * as React from "react";
import imageNotFound from "../../assets/image/section2/image_not_found_170x130.svg";
import { ImageWithProfiles } from "./components/ImageWithProfiles";

const EventGallery = () => {
  return (
    <div className="h-[calc(100vh-4rem)] px-5 overflow-y-auto hide-scrollbar">
      {/* 첫 번째 섹션 */}
      <div className="text-h4 text-[#9a9893] mb-4 ml-2.5">0000</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-6">
        {[3, 3, 3, 1, 1, 1].map((count, idx) => (
          <ImageWithProfiles
            key={`first-${idx}`}
            imageSrc={imageNotFound}
            imageAlt="imageNotFound"
            imageClassName="rounded-[0.94rem]"
            profileCount={count}
            profileSize="small"
          />
        ))}
      </div>

      {/* 두 번째 섹션 */}
      <div className="text-h4 text-[#9a9893] mb-4 ml-2.5">0000</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        {Array.from({ length: 12 }).map((_, idx) => (
          <ImageWithProfiles
            key={`second-${idx}`}
            imageSrc={imageNotFound}
            imageAlt="imageNotFound"
            imageClassName="rounded-[0.94rem]"
            profileCount={1}
            profileSize="small"
          />
        ))}
      </div>
    </div>
  );
};

export default EventGallery;
