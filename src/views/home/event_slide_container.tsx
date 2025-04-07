import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";

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
  { id: 1, title: "Event Title 1" },
  { id: 2, title: "Event Title 2" },
  { id: 3, title: "Event Title 3" },
  { id: 4, title: "Event Title 4" },
  { id: 5, title: "Event Title 5" },
];

export function EventSlideContainer() {
  const initialized = useRef(false);
  const [api, setApiState] = useState<CarouselApi | null>(null);

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

  return (
    <div className="w-full flex flex-col justify-center items-center gap-8 h-[29.25rem]">
      <div className="relative w-full max-w-[390px]">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent className="w-full rounded-[0.875rem] -ml-0 flex items-center ">
            {SLIDES.map((slide, index) => (
              <CarouselItem
                key={slide.id}
                className="pl-0 basis-[85%] transition-all duration-300 first:pl-0"
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
                    <CardContent className="flex aspect-square items-center justify-center p-6 h-full">
                      <div className="text-2xl font-semibold">
                        {slide.title}
                      </div>
                    </CardContent>
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
