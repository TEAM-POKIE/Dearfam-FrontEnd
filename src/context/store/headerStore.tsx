import { create } from "zustand";
import { HeaderMode, PageType } from "@/components/HeaderBar";

interface HeaderState {
  mode: HeaderMode;
  pageType: PageType;
  isWritePage: boolean;

  setMode: (mode: HeaderMode) => void;
  setPageType: (pageType: PageType) => void;
  setIsWritePage: (isWritePage: boolean) => void;
  handleIconClick: (newMode: HeaderMode) => void;
  resetToDefault: () => void;
}

export const useHeaderStore = create<HeaderState>((set, get) => ({
  mode: "slider",
  pageType: "home",
  isWritePage: false,

  setMode: (mode) => {
    // 유효한 모드인지 확인
    if (mode === "gallery" || mode === "slider") {
      set({ mode });
    } else {
      console.warn(`Invalid mode: ${mode}, defaulting to slider`);
      set({ mode: "slider" });
    }
  },

  setPageType: (pageType) => set({ pageType }),

  setIsWritePage: (isWritePage) => set({ isWritePage }),

  handleIconClick: (newMode) => {
    const { mode } = get();

    if (newMode === "gallery" || newMode === "slider") {
      // gallery와 slider는 토글 형식으로 작동
      const toggledMode = mode === "gallery" ? "slider" : "gallery";
      set({ mode: toggledMode });
    } else {
      // 다른 모드는 그냥 설정
      set({ mode: newMode });
    }
  },

  resetToDefault: () => {
    set({
      mode: "slider",
      pageType: "home",
      isWritePage: false,
    });
  },
}));
