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

export function HeaderBar() {
  const navigate = useNavigate();
  const { mode, pageType, handleIconClick } = useHeaderStore();
  const { resetIndex } = useCarouselStore();


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

  return (
    <header className="flex justify-between items-center px-[1.25rem] py-[clamp(0.75rem,3.2vw,1.06rem)] bg-[#E5E1D7] w-full">
      <img src={logo} alt="logo" />
      <div className="flex items-center space-x-[clamp(0.75rem,3.2vw,1rem)]">
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
