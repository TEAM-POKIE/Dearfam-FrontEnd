import * as React from "react";
import imageNotFound from "../../assets/image/section2/image_not_found_170x130.svg";
import { ImageWithProfiles } from "@/components/section2/ImageWithProfiles";

const EventGallery = () => {
  return (
    <div className="mt-[1.25rem] px-[1.25rem] h-full max-h-[calc(100vh-10rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden  ">
      <div className="text-h4 text-[#9a9893] mb-[1rem] ml-[0.63rem]">0000</div>
      <div className="grid grid-cols-2 gap-x-[1.13rem] gap-y-[1rem] mb-6">
        <ImageWithProfiles
          imageSrc={imageNotFound}
          imageAlt="imageNotFound"
          imageClassName="rounded-[0.94rem]"
          profileCount={3}
          profileSize="small"
        />
        <ImageWithProfiles
          imageSrc={imageNotFound}
          imageAlt="imageNotFound"
          imageClassName="rounded-[0.94rem]"
          profileCount={3}
          profileSize="small"
        />
        <ImageWithProfiles
          imageSrc={imageNotFound}
          imageAlt="imageNotFound"
          imageClassName="rounded-[0.94rem]"
          profileCount={3}
          profileSize="small"
        />
        <ImageWithProfiles
          imageSrc={imageNotFound}
          imageAlt="imageNotFound"
          imageClassName="rounded-[0.94rem]"
          profileCount={1}
          profileSize="small"
        />
        <ImageWithProfiles
          imageSrc={imageNotFound}
          imageAlt="imageNotFound"
          imageClassName="rounded-[0.94rem]"
          profileCount={1}
          profileSize="small"
        />
        <ImageWithProfiles
          imageSrc={imageNotFound}
          imageAlt="imageNotFound"
          imageClassName="rounded-[0.94rem]"
          profileCount={1}
          profileSize="small"
        />
      </div>
      <div className="text-h4 text-[#9a9893] mb-[1rem] ml-[0.63rem]">0000</div>
      <div className="grid grid-cols-2 gap-x-[1.13rem] gap-y-[1rem]">
        <ImageWithProfiles
          imageSrc={imageNotFound}
          imageAlt="imageNotFound"
          imageClassName="rounded-[0.94rem]"
          profileCount={1}
          profileSize="small"
        />
        <ImageWithProfiles
          imageSrc={imageNotFound}
          imageAlt="imageNotFound"
          imageClassName="rounded-[0.94rem]"
          profileCount={1}
          profileSize="small"
        />
        <ImageWithProfiles
          imageSrc={imageNotFound}
          imageAlt="imageNotFound"
          imageClassName="rounded-[0.94rem]"
          profileCount={1}
          profileSize="small"
        />
        <ImageWithProfiles
          imageSrc={imageNotFound}
          imageAlt="imageNotFound"
          imageClassName="rounded-[0.94rem]"
          profileCount={1}
          profileSize="small"
        />
        <ImageWithProfiles
          imageSrc={imageNotFound}
          imageAlt="imageNotFound"
          imageClassName="rounded-[0.94rem]"
          profileCount={1}
          profileSize="small"
        />
        <ImageWithProfiles
          imageSrc={imageNotFound}
          imageAlt="imageNotFound"
          imageClassName="rounded-[0.94rem]"
          profileCount={1}
          profileSize="small"
        />
      </div>
    </div>
  );
};

export default EventGallery;
