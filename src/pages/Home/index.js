import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EventSlideContainer } from "./event_slide_container";
import { useHeaderStore } from "@/context/store/headerStore";
import { HomeSlider } from "./homeSlider";
import EventGallery from "./eventGallery";
export function HomePage() {
    const { mode } = useHeaderStore();
    return (_jsxs("div", { className: "h-full ", children: [mode === "gallery" && _jsx(EventGallery, {}), mode === "slider" && (_jsxs("div", { children: [_jsx(EventSlideContainer, {}), _jsx(HomeSlider, {})] }))] }));
}
