import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BottomNavbar, NavItem } from "./components/BottomNavbar";
import { HeaderBar, PageType } from "./components/HeaderBar";
import { useHeaderStore } from "@/context/store/headerStore";
import { useGetFamilyMembers } from "@/data/api/family/family";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isWritePage, setPageType, setIsWritePage, setMode } =
    useHeaderStore();
  const path = location.pathname;

  // 앱 시작 시 가족 정보 초기화 (한 번만 실행)
  useGetFamilyMembers();

  // 현재 경로에 따라 활성 네비게이션 항목 결정
  const getActiveNavItem = (): NavItem => {
    if (path === "/" || path === "/home") return "home";
    if (path.includes("/bookshelf")) return "bookshelf";
    if (path.includes("/write")) return "write";
    if (path.includes("/goods")) return "goods";
    if (path.includes("/family")) return "family";

    return "home"; // 기본값
  };

  // 경로 변경 시 페이지 타입과 작성 페이지 여부 업데이트
  useEffect(() => {
    // 현재 페이지 타입 결정
    let currentPageType: PageType = "home";
    if (path === "/" || path === "/home") {
      currentPageType = "home";
      // Home 페이지로 돌아올 때 기본 모드를 slider로 설정
      setMode("slider");
    } else if (path.includes("/bookshelf")) {
      currentPageType = "bookshelf";
    } else if (path.includes("/goods")) {
      currentPageType = "goods";
    } else if (path.includes("/family")) {
      currentPageType = "family";
    }

    // 페이지 타입 업데이트
    setPageType(currentPageType);

    // 작성 페이지 여부 업데이트
    setIsWritePage(path.includes("/write"));
  }, [location.pathname, setPageType, setIsWritePage, setMode]);

  return (
    <div className="mobile-container flex flex-col align-middle m-auto">
      {!isWritePage &&
        !path.includes("/memoryDetailPage") &&
        !path.includes("/edit") && <HeaderBar />}
      <main className="flex-grow overflow-y-auto  [&::-webkit-scrollbar]:hidden ">
        {children}
      </main>
      {!path.includes("/memoryDetail") &&
        !path.includes("/write") &&
        !path.includes("/edit") && (
          <div className=" fixed bottom-0 left-0 right-0  m-auto w-[24.375rem] ">
            <BottomNavbar activeItem={getActiveNavItem()} />
          </div>
        )}
    </div>
  );
}
