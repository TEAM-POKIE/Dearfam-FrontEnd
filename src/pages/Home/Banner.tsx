import banner1 from "../../assets/image/section2/banner_1.svg";
import banner2 from "../../assets/image/section2/banner_2.svg";
import { Carousel, CarouselContent } from "@/components/ui/shadcn/carouselMain";
import { CarouselItem } from "@/components/ui/shadcn/carouselMain";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { useNavigate } from "react-router-dom";

export const Banner = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );
  const navigate = useNavigate();
  return (
    <Carousel
      className="mt-[1.25rem]"
      plugins={[plugin.current]}
      opts={{ loop: true }}
    >
      <CarouselContent>
        <CarouselItem className="flex justify-center items-center ">
          <img
            src={banner1}
            alt="banner1"
            onClick={() => {
              navigate("/goods");
            }}
          />
        </CarouselItem>
        <CarouselItem className="flex justify-center items-center">
          <img
            src={banner2}
            alt="banner2"
            onClick={() => {
              navigate("/goods");
            }}
          />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};
