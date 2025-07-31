import React, { useCallback, useMemo, useEffect } from "react";
import { BasicButton } from "../../../components/BasicButton";
import exitIcon from "../../../assets/image/icon_exit_20.svg";
import { usePopupAnimation } from "@/hooks/usePopupAnimation";
import { AddFamillyButton } from "./AddFamillyButton";
import { useWritePostStore } from "@/context/store/writePostStore";
import { FamilyMember } from "@/data/api/family/type";

const ANIMATION_DURATION = 450;
const GRID_GAP = "3.44rem";

export const AddFamPopup = ({
  isOpen,
  onClose,
  familyMembers = [],
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  familyMembers: FamilyMember[];
  onConfirm?: (selectedMembers: number[]) => void;
}) => {
  const { participantFamilyMemberIds, setParticipantIds } = useWritePostStore();
  const { isAnimating, shouldRender, closeWithAnimation } = usePopupAnimation(
    isOpen,
    ANIMATION_DURATION
  );

  const handleMemberClick = useCallback(
    (memberId: number) => {
      const currentIds = participantFamilyMemberIds;
      const newIds = currentIds.includes(memberId)
        ? currentIds.filter((id: number) => id !== memberId)
        : [...currentIds, memberId];
      setParticipantIds(newIds);
    },
    [participantFamilyMemberIds, setParticipantIds]
  );

  const memberClickHandlers = useMemo(() => {
    const handlers: Record<number, () => void> = {};
    familyMembers.forEach((member) => {
      handlers[member.familyMemberId] = () =>
        handleMemberClick(member.familyMemberId);
    });
    return handlers;
  }, [familyMembers, handleMemberClick]);

  const handleClose = () => {
    closeWithAnimation(onClose);
  };

  const getMemberRows = (members: FamilyMember[]): FamilyMember[][] => {
    if (members.length <= 2) return [members];
    if (members.length === 3) return [members];
    if (members.length === 4) return [members.slice(0, 2), members.slice(2)];
    if (members.length === 5) return [members.slice(0, 3), members.slice(3)];
    if (members.length === 6) return [members.slice(0, 3), members.slice(3)];
    return [];
  };

  useEffect(() => {
    if (isOpen) {
      setParticipantIds([]);
    }
  }, [isOpen, setParticipantIds]);

  if (!shouldRender) return null;

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
      />

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

          <div className="w-full flex flex-col gap-[1.25rem]">
            {getMemberRows(familyMembers).map((group, idx) => (
              <div
                key={idx}
                className={`${
                  group.length === 3
                    ? "grid grid-cols-3"
                    : group.length === 2
                    ? "grid grid-cols-2"
                    : "grid grid-cols-1"
                } justify-items-center gap-x-[${GRID_GAP}]`}
              >
                {group.map((member) => (
                  <AddFamillyButton
                    key={member.familyMemberId}
                    id={member.familyMemberId.toString()}
                    name={member.familyMemberNickname}
                    profileImage={member.familyMemberProfileImage}
                    isSelected={participantFamilyMemberIds.includes(
                      member.familyMemberId
                    )}
                    onClick={memberClickHandlers[member.familyMemberId]}
                  />
                ))}
              </div>
            ))}
          </div>

          <BasicButton
            text="선택하기"
            onClick={() => {
              onClose();
              onConfirm?.(participantFamilyMemberIds);
            }}
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
