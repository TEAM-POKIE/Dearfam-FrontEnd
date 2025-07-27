import * as React from "react";
import imageNotFound from "../../assets/image/section2/image_not_found_170x130.svg";
import { ImageWithProfiles } from "./components/ImageWithProfiles";
import {
  useGetMemoryDetail,
  useGetMemoryTimeOrder,
} from "@/data/api/memory-post/memory";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { TimeOrderMemoryPost } from "@/data/api/memory-post/type";
import { useNavigate } from "react-router-dom";

interface EventGalleryProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export const EventGallery = ({ onLoadingChange }: EventGalleryProps) => {
  const { data, isLoading, error } = useGetMemoryTimeOrder();
  const navigate = useNavigate();
  const [selectedPostId, setSelectedPostId] = React.useState<number | null>(
    null
  );

  useGetMemoryDetail(selectedPostId);

  const onClickMemoryDetail = (postId: number) => {
    setSelectedPostId(postId);
    navigate(`/home/memoryDetailPage/${postId}`);
  };
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
    <div className="w-full max-w-[768px] flex flex-col justify-center pt-[1.25rem] pb-[3rem] overflow-y-auto hide-scrollbar px-5 mx-auto">
      {isLoading || !data?.data
        ? Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="mb-6">
              <Skeleton className="w-[5rem] h-[2rem] mb-[0.62rem] ml-[0.62rem]" />
              <div className="grid grid-cols-2 gap-[0.62rem]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="rounded-[0.94rem] w-[10.625rem] h-[8.125rem]"
                  />
                ))}
              </div>
            </div>
          ))
        : data.data
            .sort(
              (
                a: TimeOrderMemoryPost["data"][0],
                b: TimeOrderMemoryPost["data"][0]
              ) => b.year - a.year
            )
            .map(
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
                  <div className="text-h4 text-[#9a9893] mb-[0.62rem] ml-[0.62rem] leading-[2rem] min-h-[2rem]">
                    {yearData.year}
                  </div>
                  <div className="grid grid-cols-2 gap-[0.62rem]">
                    {yearData.posts.map(
                      (post: TimeOrderMemoryPost["data"][0]["posts"][0]) => (
                        <div
                          key={post.postId}
                          onClick={() => {
                            onClickMemoryDetail(post.postId);
                          }}
                          className="group cursor-pointer block transition-transform duration-500"
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
                            imageClassName="object-cover rounded-[0.94rem] w-[10.625rem] h-[8.125rem] block"
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
