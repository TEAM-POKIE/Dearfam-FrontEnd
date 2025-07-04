import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import iconImage from "../../../assets/image/style_icon_profile.svg";
import etcIcon from "../../../assets/image/section2/icon_etc.svg";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
export const EventHeader = () => {
    return (_jsxs("div", { className: "flex items-center justify-between px-[1.25rem] h-[3.125rem] ", children: [_jsxs("div", { className: "flex items-center gap-[0.62rem] ", children: [_jsx("img", { src: iconImage, alt: "\uD504\uB85C\uD544", className: "w-[1.875rem] h-[1.875rem]" }), _jsx("div", { children: "EventWriter" })] }), _jsxs(DropdownMenu, { children: [_jsx("div", { className: "outline-none ring-0 focus:outline-none focus-visible:outline-none focus:ring-0", children: _jsx(DropdownMenuTrigger, { children: _jsx("img", { src: etcIcon, alt: "\uB354\uBCF4\uAE30", className: "w-[1rem] h-[1rem] hover:outline-none focus:outline-none focus-visible:outline-none" }) }) }), _jsxs(DropdownMenuContent, { children: [_jsx(DropdownMenuItem, { children: "\uC0AD\uC81C\uD558\uAE30" }), _jsx(DropdownMenuItem, { children: "\uC218\uC815\uD558\uAE30" })] })] })] }));
};
