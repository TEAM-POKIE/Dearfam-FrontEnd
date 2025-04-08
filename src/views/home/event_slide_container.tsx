import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import imageNotFound from "../../assets/image/section2/image_not_found_270x280.svg";
import heartActive from "../../assets/image/section2/icon_hearrt_active.svg";
import heartDefault from "../../assets/image/section2/icon_hearrt_default.svg";
import { Card, CardContent } from "../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../../components/ui/carousel";

import { useCarouselStore } from "../../lib/store/carouselStore";
import { useSliderStore } from "../../lib/store/sliderStore";

const SLIDES = [
  { id: 1, title: "Event Title", image: imageNotFound },
  { id: 2, title: "Event Title 2", image: imageNotFound },
  { id: 3, title: "Event Title 3", image: imageNotFound },
  { id: 4, title: "Event Title 4", image: imageNotFound },
  { id: 5, title: "Event Title 5", image: imageNotFound },
];

export function EventSlideContainer() {
  const initialized = useRef(false);
  const [api, setApiState] = useState<CarouselApi | null>(null);
  const [likedEvents, setLikedEvents] = useState<Set<number>>(new Set());

  const { currentIndex, setTotalSlides, setCurrentIndex, setCarouselApi } =
    useCarouselStore();

  const { setSliderValue, step } = useSliderStore();

  // 슬라이드 개수 설정
  useEffect(() => {
    setTotalSlides(SLIDES.length);
  }, [setTotalSlides]);

  // 슬라이드 선택 이벤트 핸들러
  const onSelectSlide = useCallback(() => {
    if (!api) return;

    try {
      const selectedIndex = api.selectedScrollSnap();
      console.log("Carousel slide selected:", selectedIndex);
      setCurrentIndex(selectedIndex);

      // 슬라이더 값도 함께 업데이트
      const newSliderValue = selectedIndex * step;
      setSliderValue(newSliderValue);
    } catch (error) {
      console.error("Error handling carousel selection:", error);
    }
  }, [api, setCurrentIndex, setSliderValue, step]);

  // API 설정 함수
  const setApi = useCallback(
    (newApi: CarouselApi | null) => {
      if (!newApi) return;

      console.log("Carousel API received:", newApi);
      setApiState(newApi);
      setCarouselApi(newApi);

      // 이벤트 리스너 설정
      newApi.on("select", onSelectSlide);

      // 초기 인덱스 설정
      if (!initialized.current) {
        initialized.current = true;
        console.log("Setting initial carousel index");
        setTimeout(() => {
          setCurrentIndex(0);
          newApi.scrollTo(0);

          // 슬라이더 초기값 설정
          setSliderValue(0);
        }, 100);
      }

      // 컴포넌트 언마운트 시 이벤트 리스너 정리
      return () => {
        newApi.off("select", onSelectSlide);
      };
    },
    [onSelectSlide, setCarouselApi, setCurrentIndex, setSliderValue]
  );

  // 캐러셀 API가 변경될 때 정리 함수 실행
  useEffect(() => {
    if (!api) return;

    return () => {
      api.off("select", onSelectSlide);
    };
  }, [api, onSelectSlide]);

  const toggleLike = useCallback((eventId: number) => {
    setLikedEvents((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(eventId)) {
        newLiked.delete(eventId);
      } else {
        newLiked.add(eventId);
      }
      return newLiked;
    });
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center  h-[29.25rem] mt-[3.75rem] mb-[2.81rem]">
      <div className="relative w-full">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent className="w-full  -ml-0 flex items-center ">
            {SLIDES.map((slide, index) => (
              <CarouselItem
                key={slide.id}
                className="pl-0 basis-[75%]  transition-all duration-300 "
                style={{
                  height: index === currentIndex ? "29.25rem" : "20.0625rem",

                  transform: index === currentIndex ? "scale(1)" : "scale(0.9)",
                }}
              >
                <div className="p-1 h-full">
                  <Card
                    className={`h-full ${
                      index === currentIndex ? "bg-white" : "bg-[#9A9893]"
                    }`}
                  >
                    {index === currentIndex && (
                      <div className=" h-full w-full pb-[0.94rem]">
                        <CardContent className="flex flex-col  p-[0.94rem] ">
                          {index === SLIDES.length - 1 ? (
                            <div className="flex flex-col items-center justify-center h-full">
                              <h3 className="text-h4 mb-6">마지막 페이지</h3>
                              <button
                                className="bg-[#FE6363] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#e85555] transition-colors"
                                onClick={() =>
                                  console.log("추억 공유하러가기 clicked")
                                }
                              >
                                추억 공유하러가기
                              </button>
                            </div>
                          ) : (
                            <>
                              <img
                                className="rounded[0.875]"
                                src={slide.image}
                                alt={slide.title}
                              />
                              <div className="text-h5 mt-[0.94rem] ">
                                {slide.title}
                              </div>
                              <div className="text-body4  text-gray-3 mt-[0.31rem] h-[5.3125rem] overflow-hidden text-ellipsis">
                                This is event contents. This is event contents.
                                This is event contents. This is event contents.
                                This is event contents. This is event contents.
                                This is event contents. This is event contents.
                                This is e .. event contents. This is event
                                contents. This is e .. event contents. This is
                                event contents. This is e ..
                              </div>
                              <div className=" mt-[0.63rem] flex items-center justify-between gap-[0.31rem]">
                                <span className="text-caption1 text-gray-3">
                                  댓글 0개
                                </span>
                                <img
                                  src={
                                    likedEvents.has(slide.id)
                                      ? heartActive
                                      : heartDefault
                                  }
                                  alt="heart"
                                  onClick={() => toggleLike(slide.id)}
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
}
