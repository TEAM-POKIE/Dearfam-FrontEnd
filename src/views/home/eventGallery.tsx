import React from "react";
import imageNotFound from "../../assets/image/section2/image_not_found_170x130.svg";

const EventGallery = () => {
  return (
    <div className="mt-[1.25rem] px-[1.06rem] h-full max-h-[calc(100vh-10rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden  ">
      <div className="text-h4 text-[#9a9893] mb-[1rem] ml-[0.63rem]">0000</div>
      <div className="grid grid-cols-2 gap-x-[1.13rem] gap-y-[1rem] mb-6">
        <img
          className="rounded-[1rem]"
          src={imageNotFound}
          alt="imageNotFound"
        />
        <img
          className="rounded-[1rem]"
          src={imageNotFound}
          alt="imageNotFound"
        />
        <img
          className="rounded-[1rem]"
          src={imageNotFound}
          alt="imageNotFound"
        />
        <img
          className="rounded-[1rem]"
          src={imageNotFound}
          alt="imageNotFound"
        />
        <img
          className="rounded-[1rem]"
          src={imageNotFound}
          alt="imageNotFound"
        />
        <img
          className="rounded-[1rem]"
          src={imageNotFound}
          alt="imageNotFound"
        />
      </div>
      <div className="text-h4 text-[#9a9893] mb-[1rem] ml-[0.63rem]">0000</div>
      <div className="grid grid-cols-2 gap-x-[1.13rem] gap-y-[1rem]">
        <img
          className="rounded-[1rem]"
          src={imageNotFound}
          alt="imageNotFound"
        />
        <img
          className="rounded-[1rem]"
          src={imageNotFound}
          alt="imageNotFound"
        />
        <img
          className="rounded-[1rem]"
          src={imageNotFound}
          alt="imageNotFound"
        />
        <img
          className="rounded-[1rem]"
          src={imageNotFound}
          alt="imageNotFound"
        />
        <img
          className="rounded-[1rem]"
          src={imageNotFound}
          alt="imageNotFound"
        />
        <img
          className="rounded-[1rem]"
          src={imageNotFound}
          alt="imageNotFound"
        />
      </div>
    </div>
  );
};

export default EventGallery;
