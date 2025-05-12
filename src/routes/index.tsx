import { Routes, Route } from "react-router-dom";
import { Layout } from "../components/Layout";
import {
  HomePage,
  DailyPage,
  BookshelfPage,
  WritePage,
  GoodsPage,
  FamilyPage,
} from "../pages";
import { StartPage } from "../pages/1.StartPage/StartPage";
import { FirstMakePage } from "../pages/1.StartPage/FirstMakePage";
import { MakeConfirmPage } from "../pages/1.StartPage/MakeConfirmPage";
import { LinkInPage } from "../pages/1.StartPage/LinkInPage";
import { KakaoInPage } from "../pages/1.StartPage/KakaoInPage";
import { SettingPage } from "../pages/8.SettingPage/SettingPage";
import { NameChangePage } from "../pages/8.SettingPage/NameChangePage";
import { MemoryDetailPage } from "@/pages/main/MemoryDetailPage";

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
