import { useState, memo } from "react";
import addFamProfile from "../../../assets/image/section3/icon_add_fam_profile.svg";
import addFamPlus from "../../../assets/image/section3/icon_add_fam_plus.svg";
import checkIcon from "../../../assets/image/section2/icon_check.svg";
import addFamProfileBeige from "../../../assets/image/section2/icon_add_fam_profile_beige.svg";
import AddFamPopup from "./AddFamPopup";
import { useFamilyMembers } from "@/data/api/family/family";
import { useWritePostStore } from "@/context/store/writePostStore";

const AddFam = memo(function AddFam() {
  // 전역 상태에서 가족 정보 가져오기 (API 호출 없음)
  const { data: familyMembersData } = useFamilyMembers();
  const { participantFamilyMemberIds } = useWritePostStore();
  const [isOpen, setIsOpen] = useState(false);

  const hasSelectedMembers = participantFamilyMemberIds.length > 0;

  return (
    <>
      <button
        className={`${
          hasSelectedMembers ? "bg-main-2" : "bg-bg-2"
        } inline-flex px-[0.625rem] py-[0.25rem] rounded-[1rem] gap-[0.375rem] h-[1.4375rem] motion-spring-gentle hover:scale-105 active:scale-95`}
        onClick={() => setIsOpen(true)}
      >
        {hasSelectedMembers ? (
          <>
            <img src={checkIcon} alt="check" />
            <img src={addFamProfileBeige} alt="addFamProfile" />
          </>
        ) : (
          <>
            <img src={addFamPlus} alt="addFamPlus" />
            <img src={addFamProfile} alt="addFamProfile" />
          </>
        )}
      </button>
      <AddFamPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        familyMembers={familyMembersData?.familyMembers || []}
        onConfirm={(selectedMembers) => {
          console.log("선택된 가족:", selectedMembers);
          setIsOpen(false);
        }}
      />
    </>
  );
});

export { AddFam };
