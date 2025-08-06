import * as React from "react";
import { TimeOrderMemoryPost } from "@/data/api/memory-post/type";
import { DiaryYearGroup } from "./DiaryYearGroup";
import { DiarySkeletonLoader } from "./DiarySkeletonLoader";

interface DiaryPostGridProps {
  data?: TimeOrderMemoryPost;
  isLoading: boolean;
  selectedPostIds: number[];
  onToggleSelect: (postId: number) => void;
}

export const DiaryPostGrid = ({
  data,
  isLoading,
  selectedPostIds,
  onToggleSelect,
}: DiaryPostGridProps) => {
  if (isLoading || !data?.data) {
    return <DiarySkeletonLoader />;
  }

  return (
    <>
      {data.data
        .sort((a, b) => b.year - a.year)
        .map((yearData, groupIndex, groupArray) => (
          <DiaryYearGroup
            key={yearData.year}
            yearData={yearData}
            isLastGroup={groupIndex === groupArray.length - 1}
            selectedPostIds={selectedPostIds}
            onToggleSelect={onToggleSelect}
          />
        ))}
    </>
  );
};
