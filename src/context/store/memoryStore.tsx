import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface MemoryStore {
  totalPostCount: number;
  setTotalPostCount: (count: number) => void;
}

export const useMemoryStore = create<MemoryStore>()(
  devtools(
    (set) => ({
      totalPostCount: 0,
      setTotalPostCount: (count) => set({ totalPostCount: count }, false, "setTotalPostCount"),
    }),
    { name: "memory-store" }
  )
);