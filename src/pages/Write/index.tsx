import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SemiHeader } from "@/components/SemiHeader";
import { Paper } from "@/pages/Write/components/Paper";
import { AddPicture } from "./components/AddPicture";
import BasicButton from "@/components/BasicButton";
import ConfirmPopup from "@/components/ConfirmPopup";
import { BasicLoading } from "@/components/BasicLoading";

export function WritePage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 컴포넌트가 마운트되면 로딩 완료
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1초 후 로딩 완료

    return () => clearTimeout(timer);
  }, []);

  const handleBackClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmModal(false);
    navigate(-1);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="bg-bg-1 min-h-screen">
        <BasicLoading fullscreen text="게시글 작성허러 가기" size={80} />
      </div>
    );
  }

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
