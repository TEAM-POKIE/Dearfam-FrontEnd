import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import settingIcon from "../assets/image/icon_setting.svg";
import galleryIcon from "../assets/image/icon_gallery.svg";
import addIcon from "../assets/image/icon_add.svg";
import urlIcon from "../assets/image/icon_url.svg";
import sliderIcon from "../assets/image/icon_slider.svg";
import logo from "../assets/image/dearfam_logo_default.svg";
import { useHeaderStore } from "@/context/store/headerStore";
// 설정 아이콘
const SettingIcon = () => _jsx("img", { src: settingIcon, alt: "setting" });
// 추가 아이콘
const AddIcon = () => _jsx("img", { src: addIcon, alt: "add" });
// 갤러리 아이콘
const GalleryIcon = () => _jsx("img", { src: galleryIcon, alt: "gallery" });
// URL 아이콘
const UrlIcon = () => _jsx("img", { src: urlIcon, alt: "url" });
const SliderIcon = () => _jsx("img", { src: sliderIcon, alt: "slider" });
export function HeaderBar() {
    const navigate = useNavigate();
    const { mode, pageType, handleIconClick } = useHeaderStore();
    // 현재 모드에 따라 다른 스타일 적용
    const getIconStyle = (iconMode) => {
        return mode === iconMode ? "text-[#F5751E]" : "text-[#9A9893]";
    };
    // 설정 페이지로 이동
    const handleSettingClick = () => {
        handleIconClick("setting");
        navigate("/SettingPage");
    };
    return (_jsxs("header", { className: "flex justify-between items-center px-[1.25rem] py-[clamp(0.75rem,3.2vw,1.06rem)] bg-[#E5E1D7] w-full", children: [_jsx("img", { src: logo, alt: "logo" }), _jsxs("div", { className: "flex items-center space-x-[clamp(0.75rem,3.2vw,1rem)]", children: [_jsx("button", { onClick: () => navigate('/StartPage'), className: "bg-blue-500 text-white px-2 py-1 rounded-md text-xs", children: "InitPage" }), pageType === "home" && (_jsx("div", { onClick: () => handleIconClick(mode === "gallery" ? "slider" : "gallery"), className: "cursor-pointer", children: mode === "gallery" ? _jsx(SliderIcon, {}) : _jsx(GalleryIcon, {}) })), pageType === "bookshelf" && (_jsx("div", { onClick: () => handleIconClick("add"), className: `cursor-pointer ${getIconStyle("add")}`, children: _jsx(AddIcon, {}) })), pageType === "family" && (_jsx("div", { onClick: () => handleIconClick("url"), className: `cursor-pointer ${getIconStyle("url")}`, children: _jsx(UrlIcon, {}) })), _jsx("div", { onClick: handleSettingClick, className: `cursor-pointer ${getIconStyle("setting")}`, children: _jsx(SettingIcon, {}) })] })] }));
}
