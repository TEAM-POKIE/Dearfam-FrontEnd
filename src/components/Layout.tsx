import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { BottomNavbar, NavItem } from "./BottomNavbar";
import { HeaderBar, HeaderMode } from "./HeaderBar";

export function Layout() {
  const location = useLocation();
  const [headerMode, setHeaderMode] = useState<HeaderMode>("default");

  // 현재 경로에 따라 활성 네비게이션 항목 결정
  const getActiveNavItem = (): NavItem => {
    const path = location.pathname;

    if (path === "/") return "home";
    if (path.includes("/bookshelf")) return "bookshelf";
    if (path.includes("/write")) return "write";
    if (path.includes("/goods")) return "goods";
    if (path.includes("/family")) return "family";

    return "home"; // 기본값
  };

  return (
    <div className="mobile-container flex flex-col">
      <HeaderBar mode={headerMode} onModeChange={setHeaderMode} />

      <main className="flex-grow overflow-y-auto ">
        <Outlet />
      </main>

      <div className="bottom-nav-container ">
        <BottomNavbar activeItem={getActiveNavItem()} />
      </div>
    </div>
  );
}
