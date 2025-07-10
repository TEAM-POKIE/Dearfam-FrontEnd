import { create } from "zustand";
import { type CarouselApi } from "@/components/ui/shadcn/carouselMain";

interface CarouselState {
  carouselApi: CarouselApi | null;
  currentIndex: number;
  totalSlides: number;

  setCarouselApi: (api: CarouselApi | null) => void;
  handleSelect: () => void;
  scrollToIndex: (index: number) => void;
  setTotalSlides: (count: number) => void;
  setCurrentIndex: (index: number) => void;
}

export const useCarouselStore = create<CarouselState>((set, get) => ({
  carouselApi: null,
  currentIndex: 0,
  totalSlides: 5,

  setCarouselApi: (api) => {
    set({ carouselApi: api });
    console.log("CarouselApi set:", api);
  },

  setCurrentIndex: (index) => {
    set({
      currentIndex: index,
    });
    console.log("CurrentIndex set:", index);
  },

  setTotalSlides: (count) => {
    set({ totalSlides: count });
    console.log("TotalSlides set:", count);
  },

  handleSelect: () => {
    const { carouselApi } = get();
    if (!carouselApi) {
      console.warn("Cannot handle select: carouselApi is null");
      return;
    }

    try {
      const index = carouselApi.selectedScrollSnap();
      console.log("Selected index:", index);
      set({ currentIndex: index });
    } catch (error) {
      console.error("Error handling selection:", error);
    }
  },

  scrollToIndex: (index) => {
    const { carouselApi } = get();
    if (!carouselApi) {
      console.warn("Cannot scroll: carouselApi is null");
      return;
    }

    try {
      console.log("Scrolling to index:", index);
      carouselApi.scrollTo(index);
      set({ currentIndex: index });
    } catch (error) {
      console.error("Error scrolling to index:", error);
    }
  },
}));
