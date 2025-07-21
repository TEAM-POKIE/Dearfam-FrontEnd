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
        className="flex flex-col items-center motion-spring-gentle hover:scale-105 active:scale-95"
        aria-pressed={isSelected}
      >
        <div>
          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <img
              className="w-[3rem]"
              src={isSelected ? selectedIcon : profileIcon}
              alt="profileIcon"
            />
          )}
        </div>
        <span className="text-gray-3">{name}</span>
      </button>
    );
  }
);
