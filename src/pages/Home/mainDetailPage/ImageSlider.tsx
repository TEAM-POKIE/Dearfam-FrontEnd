import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import imageNotFound from "../../../assets/image/section2/image_not_found_270x280.svg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
  type CarouselApi,
} from "../../../components/ui/shadcn/carouselDetail";

const IMAGES = [
  { id: 1, src: imageNotFound },
  { id: 2, src: imageNotFound },
  { id: 3, src: imageNotFound },
];

export function ImageSlider() {
  const [api, setApi] = useState<CarouselApi | null>(null);

  const onSelect = useCallback(() => {
    if (!api) return;
    // 선택된 슬라이드 인덱스를 확인하는 로직 (필요시 추가)
  }, [api]);

  useEffect(() => {
    if (!api) return;
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <Carousel className="w-full relative" setApi={setApi}>
      <CarouselContent className="w-full">
        {IMAGES.map((image) => (
          <CarouselItem key={image.id} className="flex justify-center">
            <img src={image.src} alt="이미지" className="w-full" />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="absolute bottom-[0.62rem] left-1/2 -translate-x-1/2 z-10">
        <CarouselDots />
      </div>
    </Carousel>
  );
}
