import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carouselMain";
import { ImageWithProfiles } from "./ImageWithProfiles";
import heartActive from "../../../assets/image/section2/icon_hearrt_active.svg";
import heartDefault from "../../../assets/image/section2/icon_hearrt_default.svg";
import dearfamLogo from "../../../assets/image/dearfam_logo_icon.svg";
import imageNotFound from "../../../assets/image/section2/image_not_found_270x280.svg";
import BasicButton from "@/components/BasicButton";
import { useCarouselStore } from "@/context/store/carouselStore";
import { useSliderStore } from "@/context/store/sliderStore";
import { useNavigate } from "react-router-dom";
import { useRecentMemoryPosts } from "@/hooks/api/useMemoryPostAPI";
import { useToggleLike } from "@/hooks/api/useLikeAPI";

interface EventCarouselProps {
  showLastItem?: boolean;
  limit?: number;
}

export const EventCarousel: React.FC<EventCarouselProps> = ({
  showLastItem = true,
  limit = 10,
}) => {
  const navigate = useNavigate();
  const initialized = useRef(false);
  const [api, setApiState] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedEvents, setLikedEvents] = useState<Set<number>>(new Set());

  const {
    setTotalSlides,
    setCurrentIndex: setStoreCurrentIndex,
    setCarouselApi,
  } = useCarouselStore();
  const { setSliderValue, step } = useSliderStore();

  // 최근 메모리 포스트 데이터 가져오기
  const {
    data: memoryPostsData,
    isLoading,
    error,
  } = useRecentMemoryPosts(limit);
  const toggleLikeMutation = useToggleLike();

  // 메모리 포스트 데이터를 EventItem 형태로 변환
  const transformedItems = React.useMemo(() => {
    if (!memoryPostsData?.data) return [];

    // 실제 API 응답 형식에 맞춰서 타입 변환
    const posts = memoryPostsData.data as {
      postId?: number;
      title?: string;
      content?: string;
      commentCount?: number;
      memoryDate?: string;
      participants?: {
        familyMemberId: number;
        nickname: string;
      }[];
      liked?: boolean;
      images?: string[];
    }[];

    return posts.map((post) => ({
      id: post.postId || 0,
      title: post.title || "",
      image:
        post.images && post.images.length > 0 ? post.images[0] : imageNotFound,
      content: post.content || "",
      liked: post.liked || false,
      commentCount: post.commentCount || 0,
    }));
  }, [memoryPostsData]);

  // 좋아요 상태 초기화
  useEffect(() => {
    if (transformedItems.length > 0) {
      const initialLikedEvents = new Set(
        transformedItems.filter((item) => item.liked).map((item) => item.id)
      );
      setLikedEvents(initialLikedEvents);
    }
  }, [transformedItems]);

  // 슬라이드 개수 설정
  useEffect(() => {
    const totalSlides = showLastItem
      ? transformedItems.length + 1
      : transformedItems.length;
    setTotalSlides(totalSlides);
  }, [transformedItems.length, showLastItem, setTotalSlides]);

  const onSelectSlide = useCallback(() => {
    if (!api) return;

    try {
      const selectedIndex = api.selectedScrollSnap();
      setCurrentIndex(selectedIndex);
      setStoreCurrentIndex(selectedIndex);

      // 슬라이더 값도 함께 업데이트
      const newSliderValue = selectedIndex * step;
      setSliderValue(newSliderValue);
    } catch (error) {
      console.error("Error handling carousel selection:", error);
    }
  }, [api, setStoreCurrentIndex, setSliderValue, step]);

  const setApi = useCallback(
    (newApi: CarouselApi | null) => {
      if (!newApi) return;

      setApiState(newApi);
      setCarouselApi(newApi);
      newApi.on("select", onSelectSlide);

      if (!initialized.current) {
        initialized.current = true;
        setTimeout(() => {
          setCurrentIndex(0);
          setStoreCurrentIndex(0);
          newApi.scrollTo(0);

          // 슬라이더 초기값 설정
          setSliderValue(0);
        }, 100);
      }

      return () => {
        newApi.off("select", onSelectSlide);
      };
    },
    [onSelectSlide, setCarouselApi, setStoreCurrentIndex, setSliderValue]
  );

  useEffect(() => {
    if (!api) return;

    return () => {
      api.off("select", onSelectSlide);
    };
  }, [api, onSelectSlide]);

  const handleCardClick = useCallback(
    (event: React.MouseEvent) => {
      // 좋아요 버튼 클릭 시에는 이벤트 전파를 막음
      if ((event.target as HTMLElement).closest('img[alt="heart"]')) {
        return;
      }
      navigate("/memoryDetailPage");
    },
    [navigate]
  );

  const handleLike = useCallback(
    (postId: number) => {
      // 낙관적 업데이트: 즉시 UI 상태 변경
      const previousLikedState = likedEvents.has(postId);

      setLikedEvents((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });

      // API 호출
      toggleLikeMutation.mutate(postId.toString(), {
        onError: () => {
          // 실패 시 상태 롤백
          setLikedEvents((prev) => {
            const newSet = new Set(prev);
            if (previousLikedState) {
              newSet.add(postId);
            } else {
              newSet.delete(postId);
            }
            return newSet;
          });
          console.error("좋아요 처리 실패 - 상태가 롤백되었습니다.");
        },
      });
    },
    [toggleLikeMutation, likedEvents]
  );

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="w-full flex flex-col justify-center items-center h-[29.25rem] mt-[3.75rem] mb-[2.81rem]">
        <div className="text-h4 text-gray-3">로딩 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="w-full flex flex-col justify-center items-center h-[29.25rem] mt-[3.75rem] mb-[2.81rem]">
        <div className="text-h4 text-gray-3">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  // 실제 표시할 아이템들 (showLastItem이 true면 마지막에 추가 아이템 포함)
  const displayItems = showLastItem
    ? [
        ...transformedItems,
        {
          id: -1,
          title: "",
          image: "",
          content: "",
          liked: false,
          commentCount: 0,
        },
      ]
    : transformedItems;

  return (
    <div className="w-full flex flex-col justify-center items-center h-[29.25rem] mt-[3.75rem] mb-[2.81rem]">
      <div className="relative w-full">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent className="w-full -mx-0 flex items-center gap-x-2 h-full">
            {displayItems.map((item, index) => (
              <CarouselItem
                key={`${item.id}-${index}`}
                className={`basis-[76.9%] transition-all duration-300 
                  ${index === 0 ? "ml-[2.81rem] pl-0" : ""}
                  ${index === displayItems.length - 1 ? "mr-[2.81rem]" : ""}
                  ${index !== 0 ? "px-0" : ""}
                `}
                style={{
                  height: index === currentIndex ? "29.25rem" : "20.0625rem",
                  transform: index === currentIndex ? "scale(1)" : "scale(0.9)",
                }}
              >
                <div className="h-full">
                  <Card
                    className={`h-full ${
                      index === currentIndex ? "bg-white" : "bg-[#9A9893]"
                    }`}
                    onClick={handleCardClick}
                  >
                    {index === currentIndex && (
                      <div className="h-full w-full">
                        <CardContent
                          className={`flex flex-col h-full ${
                            index === displayItems.length - 1 && showLastItem
                              ? "px-[0.94rem] pt-[2.5rem] pb-[0.88rem]"
                              : "p-[0.94rem]"
                          }`}
                        >
                          {index === displayItems.length - 1 && showLastItem ? (
                            <div className="flex flex-col h-full justify-between">
                              <div>
                                <div className="text-h5 text-gray-2 mb-[0.62rem] ml-[0.31rem]">
                                  추억을 더 공유해보세요!
                                </div>
                                <div className="text-body4 text-gray-3 ml-[0.31rem]">
                                  가족에게 일상과 추억의 이야기를 공유해보세요!
                                </div>
                              </div>

                              <img
                                src={dearfamLogo}
                                alt="dearfamLogo"
                                className="w-full px-[2.81rem]"
                              />
                              <div className="flex justify-center">
                                <BasicButton
                                  text="추억 공유하러 가기"
                                  color="main_1"
                                  size={270}
                                  textStyle="text_body3"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <ImageWithProfiles
                                imageSrc={item.image}
                                imageAlt={item.title}
                                imageClassName="rounded-[0.88rem]"
                                profileCount={3}
                              />
                              <div className="text-h5 mt-[0.94rem]">
                                {item.title}
                              </div>
                              <div className="text-body4 text-gray-3 mt-[0.31rem] h-[5.3125rem] overflow-hidden text-ellipsis">
                                {item.content || "This is event contents."}
                              </div>
                              <div className="mt-auto  flex items-center justify-between gap-[0.31rem]">
                                <span className="text-caption1 text-gray-3">
                                  댓글 {item.commentCount || 0}개
                                </span>
                                <img
                                  src={
                                    likedEvents.has(item.id)
                                      ? heartActive
                                      : heartDefault
                                  }
                                  alt="heart"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLike(item.id);
                                  }}
                                  className="cursor-pointer"
                                />
                              </div>
                            </>
                          )}
                        </CardContent>
                      </div>
                    )}
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
