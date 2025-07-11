import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/shadcn/carouselMain";
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const {
    currentIndex: storeCurrentIndex,
    shouldRememberIndex,
    setTotalSlides,
    setCurrentIndex: setStoreCurrentIndex,
    setCarouselApi,
    saveIndexForDetailPage,
    resetIndex,
  } = useCarouselStore();
  const { setSliderValue, step } = useSliderStore();

  // 최근 메모리 포스트 데이터 가져오기
  const {
    data: memoryPostsData,
    isLoading,
    error,
  } = useRecentMemoryPosts(limit);
  const toggleLikeMutation = useToggleLike();

  // 색상 보간 함수
  const interpolateColor = useCallback((progress: number) => {
    // 회색 #9A9893 (154, 152, 147) -> 흰색 #FFFFFF (255, 255, 255)
    const gray = { r: 154, g: 152, b: 147 };
    const white = { r: 255, g: 255, b: 255 };

    const r = Math.round(gray.r + (white.r - gray.r) * progress);
    const g = Math.round(gray.g + (white.g - gray.g) * progress);
    const b = Math.round(gray.b + (white.b - gray.b) * progress);

    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  // 스크롤 위치에 따른 슬라이드 스타일 계산
  const getSlideStyle = useCallback(
    (index: number) => {
      if (!api)
        return {
          transform: "scale(0.85)",
          opacity: 0.6,
          backgroundColor: "#9A9893",
          showContent: false,
          contentOpacity: 0,
        };

      const slides = api.scrollSnapList();
      const totalSlides = slides.length;

      // 현재 스크롤 위치를 기준으로 각 슬라이드의 거리 계산
      const slideProgress = scrollProgress * (totalSlides - 1);
      const distanceFromCenter = Math.abs(slideProgress - index);

      // 거리에 따른 크기 계산 (0: 100%, 1: 85%, 더 멀어질수록 더 작아짐)
      const maxDistance = 1.5; // 최대 영향 거리
      const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);

      // 크기: 1.0 (중앙) -> 0.85 (멀어짐)
      const scale = 1 - normalizedDistance * 0.15;

      // 투명도: 1.0 (중앙) -> 0.6 (멀어짐)
      const opacity = 1 - normalizedDistance * 0.4;

      // 높이: 29.25rem (중앙) -> 20.0625rem (멀어짐)
      const baseHeight = 29.25;
      const minHeight = 20.0625;
      const height = baseHeight - normalizedDistance * (baseHeight - minHeight);

      // 배경색 보간
      const colorProgress = 1 - normalizedDistance;
      const backgroundColor = interpolateColor(Math.max(colorProgress, 0));

      // 콘텐츠 표시 여부와 투명도 (거리가 0.8 이하일 때 표시, 거리에 따라 투명도 조정)
      const showContent = distanceFromCenter <= 0.8;
      const contentOpacity = showContent
        ? Math.max(1 - distanceFromCenter / 0.8, 0.3)
        : 0;

      return {
        transform: `scale(${Math.max(scale, 0.85)})`,
        opacity: Math.max(opacity, 0.6),
        height: `${Math.max(height, minHeight)}rem`,
        backgroundColor,
        showContent,
        contentOpacity,
      };
    },
    [api, interpolateColor, scrollProgress]
  );

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (!api) return;

    // 스크롤 진행률 업데이트 (실시간 드래그 효과용)
    const progress = api.scrollProgress();
    setScrollProgress(progress);

    // 현재 인덱스 업데이트
    const newIndex = api.selectedScrollSnap();
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      setStoreCurrentIndex(newIndex);
      const newSliderValue = newIndex * step;
      setSliderValue(newSliderValue);
    }
  }, [api, currentIndex, setStoreCurrentIndex, setSliderValue, step]);

  // 드래그 시작 핸들러
  const handlePointerDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  // 드래그 끝 핸들러
  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

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
      newApi.on("scroll", handleScroll);

      if (!initialized.current) {
        initialized.current = true;
        setTimeout(() => {
          // shouldRememberIndex가 true인 경우에만 저장된 인덱스 사용
          const initialIndex = shouldRememberIndex ? storeCurrentIndex : 0;
          setCurrentIndex(initialIndex);
          setStoreCurrentIndex(initialIndex);
          newApi.scrollTo(initialIndex);

          // 슬라이더 값도 초기 인덱스로 설정
          const initialSliderValue = initialIndex * step;
          setSliderValue(initialSliderValue);
        }, 100);
      }

      return () => {
        newApi.off("select", onSelectSlide);
        newApi.off("scroll", handleScroll);
      };
    },
    [
      onSelectSlide,
      handleScroll,
      setCarouselApi,
      setStoreCurrentIndex,
      setSliderValue,
    ]
  );

  useEffect(() => {
    if (!api) return;

    return () => {
      api.off("select", onSelectSlide);
    };
  }, [api, onSelectSlide]);

  // 컴포넌트 마운트 시 인덱스 초기화 (다른 페이지에서 돌아올 때)
  useEffect(() => {
    if (!shouldRememberIndex) {
      resetIndex();
    }
  }, [shouldRememberIndex, resetIndex]);

  const handleCardClick = useCallback(
    (event: React.MouseEvent, index: number) => {
      // 좋아요 버튼 클릭 시에는 이벤트 전파를 막음
      if ((event.target as HTMLElement).closest('img[alt="heart"]')) {
        return;
      }

      // 현재 활성 슬라이드가 아닌 경우, 해당 슬라이드로 이동
      if (index !== currentIndex) {
        api?.scrollTo(index);
        // Zustand에 바로 인덱스 저장 (onSelectSlide에서도 처리되지만 즉시 반영을 위해)
        setStoreCurrentIndex(index);
        setCurrentIndex(index);

        // 슬라이더 값도 함께 업데이트
        const newSliderValue = index * step;
        setSliderValue(newSliderValue);
        return;
      }

      // 현재 활성 슬라이드인 경우에만 상세 페이지로 이동
      saveIndexForDetailPage(currentIndex); // 상세 페이지로 이동할 때만 인덱스 저장
      navigate("/memoryDetailPage");
    },
    [
      navigate,
      currentIndex,
      api,
      setStoreCurrentIndex,
      setSliderValue,
      step,
      saveIndexForDetailPage,
    ]
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
            {displayItems.map((item, index) => {
              const dynamicStyle = getSlideStyle(index);
              return (
                <CarouselItem
                  key={`${item.id}-${index}`}
                  className={`basis-[76.9%] cursor-pointer
                    ${index === 0 ? "ml-[2.81rem] pl-0" : ""}
                    ${index === displayItems.length - 1 ? "mr-[2.81rem]" : ""}
                    ${index !== 0 ? "px-0" : ""}
                  `}
                  style={{
                    height: dynamicStyle.height,
                    transform: dynamicStyle.transform,
                    opacity: dynamicStyle.opacity,
                    transition: isDragging
                      ? "none"
                      : "all 250ms linear(0, 0.1605, 0.4497, 0.7063, 0.8805, 0.9768, 1.0183, 1.0284, 1.0242, 1.0161, 1.0087, 1.0036, 1.0008, 0.9995, 1)",
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                >
                  <div className="h-full">
                    <Card
                      className="h-full hover:shadow-lg"
                      style={{
                        backgroundColor: dynamicStyle.backgroundColor,
                        transition: isDragging
                          ? "none"
                          : "background-color 450ms linear(0, 0.1605, 0.4497, 0.7063, 0.8805, 0.9768, 1.0183, 1.0284, 1.0242, 1.0161, 1.0087, 1.0036, 1.0008, 0.9995, 1), box-shadow 500ms linear(0, 0.1144, 0.3475, 0.5885, 0.7844, 0.9194, 0.9987, 1.0359, 1.046, 1.0413, 1.0308, 1.0196, 1.0104, 1.004, 1.0002, 0.9984, 1)",
                      }}
                      onClick={(e) => handleCardClick(e, index)}
                    >
                      {dynamicStyle.showContent && (
                        <div
                          className="h-full w-full"
                          style={{
                            opacity: dynamicStyle.contentOpacity,
                            transition: isDragging
                              ? "none"
                              : "opacity 450ms linear(0, 0.1605, 0.4497, 0.7063, 0.8805, 0.9768, 1.0183, 1.0284, 1.0242, 1.0161, 1.0087, 1.0036, 1.0008, 0.9995, 1)",
                          }}
                        >
                          <CardContent
                            className={`flex flex-col h-full ${
                              index === displayItems.length - 1 && showLastItem
                                ? "px-[0.94rem] pt-[2.5rem] pb-[0.88rem]"
                                : "p-[0.94rem]"
                            }`}
                          >
                            {index === displayItems.length - 1 &&
                            showLastItem ? (
                              <div className="flex flex-col h-full justify-between">
                                <div>
                                  <div className="text-h5 text-gray-2 mb-[0.62rem] ml-[0.31rem]">
                                    추억을 더 공유해보세요!
                                  </div>
                                  <div className="text-body4 text-gray-3 ml-[0.31rem]">
                                    가족에게 일상과 추억의 이야기를
                                    공유해보세요!
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
                                  imageClassName="w-full rounded-[0.88rem]"
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
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
