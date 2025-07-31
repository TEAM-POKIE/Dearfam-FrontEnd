import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SemiHeader } from "@/components/SemiHeader";
import { Paper } from "@/pages/Write/components/Paper";
import { AddPicture } from "@/pages/Write/components/AddPicture";
import BasicButton from "@/components/BasicButton";
import ConfirmPopup from "@/components/ConfirmPopup";
import { BasicLoading } from "@/components/BasicLoading";
import { useWritePostStore } from "@/context/store/writePostStore";
import { useToastStore } from "@/context/store/toastStore";
import {
  usePutMemoryPost,
  useGetMemoryDetail,
} from "@/data/api/memory-post/memory";

export function EditPage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { showToast } = useToastStore();
  const {
    resetForm,
    validateForm,
    setTitle,
    setContent,
    setMemoryDate,
    setParticipantIds,
    setRemovedExistingImages,
    title,
    content,
  } = useWritePostStore();
  const {
    mutate: putMemoryPost,
    isSuccess,
    isError,
    isPending,
  } = usePutMemoryPost();
  const { data: postData, isLoading: isDataLoading } = useGetMemoryDetail(
    postId ? parseInt(postId) : null
  );

  // 폼 유효성 검사 결과
  const { isValid } = validateForm();

  // 업로드 상태 관리
  useEffect(() => {
    if (isSuccess) {
      showToast("게시글이 성공적으로 수정되었습니다! 🎉", "success");
      resetForm();
      // 즉시 이전 페이지로 이동
      navigate(-1);
    } else if (isError) {
      showToast("게시글 수정에 실패했습니다. 다시 시도해주세요.", "error");
    }
  }, [isSuccess, isError, navigate, resetForm, showToast]);

  // 기존 데이터로 폼 초기화
  useEffect(() => {
    console.log("postData", postData);
    if (postData && !isDataLoading) {
      setTitle(postData.data.title || "");
      setContent(postData.data.content || "");
      setMemoryDate(
        postData.data.memoryDate || new Date().toISOString().split("T")[0]
      );
      setParticipantIds(
        postData.data.participants?.map(
          (p: { familyMemberId: number }) => p.familyMemberId
        ) || []
      );
      // 삭제된 기존 이미지 초기화
      setRemovedExistingImages([]);
      // 이미지는 별도 처리 필요 (URL을 File로 변환)
      // setImages([]); // 기존 이미지는 별도 처리

      setIsLoading(false);
    }
  }, [
    postData,
    isDataLoading,
    setTitle,
    setContent,
    setMemoryDate,
    setParticipantIds,
    setRemovedExistingImages,
  ]);

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
    if (isValid && postId) {
      setShowEditConfirmModal(true);
    }
  };

  // 수정 확인 처리
  const handleConfirmEdit = () => {
    if (isValid && postId) {
      putMemoryPost(parseInt(postId));
      setShowEditConfirmModal(false);
    }
  };

  // 수정 취소 처리
  const handleCancelEdit = () => {
    setShowEditConfirmModal(false);
  };

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

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading || isDataLoading) {
    return (
      <div className="bg-bg-1 min-h-screen">
        <BasicLoading fullscreen text="게시글 수정하러 가기" size={80} />
      </div>
    );
  }

  // 업로드 중일 때 로딩 화면 표시
  if (isPending) {
    return (
      <div className="bg-bg-1 min-h-screen">
        <BasicLoading
          fullscreen
          text="게시글을 수정하고 있습니다..."
          size={80}
        />
      </div>
    );
  }

  return (
    <div className=" bg-bg-1 pb-[1.88rem]  ">
      <SemiHeader
        title="게시글 수정"
        exit={false}
        onBackClick={handleBackClick}
      />
      <Paper isEditMode={true} />
      <AddPicture
        existingImages={
          postData.data?.imageUrls?.map(
            (img: { imageUrl: string }) => img.imageUrl
          ) || []
        }
        isEditMode={true}
      />

      <div className="w-full flex justify-center items-center mt-[3rem] ">
        <BasicButton
          text="수정하기"
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
        title="수정을 취소하시겠어요?"
        content="수정 중인 내용은 저장되지 않습니다."
        confirmText="취소"
        cancelText="계속 수정"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* 수정 확인 팝업 */}
      <ConfirmPopup
        isOpen={showEditConfirmModal}
        onClose={() => setShowEditConfirmModal(false)}
        title="수정하시겠습니까?"
        confirmText="수정"
        cancelText="취소"
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
      />
    </div>
  );
}
