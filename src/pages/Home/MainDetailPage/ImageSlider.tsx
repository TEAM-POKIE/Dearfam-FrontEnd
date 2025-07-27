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
import { MemoryDetail } from "@/data/api/memory-post/type";

interface ImageSliderProps {
  images: MemoryDetail["data"]["imageUrls"];
}

export const ImageSlider = ({ images }: ImageSliderProps) => {
  // 컴포넌트 구현
};
