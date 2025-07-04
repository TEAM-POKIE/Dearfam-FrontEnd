import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Outlet } from "react-router-dom";
import { AppLayout } from "../AppLayout";
import { HomePage, DailyPage, BookshelfPage, WritePage, GoodsPage, FamilyPage, StartPage, SettingPage, } from "../pages";
import { FirstMakePage } from "../pages/Start/FirstMakePage";
import { MakeConfirmPage } from "../pages/Start/MakeConfirmPage";
import { LinkInPage } from "../pages/Start/LinkInPage";
import { KakaoInPage } from "../pages/Start/KakaoInPage";
import { NameChangePage } from "../pages/Setting/NameChangePage";
import { MemoryDetailPage } from "@/pages/Home/MemoryDetailPage";
function Layout() {
    return (_jsx(AppLayout, { children: _jsx(Outlet, {}) }));
}
/**
 * 애플리케이션의 라우트 구성을 정의합니다.
 */
export function AppRoutes() {
    return (_jsxs(Routes, { children: [_jsxs(Route, { path: "/", element: _jsx(Layout, {}), children: [_jsx(Route, { index: true, element: _jsx(HomePage, {}) }), _jsx(Route, { path: "memoryDetailPage", element: _jsx(MemoryDetailPage, {}) }), _jsx(Route, { path: "daily", element: _jsx(DailyPage, {}) }), _jsx(Route, { path: "bookshelf", element: _jsx(BookshelfPage, {}) }), _jsx(Route, { path: "write", element: _jsx(WritePage, {}) }), _jsx(Route, { path: "goods", element: _jsx(GoodsPage, {}) }), _jsx(Route, { path: "family", element: _jsx(FamilyPage, {}) })] }), _jsx(Route, { path: "/StartPage", element: _jsx(StartPage, {}) }), _jsx(Route, { path: "/FirstMakePage", element: _jsx(FirstMakePage, {}) }), _jsx(Route, { path: "/MakeConfirmPage", element: _jsx(MakeConfirmPage, {}) }), _jsx(Route, { path: "/LinkInPage", element: _jsx(LinkInPage, {}) }), _jsx(Route, { path: "/KakaoInPage", element: _jsx(KakaoInPage, {}) }), _jsx(Route, { path: "/SettingPage", element: _jsx(SettingPage, {}) }), _jsx(Route, { path: "/NameChangePage", element: _jsx(NameChangePage, {}) })] }));
}
