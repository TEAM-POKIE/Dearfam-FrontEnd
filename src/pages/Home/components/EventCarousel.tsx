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
import BasicButton from "@/components/BasicButton";
import { useCarouselStore } from "@/context/store/carouselStore";
import { useSliderStore } from "@/context/store/sliderStore";
import { useNavigate } from "react-router-dom";

interface EventItem {
  id: number;
  title: string;
  image: string;
  content?: string;
}

interface EventCarouselProps {
  items: EventItem[];
  showLastItem?: boolean;
  onLike?: (id: number) => void;
  likedEvents?: Set<number>;
}

export const EventCarousel: React.FC<EventCarouselProps> = ({
  items,
  showLastItem = true,
  onLike,
  likedEvents = new Set(),
}) => {
  const navigate = useNavigate();
  const initialized = useRef(false);
  const [api, setApiState] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    setTotalSlides,
    setCurrentIndex: setStoreCurrentIndex,
    setCarouselApi,
  } = useCarouselStore();
  const { setSliderValue, step } = useSliderStore();

  // 슬라이드 개수 설정
  useEffect(() => {
    setTotalSlides(items.length);
  }, [items.length, setTotalSlides]);

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

  return (
    <div className="w-full flex flex-col justify-center items-center h-[29.25rem] mt-[3.75rem] mb-[2.81rem]">
      <div className="relative w-full">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent className="w-full -mx-0 flex items-center gap-x-2 h-full">
            {items.map((item, index) => (
              <CarouselItem
                key={item.id}
                className={`basis-[76.9%] transition-all duration-300 
                  ${index === 0 ? "ml-[2.81rem] pl-0" : ""}
                  ${index === items.length - 1 ? "mr-[2.81rem]" : ""}
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
                            index === items.length - 1
                              ? "px-[0.94rem] pt-[2.5rem] pb-[0.88rem]"
                              : "p-[0.94rem]"
                          }`}
                        >
                          {index === items.length - 1 && showLastItem ? (
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
                              <div className="mt-[0.63rem] flex items-center justify-between gap-[0.31rem]">
                                <span className="text-caption1 text-gray-3">
                                  댓글 0개
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
                                    onLike?.(item.id);
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
