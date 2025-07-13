import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SemiHeader } from "@/components/SemiHeader";
import { Paper } from "@/pages/Write/components/Paper";
import { AddPicture } from "./components/AddPicture";
import BasicButton from "@/components/BasicButton";
import ConfirmPopup from "@/components/ConfirmPopup";

export function WritePage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const handleBackClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmModal(false);
    navigate("/");
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className=" bg-bg-1 pb-[1.88rem]  ">
      <SemiHeader
        title="게시글 작성"
        exit={false}
        onBackClick={handleBackClick}
      />
      <Paper />
      <AddPicture />

      <div className="w-full flex justify-center items-center mt-[3rem] ">
        <BasicButton
          text="작성하기"
          size={350}
          color="bg-bg-3"
          textStyle="text_body2"
        />
      </div>

      <ConfirmPopup
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="게시물을 삭제하시겠어요?"
        content="작성 중인 내용은 저장되지 않습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
