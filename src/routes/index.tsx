import { Routes, Route, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AppLayout } from "../AppLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { PictureToVideo } from "@/pages/Goods/PictureToVideo";
import { PictureDiary } from "@/pages/Goods/PictureDiary";
import { VideoPromptPage } from "@/pages/Goods/VideoPromptPage";
import { VideoProcessingPage } from "@/pages/Goods/VideoProcessingPage";
import { VideoResultPage } from "@/pages/Goods/VideoResultPage";

import { SelectDiary } from "@/pages/Goods/diary/SelectDiary";
import { DiaryResult } from "@/pages/Goods/diary/DiaryResult";
import { VideoGenerationStep } from "@/pages/Goods/video/VideoGenerationStep";

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
const EditPage = lazy(() =>
  import("../pages/Edit").then((module) => ({ default: module.EditPage }))
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

const KakaoCallback = lazy(() =>
  import("../components/KakaoCallback").then((module) => ({
    default: module.KakaoCallback,
  }))
);
const LoginPage = lazy(() =>
  import("../pages/Start/LoginPage").then((module) => ({
    default: module.default,
  }))
);
const SplashPage = lazy(() =>
  import("../pages/Start/SplashPage").then((module) => ({
    default: module.SplashPage,
  }))
);

const NameChangePage = lazy(() =>
  import("../pages/Setting/NameChangePage").then((module) => ({
    default: module.NameChangePage,
  }))
);

const MemoryDetailPage = lazy(() =>
  import("@/pages/Home/MemoryDetailPage").then((module) => ({
    default: module.MemoryDetailPage,
  }))
);
const PageLoadingSpinner = () => <div className="min-h-screen bg-bg-1"></div>;

function Layout() {
  return (
    <AppLayout>
      <Suspense fallback={<PageLoadingSpinner />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* 1. SplashPage - AuthGuard 적용 */}
      <Route path="/" element={<SplashPage />} />
      
      {/* Home routes */}
      <Route path="/home" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="memoryDetailPage/:postId" element={<MemoryDetailPage />} />
      </Route>

      {/* Daily routes */}
      <Route path="/daily" element={<Layout />}>
        <Route index element={<DailyPage />} />
      </Route>

      {/* Bookshelf routes */}
      <Route path="/bookshelf" element={<Layout />}>
        <Route index element={<BookshelfPage />} />
      </Route>

      {/* Write routes */}
      <Route path="/write" element={<Layout />}>
        <Route index element={<WritePage />} />
        <Route path="edit/:postId" element={<EditPage />} />
      </Route>

      {/* Goods routes */}
      <Route path="/goods" element={<Layout />}>
        <Route index element={<GoodsPage />} />
        <Route path="pictureToVideo" element={<PictureToVideo />} />
        <Route path="videoGeneration" element={<PictureToVideo />} />
        <Route path="videoGeneration/step" element={<VideoGenerationStep />} />
        <Route path="videoPrompt" element={<VideoPromptPage />} />
        <Route path="videoProcessing" element={<VideoProcessingPage />} />
        <Route path="videoResult" element={<VideoResultPage />} />
        <Route path="diary" element={<PictureDiary />} />
        <Route path="diary/select" element={<SelectDiary />} />
        <Route path="diary/result" element={<DiaryResult />} />
      </Route>

      {/* Family routes */}
      <Route path="/family" element={<Layout />}>
        <Route index element={<FamilyPage />} />
      </Route>

      {/* Setting routes */}
      <Route path="/setting" element={<Layout />}>
        <Route index element={<SettingPage />} />
        <Route path="name-change" element={<NameChangePage />} />
      </Route>
      <Route
        path="/LoginPage"
        element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <LoginPage />
          </Suspense>
        }
      />

      <Route
        path="/Start"
        element={
          <AuthGuard mode="nofam">
            {" "}
            {/* AuthGuard 적용 */}
            <Suspense fallback={<PageLoadingSpinner />}>
              <StartPage />
            </Suspense>
          </AuthGuard>
        }
      />
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
        path="/kakao/callback"
        element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <KakaoCallback />
          </Suspense>
        }
      />
      <Route
        path="/auth/kakao/callback"
        element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <KakaoCallback />
          </Suspense>
        }
      />
      <Route
        path="/SplashPage"
        element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <SplashPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
