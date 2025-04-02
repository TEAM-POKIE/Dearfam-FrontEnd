import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BottomNavbar, NavItem } from "./BottomNavbar";
import { HeaderBar, HeaderMode } from "./HeaderBar";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
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

  // 헤더 모드 변경 핸들러
  const handleHeaderModeChange = (mode: HeaderMode) => {
    setHeaderMode(mode);
    // 설정 아이콘 클릭 시 SettingPage로 이동
    if (mode === "setting") {
      navigate('/SettingPage');
    }
  };

  return (
    <div className="mobile-container flex flex-col">
      <HeaderBar mode={headerMode} onModeChange={handleHeaderModeChange} />

      <main className="flex-grow overflow-y-auto pb-[clamp(3.75rem,14.4vw,5.625rem)]">
        <Outlet />
      </main>

      <div className="absolute bottom-0 left-0 right-0 w-full">
        <BottomNavbar activeItem={getActiveNavItem()} />
      </div>
    </div>
  );
}
