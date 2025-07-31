import { create } from "zustand";
import { type CarouselApi } from "@/components/ui/shadcn/carouselMain";

interface CarouselState {
  carouselApi: CarouselApi | null;
  currentIndex: number;
  totalSlides: number;
  shouldRememberIndex: boolean;

  setCarouselApi: (api: CarouselApi | null) => void;
  handleSelect: () => void;
  scrollToIndex: (index: number) => void;
  setTotalSlides: (count: number) => void;
  setCurrentIndex: (index: number) => void;
  saveIndexForDetailPage: (index: number) => void;
  resetIndex: () => void;
}

export const useCarouselStore = create<CarouselState>((set, get) => ({
  carouselApi: null,
  currentIndex: 0,
  totalSlides: 5,
  shouldRememberIndex: false,

  setCarouselApi: (api) => {
    set({ carouselApi: api });
  },

  setCurrentIndex: (index) => {
    set({
      currentIndex: index,
    });
  },

  setTotalSlides: (count) => {
    set({ totalSlides: count });
  },

  saveIndexForDetailPage: (index) => {
    set({
      currentIndex: index,
      shouldRememberIndex: true,
    });
  },

  resetIndex: () => {
    set({
      currentIndex: 0,
      shouldRememberIndex: false,
    });
  },

  handleSelect: () => {
    const { carouselApi } = get();
    if (!carouselApi) {
      console.warn("Cannot handle select: carouselApi is null");
      return;
    }

    try {
      const index = carouselApi.selectedScrollSnap();

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
      carouselApi.scrollTo(index);
      set({ currentIndex: index });
    } catch (error) {
      console.error("Error scrolling to index:", error);
    }
  },
}));
