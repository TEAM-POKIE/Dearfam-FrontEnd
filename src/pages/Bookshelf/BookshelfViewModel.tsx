import { create } from "zustand";

interface BookshelfItem {
  id: string;
  type: string;
  title: string;
  imageUrl: string;
}

interface BookshelfState {
  // 상태 정의
  items: BookshelfItem[];
  loading: boolean;
  error: string | null;

  // 액션 정의
  setItems: (items: BookshelfItem[]) => void;
  addItem: (item: BookshelfItem) => void;
  removeItem: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 샘플 데이터 로드 (실제로는 API 호출로 대체)
  loadSampleData: () => void;
}

export const useBookshelfViewModel = create<BookshelfState>((set) => ({
  // 초기 상태
  items: [],
  loading: false,
  error: null,

  // 액션
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // 샘플 데이터 로드
  loadSampleData: () => {
    set({ loading: true, error: null });

    // 실제로는 API 호출로 대체
    setTimeout(() => {
      const sampleItems: BookshelfItem[] = [
        {
          id: "1",
          type: "book",
          title: "나의 첫 번째 책",
          imageUrl: "/book1.jpg",
        },
        {
          id: "2",
          type: "photo",
          title: "가족 사진첩",
          imageUrl: "/photo1.jpg",
        },
        {
          id: "3",
          type: "video",
          title: "여행 영상",
          imageUrl: "/video1.jpg",
        },
        {
          id: "4",
          type: "calendar",
          title: "2023년 달력",
          imageUrl: "/calendar1.jpg",
        },
        {
          id: "5",
          type: "note",
          title: "메모장",
          imageUrl: "/note1.jpg",
        },
        {
          id: "6",
          type: "collection",
          title: "컬렉션",
          imageUrl: "/collection1.jpg",
        },
      ];

      set({ items: sampleItems, loading: false });
    }, 500);
  },
}));
