import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import {
  HomePage,
  DailyPage,
  BookshelfPage,
  WritePage,
  GoodsPage,
  FamilyPage,
} from "./pages";

// TanStack Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="daily" element={<DailyPage />} />
            <Route path="bookshelf" element={<BookshelfPage />} />
            <Route path="write" element={<WritePage />} />
            <Route path="goods" element={<GoodsPage />} />
            <Route path="family" element={<FamilyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* 개발 환경에서만 ReactQuery 디버깅 도구 표시 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
