import { create } from "zustand";

interface HomeState {
  // 상태 정의
  loading: boolean;
  error: string | null;

  // 액션 정의
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useHomeViewModel = create<HomeState>((set) => ({
  // 초기 상태
  loading: false,
  error: null,

  // 액션
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
