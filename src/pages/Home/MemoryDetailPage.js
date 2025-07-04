import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InputContainer } from "./components/InputContainer";
import { CommentContainer } from "./mainDetailPage/CommentContainer";
import { DetailContent } from "./mainDetailPage/DetailContent";
import { DetailContentHeader } from "./mainDetailPage/DetailContentHeader";
import { EventHeader } from "./mainDetailPage/EventHeader";
import { HeaderNav } from "./mainDetailPage/HeaderNav";
import { ImageSlider } from "./mainDetailPage/ImageSlider";
export function MemoryDetailPage() {
    return (_jsxs("div", { children: [_jsx(HeaderNav, {}), _jsx(EventHeader, {}), _jsx(ImageSlider, {}), _jsx(DetailContentHeader, {}), _jsx(DetailContent, {}), _jsx("div", { className: " border-t-[0.0625rem] border-gray-3 ", children: _jsx(CommentContainer, {}) }), _jsx("div", { className: "fixed w-[24.375rem] bottom-0 ", children: _jsx(InputContainer, {}) })] }));
}
