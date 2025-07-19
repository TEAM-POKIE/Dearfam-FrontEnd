import React, { useState, useEffect } from "react";

import { BasicButton } from "../../../components/BasicButton";
import exitIcon from "../../../assets/image/icon_exit_20.svg";
import profileIcon from "../../../assets/image/style_icon_profile.svg";
import selectedIcon from "../../../assets/image/style_icon_profile_manager_Select.svg";

interface FamilyMember {
  id: string;
  name: string;
  profileImage?: string;
}

export const AddFamPopup = ({
  isOpen,
  onClose,
  familyMembers = [],
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  familyMembers?: FamilyMember[];
  onConfirm?: (selectedMembers: FamilyMember[]) => void;
}) => {
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedMemberIds([]);
      setShouldRender(true);

      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);

      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  if (!shouldRender) return null;

  const handleMemberClick = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleConfirm = () => {
    const selectedMembers = familyMembers.filter((member) =>
      selectedMemberIds.includes(member.id)
    );
    onConfirm?.(selectedMembers);
    handleClose();
  };

  const renderRow = (members: FamilyMember[], useGrid: boolean) => {
    if (useGrid) {
      if (members.length === 3) {
        return (
          <div className="grid grid-cols-3 gap-x-[3.44rem] justify-items-center">
            {members.map(renderMemberButton)}
          </div>
        );
      } else if (members.length === 2) {
        return (
          <div className="grid grid-cols-2 gap-x-[3.44rem] justify-items-center">
            {members.map(renderMemberButton)}
          </div>
        );
      } else {
        return (
          <div className="grid grid-cols-1 justify-items-center">
            {members.map(renderMemberButton)}
          </div>
        );
      }
    } else {
      return (
        <div className="flex justify-evenly">
          {members.map(renderMemberButton)}
        </div>
      );
    }
  };

  const renderMemberButton = (member: FamilyMember) => {
    const isSelected = selectedMemberIds.includes(member.id);
    return (
      <button
        key={member.id}
        onClick={() => handleMemberClick(member.id)}
        className="flex flex-col items-center motion-spring-gentle hover:scale-105 active:scale-95"
      >
        <div>
          {member.profileImage ? (
            <img
              src={member.profileImage}
              alt={member.name}
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
        <span className="text-gray-3">{member.name}</span>
      </button>
    );
  };

  const memberCount = familyMembers.length;

  let rows: React.ReactElement[] = [];

  if (memberCount === 1 || memberCount === 2) {
    rows = [renderRow(familyMembers, false)];
  } else if (memberCount === 3) {
    rows = [renderRow(familyMembers, true)];
  } else if (memberCount === 4) {
    rows = [
      renderRow(familyMembers.slice(0, 2), false),
      renderRow(familyMembers.slice(2), false),
    ];
  } else if (memberCount === 5) {
    rows = [
      renderRow(familyMembers.slice(0, 3), true),
      renderRow(familyMembers.slice(3), false),
    ];
  } else if (memberCount === 6) {
    rows = [
      renderRow(familyMembers.slice(0, 3), true),
      renderRow(familyMembers.slice(3), true),
    ];
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className={`fixed inset-0 bg-black cursor-pointer motion-fade-gentle ${
          isAnimating ? "opacity-60" : "opacity-0"
        }`}
        onClick={handleClose}
      ></div>

      <div
        className={`flex flex-col bg-white z-10 rounded-[1.25rem] px-[1.88rem] py-[1.25rem] motion-spring-gentle ${
          isAnimating ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="hover:text-neutral-600 self-end motion-spring-gentle hover:scale-110 active:scale-95"
          aria-label="Close"
        >
          <img src={exitIcon} alt="exitIcon" />
        </button>

        <div className="w-full flex flex-col items-center gap-[1.88rem] pt-[0.625rem]">
          <h4 className="text-h4 text-center whitespace-pre-line">
            함께했던 가족을 선택해주세요.
          </h4>

          {memberCount > 0 ? (
            <div className="w-full flex flex-col gap-[1.25rem]">{rows}</div>
          ) : (
            <div className="text-neutral-600 text-center col-span-full">
              가족 정보를 불러오는 중...
            </div>
          )}

          <BasicButton
            text="선택하기"
            onClick={handleConfirm}
            color="main_1"
            size={290}
            textStyle="text-body3 text-[#FFFFFF]"
            animation="gentle"
          />
        </div>
      </div>
    </div>
  );
};

export default AddFamPopup;
