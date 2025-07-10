import React, { useState } from "react";
import addFamProfile from "../../assets/image/section3/icon_add_fam_profile.svg";
import addFamPlus from "../../assets/image/section3/icon_add_fam_plus.svg";
import AddFamPopup from "./AddFamPopup";

export const AddFam = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="bg-bg-2 inline-flex px-[0.625rem] py-[0.25rem] rounded-[1rem] gap-[0.375rem] h-[1.4375rem]"
        onClick={() => setIsOpen(true)}
      >
        <img src={addFamPlus} alt="addFamPlus" />
        <img src={addFamProfile} alt="addFamProfile" />
      </button>
      <AddFamPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        familyMembers={[
          { id: "1", name: "엄마" },
          { id: "2", name: "아빠" },
          { id: "3", name: "형" },
          { id: "4", name: "형" },
          { id: "5", name: "형" },
          { id: "6", name: "형" },
        ]}
        onConfirm={(selectedMembers) => {
          console.log("선택된 가족:", selectedMembers);
          setIsOpen(false);
        }}
      />
    </>
  );
};
