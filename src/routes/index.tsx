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
import { StartPage } from "../pages/StartPage";
import { FirstMakePage } from "../pages/FirstMakePage";
import { LinkInPage } from "../pages/LinkInPage";
import { SettingPage } from "../pages/SettingPage";
import { NameChangePage } from "../pages/NameChangePage";


/**
 * 애플리케이션의 라우트 구성을 정의합니다.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="daily" element={<DailyPage />} />
        <Route path="bookshelf" element={<BookshelfPage />} />
        <Route path="write" element={<WritePage />} />
        <Route path="goods" element={<GoodsPage />} />
        <Route path="family" element={<FamilyPage />} />
      </Route>
      <Route path="/StartPage" element={<StartPage />} />
      <Route path="/FirstMakePage" element={<FirstMakePage />} />
      <Route path="/LinkInPage" element={<LinkInPage />} />
      <Route path="/SettingPage" element={<SettingPage />} />
      <Route path="/NameChangePage" element={<NameChangePage />} />
    </Routes>
  );
}
