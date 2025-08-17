import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetMemoryDetail,
  useGetMemoryTimeOrder,
} from "@/data/api/memory-post/Memory";
import { usePostDiaryGenerate } from "@/data/api/diary/Diary";
import { SemiHeader } from "@/components/SemiHeader";
import BasicPopup from "@/components/BasicPopup";
import BasicButton from "@/components/BasicButton";
import BasicLoading from "@/components/BasicLoading";
import { DiaryPostGrid } from "./components/DiaryPostGrid";

interface SelectDiaryProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export const SelectDiary = ({ onLoadingChange }: SelectDiaryProps) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetMemoryTimeOrder();
  const [selectedPostIds, setSelectedPostIds] = React.useState<number[]>([]);
  const [showInitialPopup, setShowInitialPopup] = React.useState(false);
  const [hasShownInitialPopup, setHasShownInitialPopup] = React.useState(false);

  const { mutate: generateDiary, isPending: isGenerating } =
    usePostDiaryGenerate();

  const handleToggleSelect = (postId: number) => {
    setSelectedPostIds((prev) => {
      if (prev.includes(postId)) {
        // 이미 선택된 게시물을 클릭하면 선택 해제
        return [];
      } else {
        // 새로운 게시물을 클릭하면 기존 선택을 해제하고 새로운 것만 선택
        return [postId];
      }
    });
  };

  const handleCreateDiary = () => {
    if (selectedPostIds.length >= 1) {
      // 첫 번째 선택된 게시물의 ID만 전송
      const selectedPostId = selectedPostIds[0];
      generateDiary(selectedPostId, {
        onSuccess: (response) => {
          console.log("그림일기 생성 성공:", response);
          // DiaryResult 페이지로 이동하면서 생성된 일기 데이터 전달
          const contentData = response.data?.data?.content;
          navigate("/goods/diary/result", {
            state: {
              diaryData: {
                id: String(selectedPostId),
                title: contentData?.title || "가족 그림일기",
                content:
                  contentData?.content ||
                  "오늘 하루도 가족과 함께 행복한 시간을 보냈어요.",
                weather: "sunny", // API에서 제공되지 않으므로 기본값
                mood: "happy", // API에서 제공되지 않으므로 기본값
                illustration: contentData?.image_url,
              },
            },
          });
        },
        onError: (error) => {
          console.error("그림일기 생성 실패:", error);
          // 에러 처리 로직 추가 (예: 에러 팝업)
        },
      });
    }
  };

  // 선택된 첫 번째 포스트의 상세 정보를 가져옴 (기존 로직 유지)
  const firstSelectedPostId =
    selectedPostIds.length > 0 ? selectedPostIds[0] : null;
  useGetMemoryDetail(firstSelectedPostId);

  React.useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  // 데이터 로딩이 완료되면 초기 팝업 표시 (한 번만)
  React.useEffect(() => {
    if (!isLoading && data?.data && !hasShownInitialPopup) {
      setShowInitialPopup(true);
      setHasShownInitialPopup(true);
    }
  }, [isLoading, data, hasShownInitialPopup]);

  if (error) {
    return (
      <div className="h-[calc(100vh-4rem)] px-5 flex items-center justify-center">
        <div className="text-center">
          <div className="text-h4 text-[#9a9893]">
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        </div>
      </div>
    );
  }

  const isButtonActive = selectedPostIds.length >= 1;

  // 그림일기 생성 중일 때 로딩 화면 표시
  if (isGenerating) {
    return (
      <BasicLoading
        fullscreen
        size={80}
        text="로딩이 되는 동안 잠시만 기다려주세요."
        showText={true}
      />
    );
  }

  return (
    <div>
      <div className="h-[100vh] flex flex-col">
        {/* 상단 고정 헤더 */}
        <div className="flex-shrink-0">
          <SemiHeader title="게시글 선택" exit={false} />
        </div>

        {/* 가운데 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-[1.25rem] pt-[1.25rem]">
          <DiaryPostGrid
            data={data}
            isLoading={isLoading}
            selectedPostIds={selectedPostIds}
            onToggleSelect={handleToggleSelect}
          />
        </div>

        {/* 하단 고정 버튼 */}
        <div className="flex-shrink-0  p-[1.25rem] pb-[3.44rem]">
          <BasicButton
            text="선택한 게시글로 그림일기 만들기"
            color={isButtonActive ? "main_2_80" : "bg-bg-3"}
            size={350}
            disabled={!isButtonActive}
            onClick={handleCreateDiary}
          />
        </div>
      </div>

      {/* 초기 팝업 */}
      {showInitialPopup && (
        <BasicPopup
          isOpen={showInitialPopup}
          buttonText="확인"
          onButtonClick={() => {
            setShowInitialPopup(false);
          }}
          onClose={() => setShowInitialPopup(false)}
          title="게시글 선택"
          content="그림일기 제작을 위해 게시글을 선택해주세요."
        />
      )}
    </div>
  );
};
