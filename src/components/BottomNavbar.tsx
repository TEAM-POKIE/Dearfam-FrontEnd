import * as React from "react";
import { Link } from "react-router-dom";
import homeIcon from "../assets/image/home.svg";
import bookcaseIcon from "../assets/image/bookcase.svg";
import writeIcon from "../assets/image/write.svg";
import goodsIcon from "../assets/image/goods.svg";
import famIcon from "../assets/image/fam.svg";
import { useCarouselStore } from "@/context/store/carouselStore";

// 네비게이션 항목 타입 정의
export type NavItem = "home" | "bookshelf" | "write" | "goods" | "family";

// 컴포넌트 props 타입 정의
interface BottomNavbarProps {
  activeItem: NavItem;
}

export function BottomNavbar({ activeItem }: BottomNavbarProps) {
  const { resetIndex } = useCarouselStore();

  // 네비게이션 클릭 핸들러
  const handleNavClick = (itemId: string) => {
    // home 페이지가 아닌 다른 페이지로 이동할 때만 인덱스 초기화
    if (itemId !== "home") {
      resetIndex();
    }
  };

  // 네비게이션 항목 정의
  const navItems = [
    {
      id: "home",
      label: "일상",
      icon: homeIcon,
      path: "/home",
    },
    {
      id: "bookshelf",
      label: "책장",
      icon: bookcaseIcon,
      path: "/home/bookshelf",
    },
    {
      id: "write",
      label: "작성",
      icon: writeIcon,
      path: "/home/write",
    },
    {
      id: "goods",
      label: "굿즈",
      icon: goodsIcon,
      path: "/home/goods",
    },
    {
      id: "family",
      label: "가족",
      icon: famIcon,
      path: "/home/family",
    },
  ];

  return (
    <nav
      className="
        bg-bg-1 
        border-t 
        border-gray-5
        w-[24.375rem]
        z-10
       w-full  
        rounded-t-[1.25rem]
        px-[1.875rem]
        pt-[1.25rem]
        pb-[0.9375rem]
       
      
      "
    >
      <div className="flex space-between items-center ">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full no-underline ${
                isActive ? "text-[#F5751E]" : "text-[#9A9893]"
              }`}
            >
              <img
                src={item.icon}
                alt={item.label}
                className={`w-[1.875rem] h-[1.875rem] ${
                  isActive ? "filter-orange" : ""
                }`}
                style={
                  isActive
                    ? {
                        filter:
                          "invert(56%) sepia(75%) saturate(1619%) hue-rotate(346deg) brightness(98%) contrast(96%)",
                      }
                    : {}
                }
              />
              <span className="text-caption1 ]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
