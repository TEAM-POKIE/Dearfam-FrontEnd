import React, { useEffect, useState, useCallback } from "react";
import imageNotFound from "../../../assets/image/section2/image_not_found_270x280.svg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
  type CarouselApi,
} from "../../../components/ui/shadcn/carouselDetail";
import { OptimizedImage } from "../../../components/ui/OptimizedImage";
import { MemoryDetail } from "@/data/api/memory-post/type";

interface ImageSliderProps {
  data: MemoryDetail["data"];
}

export const ImageSlider = ({ data }: ImageSliderProps) => {
  const [api, setApi] = useState<CarouselApi | null>(null);

  const onSelect = useCallback(() => {
    if (!api) return;
  }, [api]);

  useEffect(() => {
    if (!api) return;
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  if (!data?.imageUrls?.length) {
    return (
      <div className="w-full h-[24.375rem] flex items-center justify-center">
        <img src={imageNotFound} alt="이미지 없음" className="w-full" />
      </div>
    );
  }

  return (
    <div className="w-[24.375rem] h-[24.375rem] mt-[0.06rem] bg-white">
      <Carousel className="w-[24.375rem] h-[24.375rem] flex  " setApi={setApi}>
        <CarouselContent className="w-[24.375rem] h-[24.375rem] ">
          {data.imageUrls.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="h-full flex items-center justify-center w-full  ">
                <OptimizedImage
                  src={image.imageUrl}
                  alt={`이미지 ${index + 1}`}
                  className="w-full max-h-[24.375rem] max-w-full object-contain"
                  lazy={index > 0} // 첫 번째 이미지는 eager 로딩
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-[0.62rem] left-1/2 -translate-x-1/2 z-10">
          <CarouselDots />
        </div>
      </Carousel>
    </div>
  );
};
