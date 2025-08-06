import * as React from "react";

interface DiarySkeletonLoaderProps {
  itemCount?: number;
  groupCount?: number;
}

export const DiarySkeletonLoader = ({ 
  itemCount = 4, 
  groupCount = 2 
}: DiarySkeletonLoaderProps) => {
  return (
    <>
      {Array.from({ length: groupCount }).map((_, index) => (
        <div key={index} className="mb-6">
          {/* 연도 스켈레톤 */}
          <div className="w-[5rem] h-[2rem] mb-[0.62rem] ml-[0.62rem] bg-gray-300 rounded animate-pulse"></div>

          {/* 2열 그리드 스켈레톤 */}
          <div className="grid grid-cols-2 gap-[0.62rem]">
            {Array.from({ length: itemCount }).map((_, i) => (
              <div
                key={i}
                className="rounded-[0.94rem] w-[10.625rem] h-[8.125rem] bg-gray-300 animate-pulse"
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};