import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { User } from "../../mocks/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
  login: (accessToken: string, refreshToken: string, user: User) => void; // refreshToken은 임시로 사용하지 않음
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    subscribeWithSelector((set) => ({
      // 상태
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 액션
      setUser: (user) =>
        set(
          {
            user,
            isAuthenticated: !!user,
            error: null,
          },
          false,
          "auth/setUser"
        ),

      setLoading: (isLoading) => set({ isLoading }, false, "auth/setLoading"),

      setError: (error) => set({ error }, false, "auth/setError"),

      logout: () =>
        set(
          {
            user: null,
            isAuthenticated: false,
            error: null,
          },
          false,
          "auth/logout"
        ),

      clearError: () => set({ error: null }, false, "auth/clearError"),

      login: (accessToken: string, refreshToken: string, user: User) =>
        set(
          {
            user,
            isAuthenticated: true,
            error: null,
          },
          false,
          "auth/Loginpage"
        ),
    }))
  )
);

// 선택적 구독을 위한 셀렉터들
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
