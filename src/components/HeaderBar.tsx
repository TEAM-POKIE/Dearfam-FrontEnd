import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import settingIcon from "../assets/image/icon_setting.svg";
import galleryIcon from "../assets/image/icon_gallery.svg";
import addIcon from "../assets/image/icon_add.svg";
import urlIcon from "../assets/image/icon_url.svg";
import sliderIcon from "../assets/image/icon_slider.svg";
import logo from "../assets/image/dearfam_logo_default.svg";
import { useHeaderStore } from "@/context/store/headerStore";
import { useCarouselStore } from "@/context/store/carouselStore";

// 헤더바 모드 타입 정의
export type HeaderMode =
  | "gallery"
  | "slider"
  | "url"
  | "add"
  | "setting"
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

// Bug 아이콘 (SVG)
const BugIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#9A9893] hover:text-[#F5751E] transition-colors"
  >
    <path 
      d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5s-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-4 4v3c0 2.21-1.79 4-4 4s-4-1.79-4-4v-3c0-2.21 1.79-4 4-4s4 1.79 4 4z" 
      fill="currentColor"
    />
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
);

export function HeaderBar() {
  const navigate = useNavigate();
  const { mode, pageType, handleIconClick } = useHeaderStore();
  const { resetIndex } = useCarouselStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 현재 모드에 따라 다른 스타일 적용
  const getIconStyle = (iconMode: HeaderMode) => {
    return mode === iconMode ? "text-[#F5751E]" : "text-[#9A9893]";
  };

  // 갤러리/슬라이더 모드 토글 처리
  const handleGallerySliderToggle = () => {
    const newMode = mode === "gallery" ? "slider" : "gallery";
    handleIconClick(newMode);

    // gallery 모드로 변경될 때 캐러셀 인덱스 초기화
    if (newMode === "gallery") {
      resetIndex();
    }
  };

  // 설정 페이지로 이동
  const handleSettingClick = () => {
    handleIconClick("setting");
    resetIndex(); // 설정 페이지로 이동할 때 인덱스 초기화
    navigate("/SettingPage");
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 드롭다운 토글
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 드롭다운 메뉴 아이템 클릭 핸들러
  const handleDropdownItemClick = (path: string) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  return (
    <header className="flex justify-between items-center px-[1.25rem] py-[clamp(0.75rem,3.2vw,1.06rem)] bg-[#E5E1D7] w-full">
      <img src={logo} alt="logo" />
      <div className="flex items-center space-x-[clamp(0.75rem,3.2vw,1rem)]">
        {/* Bug 아이콘 드롭다운 메뉴 */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="p-1 hover:bg-gray-200 rounded-md transition-colors"
            title="개발자 메뉴"
          >
            <BugIcon />
          </button>
          
          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <div className="py-1">
                <button
                  onClick={() => handleDropdownItemClick("/SplashPage")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  SplashPage
                </button>
                <button
                  onClick={() => handleDropdownItemClick("/LoginPage")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  LoginPage
                </button>
                <button
                  onClick={() => handleDropdownItemClick("/StartPage")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  InitPage
                </button>
              </div>
            </div>
          )}
        </div>

        {pageType === "home" && (
          <div onClick={handleGallerySliderToggle} className="cursor-pointer">
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
