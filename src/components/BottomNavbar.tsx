import * as React from "react";
import { Link } from "react-router-dom";
import homeIcon from "../assets/image/home.svg";
import bookcaseIcon from "../assets/image/bookcase.svg";
import writeIcon from "../assets/image/write.svg";
import goodsIcon from "../assets/image/goods.svg";
import famIcon from "../assets/image/fam.svg";

// 네비게이션 항목 타입 정의
export type NavItem = "home" | "bookshelf" | "write" | "goods" | "family";

// 컴포넌트 props 타입 정의
interface BottomNavbarProps {
  activeItem: NavItem;
}

export function BottomNavbar({ activeItem }: BottomNavbarProps) {
  // 네비게이션 항목 정의
  const navItems = [
    {
      id: "home",
      label: "홈",
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

  return (
    <nav
      style={{
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        paddingLeft: "30px",
        paddingRight: "30px",
        paddingTop: "20px",
        paddingBottom: "16px",
        height: "90px",
        boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.05)",
      }}
      className="bg-bg-1 border-t border-gray-300 w-full z-10"
    >
      <div className="flex space-between items-center h-full font-medium ">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full no-underline ${
                isActive ? "text-[#F5751E]" : "text-[#9A9893]"
              }`}
            >
              <img
                src={item.icon}
                alt={item.label}
                className={`w-6 h-6 ${isActive ? "filter-orange" : ""}`}
                style={
                  isActive
                    ? {
                        filter:
                          "invert(56%) sepia(75%) saturate(1619%) hue-rotate(346deg) brightness(98%) contrast(96%)",
                      }
                    : {}
                }
              />
              <span className="text-xs font-medium mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
