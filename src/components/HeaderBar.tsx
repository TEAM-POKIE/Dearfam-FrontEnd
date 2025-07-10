import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Bug, ChevronDown } from "lucide-react";
import settingIcon from "../assets/image/icon_setting.svg";
import galleryIcon from "../assets/image/icon_gallery.svg";
import addIcon from "../assets/image/icon_add.svg";
import urlIcon from "../assets/image/icon_url.svg";
import sliderIcon from "../assets/image/icon_slider.svg";
import logo from "../assets/image/dearfam_logo_default.svg";
import { useHeaderStore } from "@/context/store/headerStore";

// 헤더바 모드 타입 정의
export type HeaderMode =
  | "gallery"
  | "slider"
  | "url"
  | "add"
  | "setting"
  | "debug"
  | "default";

// 페이지 타입 정의
export type PageType = "home" | "bookshelf" | "goods" | "family";

// 설정 아이콘
const SettingIcon = () => <img src={settingIcon} alt="setting" />;

// 추가 아이콘
const AddIcon = () => <img src={addIcon} alt="add" />;

// 갤러리 아이콘
const GalleryIcon = () => <img src={galleryIcon} alt="gallery" />;

// URL 아이콘
const UrlIcon = () => <img src={urlIcon} alt="url" />;
const SliderIcon = () => <img src={sliderIcon} alt="slider" />;

// 디버그 아이콘
const DebugIcon = () => <Bug size={20} />;

export function HeaderBar() {
  const navigate = useNavigate();
  const { mode, pageType, handleIconClick } = useHeaderStore();
  const [isDebugDropdownOpen, setIsDebugDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // 현재 모드에 따라 다른 스타일 적용
  const getIconStyle = (iconMode: HeaderMode) => {
    return mode === iconMode ? "text-[#F5751E]" : "text-[#9A9893]";
  };

  // 설정 페이지로 이동
  const handleSettingClick = () => {
    handleIconClick("setting");
    navigate("/SettingPage");
  };

  // 디버그 드롭다운 토글
  const handleDebugClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Debug button clicked, current state:", isDebugDropdownOpen);
    setIsDebugDropdownOpen(!isDebugDropdownOpen);
  };

  // 디버그 페이지 이동
  const handleDebugNavigation = (page: string) => {
    console.log("Navigating to:", page);
    navigate(page);
    setIsDebugDropdownOpen(false);
  };

  // 외부 클릭 시 드롭다운 닫기
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isDebugDropdownOpen) {
          console.log("Closing dropdown from outside click");
          setIsDebugDropdownOpen(false);
        }
      }
    };

    if (isDebugDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDebugDropdownOpen]);

  return (
    <header className="flex justify-between items-center px-[1.25rem] py-[clamp(0.75rem,3.2vw,1.06rem)] bg-[#E5E1D7] w-full">
      <img src={logo} alt="logo" />
      <div className="flex items-center space-x-[clamp(0.75rem,3.2vw,1rem)]">
        {/* 디버그 드롭다운 */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleDebugClick}
            className={`cursor-pointer flex items-center space-x-1 px-2 py-1 rounded-md ${getIconStyle("debug")} hover:bg-gray-200 transition-colors`}
          >
            <DebugIcon />
          </button>
          
          {isDebugDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-[9999] overflow-hidden">
              <div className="py-1">
                <button
                  onClick={() => handleDebugNavigation('/SplashPage')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  SplashPage
                </button>
                <button
                  onClick={() => handleDebugNavigation('/StartPage')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  InitPage
                </button>
                <button
                  onClick={() => handleDebugNavigation('/LoginPage')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  LoginPage
                </button>
              </div>
            </div>
          )}
        </div>

        {pageType === "home" && (
          <div
            onClick={() =>
              handleIconClick(mode === "gallery" ? "slider" : "gallery")
            }
            className="cursor-pointer"
          >
            {mode === "gallery" ? <SliderIcon /> : <GalleryIcon />}
          </div>
        )}

        {/* 책장 페이지에서 추가 아이콘 표시 */}
        {pageType === "bookshelf" && (
          <div
            onClick={() => handleIconClick("add")}
            className={`cursor-pointer ${getIconStyle("add")}`}
          >
            <AddIcon />
          </div>
        )}

        {/* 가족 페이지에서 URL 아이콘 표시 */}
        {pageType === "family" && (
          <div
            onClick={() => handleIconClick("url")}
            className={`cursor-pointer ${getIconStyle("url")}`}
          >
            <UrlIcon />
          </div>
        )}

        <div
          onClick={handleSettingClick}
          className={`cursor-pointer ${getIconStyle("setting")}`}
        >
          <SettingIcon />
        </div>
      </div>
    </header>
  );
}
