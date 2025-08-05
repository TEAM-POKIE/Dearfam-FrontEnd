import * as React from "react";
import imageNotFound from "../../assets/image/section2/image_not_found_170x130.svg";
import { ImageWithProfiles } from "../Home/components/ImageWithProfiles";
import {
  useGetMemoryDetail,
  useGetMemoryTimeOrder,
} from "@/data/api/memory-post/memory";
import { TimeOrderMemoryPost } from "@/data/api/memory-post/type";

interface SelectGalleryProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export const SelectGallery = ({ onLoadingChange }: SelectGalleryProps) => {
  const { data, isLoading, error } = useGetMemoryTimeOrder();
  const [selectedPostIds, setSelectedPostIds] = React.useState<number[]>([]);

  // 선택된 첫 번째 포스트의 상세 정보를 가져옴 (기존 로직 유지)
  const firstSelectedPostId =
    selectedPostIds.length > 0 ? selectedPostIds[0] : null;
  useGetMemoryDetail(firstSelectedPostId);

  React.useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  if (error) {
    return (
      <div className="h-[calc(100vh-4rem)] px-5 flex items-center justify-center">
        <div className="text-center">
          <div className="text-h4 text-[#9a9893]">
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full  flex flex-col justify-center pt-[1.25rem] pb-[3rem] overflow-y-auto hide-scrollbar px-[1.25rem] ">
      {isLoading || !data?.data
        ? Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="mb-6">
              {/* 연도 스켈레톤 */}
              <div className="w-[5rem] h-[2rem] mb-[0.62rem] ml-[0.62rem] bg-gray-300 rounded animate-pulse"></div>

              {/* 2열 그리드 스켈레톤 */}
              <div className="grid grid-cols-2 gap-[0.62rem]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[0.94rem] w-[10.625rem] h-[8.125rem] bg-gray-300 animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))
        : data.data.map(
            (
              yearData: TimeOrderMemoryPost["data"][0],
              groupIndex: number,
              groupArray: TimeOrderMemoryPost["data"]
            ) => (
              <div
                key={yearData.year}
                className={`${
                  groupIndex === groupArray.length - 1 ? "mb-16" : "mb-6"
                }`}
              >
                <div className="grid grid-cols-2 gap-[0.62rem] ">
                  {yearData.posts.map(
                    (post: TimeOrderMemoryPost["data"][0]["posts"][0]) => (
                      <div
                        key={post.postId}
                        className={`group cursor-pointer transition-transform duration-500 rounded-[0.94rem] overflow-hidden w-[10.625rem] h-[8.125rem] bg-white flex items-center justify-center ${
                          selectedPostIds.includes(post.postId)
                            ? "border-[5px] border-main-1"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedPostIds((prev) => {
                            if (prev.includes(post.postId)) {
                              // 이미 선택된 경우 제거
                              return prev.filter((id) => id !== post.postId);
                            } else {
                              // 선택되지 않은 경우 추가
                              return [...prev, post.postId];
                            }
                          });
                        }}
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
                    )
                  )}
                </div>
              </div>
            )
          )}
    </div>
  );
};
