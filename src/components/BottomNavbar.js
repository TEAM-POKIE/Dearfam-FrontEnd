import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import homeIcon from "../assets/image/home.svg";
import bookcaseIcon from "../assets/image/bookcase.svg";
import writeIcon from "../assets/image/write.svg";
import goodsIcon from "../assets/image/goods.svg";
import famIcon from "../assets/image/fam.svg";
export function BottomNavbar({ activeItem }) {
    // 네비게이션 항목 정의
    const navItems = [
        {
            id: "home",
            label: "일상",
            icon: homeIcon,
            path: "/",
        },
        {
            id: "bookshelf",
            label: "책장",
            icon: bookcaseIcon,
            path: "/bookshelf",
        },
        {
            id: "write",
            label: "작성",
            icon: writeIcon,
            path: "/write",
        },
        {
            id: "goods",
            label: "굿즈",
            icon: goodsIcon,
            path: "/goods",
        },
        {
            id: "family",
            label: "가족",
            icon: famIcon,
            path: "/family",
        },
    ];
    return (_jsx("nav", { className: "\n        bg-bg-1 \n        border-t \n        border-gray-5\n        w-[24.375rem]\n        z-10\n       w-full  \n        rounded-t-[1.25rem]\n        px-[1.875rem]\n        pt-[1.25rem]\n        pb-[0.9375rem]\n       \n      \n      ", children: _jsx("div", { className: "flex space-between items-center ", children: navItems.map((item) => {
                const isActive = activeItem === item.id;
                return (_jsxs(Link, { to: item.path, className: `flex flex-col items-center justify-center w-full h-full no-underline ${isActive ? "text-[#F5751E]" : "text-[#9A9893]"}`, children: [_jsx("img", { src: item.icon, alt: item.label, className: `w-[1.875rem] h-[1.875rem] ${isActive ? "filter-orange" : ""}`, style: isActive
                                ? {
                                    filter: "invert(56%) sepia(75%) saturate(1619%) hue-rotate(346deg) brightness(98%) contrast(96%)",
                                }
                                : {} }), _jsx("span", { className: "text-caption1 ]", children: item.label })] }, item.id));
            }) }) }));
}
