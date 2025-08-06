import * as React from "react";
import imageNotFound from "@/assets/image/section2/image_not_found_170x130.svg";
import { ImageWithProfiles } from "@/pages/Home/components/ImageWithProfiles";
import { TimeOrderMemoryPost } from "@/data/api/memory-post/type";

interface DiaryPostItemProps {
  post: TimeOrderMemoryPost["data"][0]["posts"][0];
  isSelected: boolean;
  onToggleSelect: (postId: number) => void;
}

export const DiaryPostItem = ({ post, isSelected, onToggleSelect }: DiaryPostItemProps) => {
  return (
    <div
      className={`group cursor-pointer transition-transform duration-500 rounded-[0.94rem] overflow-hidden w-[10.625rem] h-[8.125rem] bg-white flex items-center justify-center ${
        isSelected ? "border-[5px] border-main-1" : ""
      }`}
      onClick={() => onToggleSelect(post.postId)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <ImageWithProfiles
        imageSrc={post.thumbnailUrl || imageNotFound}
        imageAlt="메모리 이미지"
        imageClassName={
          post.thumbnailUrl
            ? " max-w-[10.625rem] max-h-[8.125rem]"
            : "w-full"
        }
        profileSize="small"
      />
    </div>
  );
};