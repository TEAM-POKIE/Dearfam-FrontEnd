import * as React from "react";
import { useState } from "react";
import settingIcon from "../assets/image/icon_setting.svg";
import galleryIcon from "../assets/image/icon_gallery.svg";
import addIcon from "../assets/image/icon_add.svg";
import urlIcon from "../assets/image/icon_url.svg";
import sliderIcon from "../assets/image/icon_slider.svg";
import logo from "../assets/image/dearfam_logo_default.svg";
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

// 컴포넌트 props 타입 정의
interface HeaderBarProps {
  mode?: HeaderMode;
  title?: string;
  pageType?: PageType;
  onModeChange?: (mode: HeaderMode) => void;
}

// 설정 아이콘
const SettingIcon = () => <img src={settingIcon} alt="setting" />;

// 추가 아이콘
const AddIcon = () => <img src={addIcon} alt="add" />;

// 갤러리 아이콘
const GalleryIcon = () => <img src={galleryIcon} alt="gallery" />;

// URL 아이콘
const UrlIcon = () => <img src={urlIcon} alt="url" />;
const SliderIcon = () => <img src={sliderIcon} alt="slider" />;

export function HeaderBar({
  mode = "default",
  pageType = "home",
  onModeChange,
}: HeaderBarProps) {
  const [viewMode, setViewMode] = useState<"gallery" | "slider">("gallery");

  // 아이콘 클릭 핸들러
  const handleIconClick = (newMode: HeaderMode) => {
    if (newMode === "gallery" || newMode === "slider") {
      setViewMode(viewMode === "gallery" ? "slider" : "gallery");
      if (onModeChange) {
        onModeChange(viewMode === "gallery" ? "slider" : "gallery");
      }
    } else if (onModeChange) {
      onModeChange(newMode);
    }
  };

  // 현재 모드에 따라 다른 스타일 적용
  const getIconStyle = (iconMode: HeaderMode) => {
    return mode === iconMode ? "text-[#F5751E]" : "text-[#9A9893]";
  };

  return (
    <header className="flex justify-between items-center px-[1.25rem] py-[clamp(0.75rem,3.2vw,1.06rem)] bg-[#E5E1D7]">
      <img src={logo} alt="logo" />
      <div className="flex items-center space-x-[clamp(0.75rem,3.2vw,1rem)]">
        {pageType === "home" && (
          <div
            onClick={() =>
              handleIconClick(viewMode === "gallery" ? "slider" : "gallery")
            }
            className="cursor-pointer"
          >
            {viewMode === "gallery" ? <GalleryIcon /> : <SliderIcon />}
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
          onClick={() => handleIconClick("setting")}
          className={`cursor-pointer ${getIconStyle("setting")}`}
        >
          <SettingIcon />
        </div>
      </div>
    </header>
  );
}
