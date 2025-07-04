import { create } from "zustand";
export const useHeaderStore = create((set, get) => ({
    mode: "slider",
    pageType: "home",
    isWritePage: false,
    setMode: (mode) => set({ mode }),
    setPageType: (pageType) => set({ pageType }),
    setIsWritePage: (isWritePage) => set({ isWritePage }),
    handleIconClick: (newMode) => {
        const { mode } = get();
        if (newMode === "gallery" || newMode === "slider") {
            // gallery와 slider는 토글 형식으로 작동
            const toggledMode = mode === "gallery" ? "slider" : "gallery";
            set({ mode: toggledMode });
        }
        else {
            // 다른 모드는 그냥 설정
            set({ mode: newMode });
        }
    },
}));
