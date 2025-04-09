import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BottomNavbar, NavItem } from "./BottomNavbar";
import { HeaderBar, PageType } from "./HeaderBar";
import { useHeaderStore } from "@/lib/store/headerStore";

export function Layout() {
  const location = useLocation();
  const { isWritePage, setPageType, setIsWritePage } = useHeaderStore();

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

  // 경로 변경 시 페이지 타입과 작성 페이지 여부 업데이트
  useEffect(() => {
    const path = location.pathname;

    // 현재 페이지 타입 결정
    let currentPageType: PageType = "home";
    if (path === "/") currentPageType = "home";
    else if (path.includes("/bookshelf")) currentPageType = "bookshelf";
    else if (path.includes("/goods")) currentPageType = "goods";
    else if (path.includes("/family")) currentPageType = "family";

    // 페이지 타입 업데이트
    setPageType(currentPageType);

    // 작성 페이지 여부 업데이트
    setIsWritePage(path.includes("/write"));
  }, [location.pathname, setPageType, setIsWritePage]);

  return (
    <div className="mobile-container flex flex-col ">
      {!isWritePage && <HeaderBar />}

      <main className="flex-grow overflow-y-auto pb-[clamp(3.75rem,14.4vw,5.625rem)] ">
        <Outlet />
      </main>

      <div className="absolute bottom-0 left-0 right-0 w-full  ">
        <BottomNavbar activeItem={getActiveNavItem()} />
      </div>
    </div>
  );
}
