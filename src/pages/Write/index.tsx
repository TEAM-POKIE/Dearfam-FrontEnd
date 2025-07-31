import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SemiHeader } from "@/components/SemiHeader";
import { Paper } from "@/pages/Write/components/Paper";
import { AddPicture } from "./components/AddPicture";
import BasicButton from "@/components/BasicButton";
import ConfirmPopup from "@/components/ConfirmPopup";
import { BasicLoading } from "@/components/BasicLoading";
import { useWritePostStore } from "@/context/store/writePostStore";
import { usePostMemoryPost } from "@/data/api/memory-post/memory";
import { useToastStore } from "@/context/store/toastStore";

export function WritePage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { resetForm, validateForm } = useWritePostStore();
  const { showToast } = useToastStore();
  const {
    mutate: postMemoryPost,
    isSuccess,
    isError,
    isPending,
  } = usePostMemoryPost();

  // 폼 유효성 검사 결과
  const { isValid } = validateForm();

  // 컴포넌트가 마운트되면 로딩 완료
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1초 후 로딩 완료

    return () => clearTimeout(timer);
  }, []);

  // 업로드 상태 관리
  useEffect(() => {
    if (isSuccess) {
      showToast("게시글이 성공적으로 작성되었습니다! 🎉", "success");
      resetForm();
      // 즉시 이전 페이지로 이동
      navigate(-1);
    } else if (isError) {
      showToast("게시글 작성에 실패했습니다. 다시 시도해주세요.", "error");
    }
  }, [isSuccess, isError, navigate, resetForm, showToast]);

  // 페이지 나갈 때 폼 초기화
  useEffect(() => {
    const handleBeforeUnload = () => {
      resetForm();
    };

    const handlePopState = () => {
      resetForm();
    };

    // 브라우저 뒤로가기/앞으로가기 감지
    const handleNavigation = () => {
      resetForm();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleNavigation);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleNavigation);
      resetForm(); // 컴포넌트 언마운트 시에도 초기화
    };
  }, [resetForm]);

  const handleBackClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmModal(false);
    resetForm();
    navigate(-1);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  // 폼 제출 핸들러
  const handleSubmit = () => {
    if (isValid) {
      postMemoryPost();
    }
  };

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="bg-bg-1 min-h-screen">
        <BasicLoading fullscreen text="게시글 작성하러 가기" size={80} />
      </div>
    );
  }

  // 업로드 중일 때 로딩 화면 표시
  if (isPending) {
    return (
      <div className="bg-bg-1 min-h-screen">
        <BasicLoading
          fullscreen
          text="게시글을 업로드하고 있습니다..."
          size={80}
        />
      </div>
    );
  }

  return (
    <div className="bg-bg-1 pb-[1.88rem] relative">
      <SemiHeader
        title="게시글 작성"
        exit={false}
        onBackClick={handleBackClick}
      />
      <Paper isEditMode={false} />
      <AddPicture isEditMode={false} />

      <div className="w-full flex justify-center items-center mt-[3rem]">
        <BasicButton
          text="작성하기"
          size={350}
          color={isValid ? "main_1" : "gray_3"}
          textStyle="text_body2"
          onClick={handleSubmit}
          disabled={!isValid || isPending}
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
