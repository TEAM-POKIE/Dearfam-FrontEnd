import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SemiHeader } from "@/components/SemiHeader";
import { Paper } from "@/pages/Write/components/Paper";
import { AddPicture } from "@/pages/Write/components/AddPicture";
import BasicButton from "@/components/BasicButton";
import ConfirmPopup from "@/components/ConfirmPopup";
import { BasicLoading } from "@/components/BasicLoading";
import { useWritePostStore } from "@/context/store/writePostStore";
import {
  usePutMemoryPost,
  useGetMemoryDetail,
} from "@/data/api/memory-post/memory";

export function EditPage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const {
    resetForm,
    validateForm,
    setTitle,
    setContent,
    setMemoryDate,
    setParticipantIds,
    setRemovedExistingImages,
  } = useWritePostStore();
  const { mutate: putMemoryPost } = usePutMemoryPost();
  const { data: postData, isLoading: isDataLoading } = useGetMemoryDetail(
    postId ? parseInt(postId) : null
  );

  // 폼 유효성 검사 결과
  const { isValid } = validateForm();

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
      putMemoryPost(parseInt(postId));
    }
  };

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading || isDataLoading) {
    return (
      <div className="bg-bg-1 min-h-screen">
        <BasicLoading fullscreen text="게시글 수정하러 가기" size={80} />
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
      <Paper />
      <AddPicture
        existingImages={
          postData.data?.imageUrls?.map(
            (img: { imageUrl: string }) => img.imageUrl
          ) || []
        }
      />

      <div className="w-full flex justify-center items-center mt-[3rem] ">
        <BasicButton
          text="수정하기"
          size={350}
          color={isValid ? "main_1" : "gray_3"}
          textStyle="text_body2"
          onClick={handleSubmit}
          disabled={!isValid}
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
    </div>
  );
}
