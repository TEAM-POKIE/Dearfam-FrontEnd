import { Routes, Route } from "react-router-dom";
import { Layout } from "../components/Layout";
import {
  HomePage,
  DailyPage,
  BookshelfPage,
  WritePage,
  GoodsPage,
  FamilyPage,
  StartPage,
  SettingPage,
} from "../pages";
import { FirstMakePage } from "../pages/Start/FirstMakePage";
import { MakeConfirmPage } from "../pages/Start/MakeConfirmPage";
import { LinkInPage } from "../pages/Start/LinkInPage";
import { KakaoInPage } from "../pages/Start/KakaoInPage";
import { NameChangePage } from "../pages/Setting/NameChangePage";
import { MemoryDetailPage } from "@/pages/Home/MemoryDetailPage";

/**
 * 애플리케이션의 라우트 구성을 정의합니다.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="memoryDetailPage" element={<MemoryDetailPage />} />
        <Route path="daily" element={<DailyPage />} />
        <Route path="bookshelf" element={<BookshelfPage />} />
        <Route path="write" element={<WritePage />} />
        <Route path="goods" element={<GoodsPage />} />
        <Route path="family" element={<FamilyPage />} />
      </Route>
      <Route path="/StartPage" element={<StartPage />} />
      <Route path="/FirstMakePage" element={<FirstMakePage />} />
      <Route path="/MakeConfirmPage" element={<MakeConfirmPage />} />
      <Route path="/LinkInPage" element={<LinkInPage />} />
      <Route path="/KakaoInPage" element={<KakaoInPage />} />
      <Route path="/SettingPage" element={<SettingPage />} />
      <Route path="/NameChangePage" element={<NameChangePage />} />
    </Routes>
  );
}
