import { Routes, Route, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AppLayout } from "../AppLayout";

// 동적 임포트를 통한 코드 스플리팅
const HomePage = lazy(() =>
  import("../pages").then((module) => ({ default: module.HomePage }))
);
const DailyPage = lazy(() =>
  import("../pages").then((module) => ({ default: module.DailyPage }))
);
const BookshelfPage = lazy(() =>
  import("../pages").then((module) => ({ default: module.BookshelfPage }))
);
const WritePage = lazy(() =>
  import("../pages").then((module) => ({ default: module.WritePage }))
);
const GoodsPage = lazy(() =>
  import("../pages").then((module) => ({ default: module.GoodsPage }))
);
const FamilyPage = lazy(() =>
  import("../pages").then((module) => ({ default: module.FamilyPage }))
);
const StartPage = lazy(() =>
  import("../pages").then((module) => ({ default: module.StartPage }))
);
const SettingPage = lazy(() =>
  import("../pages").then((module) => ({ default: module.SettingPage }))
);

// Start 관련 페이지들
const FirstMakePage = lazy(() =>
  import("../pages/Start/FirstMakePage").then((module) => ({
    default: module.FirstMakePage,
  }))
);
const MakeConfirmPage = lazy(() =>
  import("../pages/Start/MakeConfirmPage").then((module) => ({
    default: module.MakeConfirmPage,
  }))
);
const LinkInPage = lazy(() =>
  import("../pages/Start/LinkInPage").then((module) => ({
    default: module.LinkInPage,
  }))
);
const KakaoInPage = lazy(() =>
  import("../pages/Start/KakaoInPage").then((module) => ({
    default: module.KakaoInPage,
  }))
);

// Setting 관련 페이지들
const NameChangePage = lazy(() =>
  import("../pages/Setting/NameChangePage").then((module) => ({
    default: module.NameChangePage,
  }))
);

// Home 관련 페이지들
const MemoryDetailPage = lazy(() =>
  import("@/pages/Home/MemoryDetailPage").then((module) => ({
    default: module.MemoryDetailPage,
  }))
);

// 로딩 컴포넌트
const PageLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

function Layout() {
  return (
    <AppLayout>
      <Suspense fallback={<PageLoadingSpinner />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
}

/**
 * 애플리케이션의 라우트 구성을 정의합니다.
 * 모든 페이지는 동적 임포트를 통해 코드 스플리팅이 적용되었습니다.
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
      <Route
        path="/StartPage"
        element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <StartPage />
          </Suspense>
        }
      />
      <Route
        path="/FirstMakePage"
        element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <FirstMakePage />
          </Suspense>
        }
      />
      <Route
        path="/MakeConfirmPage"
        element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <MakeConfirmPage />
          </Suspense>
        }
      />
      <Route
        path="/LinkInPage"
        element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <LinkInPage />
          </Suspense>
        }
      />
      <Route
        path="/KakaoInPage"
        element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <KakaoInPage />
          </Suspense>
        }
      />
      <Route
        path="/SettingPage"
        element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <SettingPage />
          </Suspense>
        }
      />
      <Route
        path="/NameChangePage"
        element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <NameChangePage />
          </Suspense>
        }
      />
    </Routes>
  );
}
