// FamilyMemberButton.tsx
import React from "react";
import profileIcon from "../../../assets/image/style_icon_profile.svg";
import selectedIcon from "../../../assets/image/style_icon_profile_manager_Select.svg";

interface AddFamillyButtonProps {
  id: string;
  name: string;
  profileImage?: string;
  isSelected: boolean;
  onClick: () => void;
}

export const AddFamillyButton: React.FC<AddFamillyButtonProps> = React.memo(
  ({ id, name, profileImage, isSelected, onClick }) => {
    return (
      <button
        key={id}
        onClick={onClick}
        className="flex flex-col items-center motion-spring-gentle hover:scale-105 active:scale-95 gap-[0.37rem]"
        aria-pressed={isSelected}
      >
        <div>
          {profileImage ? (
            isSelected ? (
              <div className="relative flex items-center justify-center border-[1.5px] border-main-1 rounded-full w-[48px] h-[48px]">
                <img
                  src={profileImage}
                  alt={name}
                  className="w-[46px] h-[46px] rounded-full object-cover"
                />
              </div>
            ) : (
              <div className=" flex items-center justify-center rounded-full  w-[48px] h-[48px] border-[1.5px] border-white">
                <img
                  src={profileImage}
                  alt={name}
                  className="w-[46.5px] h-[46.5px] rounded-full object-cover "
                />
              </div>
            )
          ) : (
            <img
              className="w-[3rem]"
              src={isSelected ? selectedIcon : profileIcon}
              alt="profileIcon"
            />
          )}
        </div>

        <span className="text-gray-3 text-[0.9rem] font-[400]">{name}</span>
      </button>
    );
  }
);
