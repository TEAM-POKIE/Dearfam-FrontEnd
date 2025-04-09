import { create } from "zustand";
import { type CarouselApi } from "@/components/ui/carousel";

interface HomeState {
  // 상태 정의
  loading: boolean;
  error: string | null;

  // 슬라이더 관련 상태
  carouselApi: CarouselApi | null;
  currentIndex: number;
  sliderValue: number;
  totalSlides: number;

  // 액션 정의
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 슬라이더 관련 액션
  setCarouselApi: (api: CarouselApi | null) => void;
  handleSelect: () => void;
  handleSliderChange: (value: number[]) => void;
  scrollToIndex: (index: number) => void;
  setTotalSlides: (count: number) => void;
  setCurrentIndex: (index: number) => void;
}

export const useHomeViewModel = create<HomeState>((set, get) => ({
  // 초기 상태
  loading: false,
  error: null,
  carouselApi: null,
  currentIndex: 0,
  sliderValue: 0,
  totalSlides: 5,

  // 액션
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // 슬라이더 관련 액션
  setCarouselApi: (api) => {
    set({ carouselApi: api });
    console.log("CarouselApi set:", api);
  },

  setCurrentIndex: (index) => {
    set({
      currentIndex: index,
      sliderValue: index * 25,
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
      set({
        currentIndex: index,
        sliderValue: index * 25, // 슬라이더 값 업데이트 (25 단위)
      });
    } catch (error) {
      console.error("Error handling selection:", error);
    }
  },

  handleSliderChange: (value) => {
    try {
      const { totalSlides } = get();
      const stepValue = 100 / (totalSlides - 1);
      const index = Math.round(value[0] / stepValue);
      console.log("Slider changed to index:", index);

      set({
        sliderValue: index * stepValue,
        currentIndex: index,
      });
      get().scrollToIndex(index);
    } catch (error) {
      console.error("Error handling slider change:", error);
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
    } catch (error) {
      console.error("Error scrolling to index:", error);
    }
  },
}));
