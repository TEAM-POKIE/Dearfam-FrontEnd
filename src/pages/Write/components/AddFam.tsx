import { useState, memo } from "react";
import addFamProfile from "../../../assets/image/section3/icon_add_fam_profile.svg";
import addFamPlus from "../../../assets/image/section3/icon_add_fam_plus.svg";
import checkIcon from "../../../assets/image/section2/icon_check.svg";
import addFamProfileBeige from "../../../assets/image/section2/icon_add_fam_profile_beige.svg";
import AddFamPopup from "./AddFamPopup";
import { useGetFamilyMembers } from "@/data/api/family/Family";
import { useWritePostStore } from "@/context/store/writePostStore";

const AddFam = memo(function AddFam() {
  // 가족 정보를 직접 가져오기 (API 호출 포함)
  const { data: familyMembersData, isLoading, error } = useGetFamilyMembers();
  const { participantFamilyMemberIds } = useWritePostStore();
  const [isOpen, setIsOpen] = useState(false);

  const hasSelectedMembers = participantFamilyMemberIds.length > 0;

  // 로딩 중이거나 에러가 있는 경우 기본 버튼 표시
  if (isLoading) {
    return (
      <button
        className="bg-bg-2 inline-flex px-[0.625rem] py-[0.25rem] rounded-[1rem] gap-[0.375rem] h-[1.4375rem] motion-spring-gentle hover:scale-105 active:scale-95"
        disabled
      >
        <img src={addFamPlus} alt="addFamPlus" />
        <img src={addFamProfile} alt="addFamProfile" />
      </button>
    );
  }

  // 에러가 있는 경우 기본 버튼 표시
  if (error) {
    console.error("가족 정보 로드 실패:", error);
  }

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
        isLoading={isLoading}
        onConfirm={(selectedMembers) => {
          console.log("선택된 가족:", selectedMembers);
          setIsOpen(false);
        }}
      />
    </>
  );
});

export { AddFam };
