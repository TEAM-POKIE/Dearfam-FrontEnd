import * as React from "react";
import { TimeOrderMemoryPost } from "@/data/api/memory-post/type";
import { DiaryPostItem } from "./DiaryPostItem";

interface DiaryYearGroupProps {
  yearData: TimeOrderMemoryPost["data"][0];
  isLastGroup: boolean;
  selectedPostIds: number[];
  onToggleSelect: (postId: number) => void;
}

export const DiaryYearGroup = ({ 
  yearData, 
  isLastGroup, 
  selectedPostIds, 
  onToggleSelect 
}: DiaryYearGroupProps) => {
  return (
    <div className={`${isLastGroup ? "mb-16" : "mb-6"}`}>
      <div className="text-h4 text-[#9a9893] mb-[0.62rem] ml-[0.62rem] leading-[2rem] min-h-[2rem]">
        {yearData.year}
      </div>
      <div className="grid grid-cols-2 gap-[0.62rem]">
        {yearData.posts.map((post) => (
          <DiaryPostItem
            key={post.postId}
            post={post}
            isSelected={selectedPostIds.includes(post.postId)}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>
    </div>
  );
};