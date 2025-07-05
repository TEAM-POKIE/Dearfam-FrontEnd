import { create } from "zustand";
import { useCarouselStore } from "./carouselStore";

interface SliderState {
  sliderValue: number;
  step: number;

  setSliderValue: (value: number) => void;
  handleSliderChange: (value: number[]) => void;
  updateStep: () => void;
}

export const useSliderStore = create<SliderState>((set, get) => ({
  sliderValue: 0,
  step: 25,

  setSliderValue: (value) => {
    set({ sliderValue: value });
    console.log("Slider value set:", value);
  },

  updateStep: () => {
    const { totalSlides } = useCarouselStore.getState();
    if (totalSlides <= 1) return;

    const newStep = 100 / (totalSlides - 1);
    set({ step: newStep });
    console.log("Step updated:", newStep);
  },

  handleSliderChange: (value) => {
    try {
      const { step } = get();
      const index = Math.round(value[0] / step);

      console.log("Slider changed to index:", index);

      // 먼저 슬라이더 값 업데이트
      set({
        sliderValue: index * step,
      });

      // 현재 캐러셀 인덱스와 다를 경우에만 변경 요청
      const { currentIndex } = useCarouselStore.getState();
      if (currentIndex !== index) {
        // 캐러셀 인덱스 업데이트 및 스크롤
        useCarouselStore.getState().scrollToIndex(index);
      }
    } catch (error) {
      console.error("Error handling slider change:", error);
    }
  },
}));
