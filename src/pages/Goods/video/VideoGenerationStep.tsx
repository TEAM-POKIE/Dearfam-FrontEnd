import { useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BasicButton from "@/components/BasicButton";
import { usePictureToVideoStore } from "@/context/store/pictureToVideoStore";
import { SemiHeader } from "@/components/SemiHeader";
import { usePostAnimatePhotoGenerate } from "@/data/api/animate/AnimatePhoto";
import { VideoResult } from "./VideoResult";

export const VideoGenerationStep = () => {
  const navigate = useNavigate();
  const { selectedFiles, clearFiles } = usePictureToVideoStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [videoResult, setVideoResult] = useState<string | null>(null);

  const selectedImage = selectedFiles[0];
  const animatePhotoMutation = usePostAnimatePhotoGenerate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    clearFiles();
    navigate(-1);
  };

  const handleGoToPromptInput = () => {
    navigate('/home/goods/videoPrompt');
  };

  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // 시뮬레이션된 진행률 업데이트
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    try {
      // 실제 AnimatePhoto API 호출 - request와 이미지 파일 전송
      const response = await animatePhotoMutation.mutateAsync({
        request: "기본 영상 제작",
        image: selectedImage.file
      });
      
      clearInterval(progressInterval);
      setGenerationProgress(100);

      // API 응답에서 animatePhotoTempURL 추출
      const animatePhotoUrl = response.data?.data?.animatePhotoTempURL;
      
      if (animatePhotoUrl) {
        setTimeout(() => {
          setIsGenerating(false);
          setVideoResult(animatePhotoUrl);
        }, 1000);
      } else {
        throw new Error("동영상 URL을 받아올 수 없습니다.");
      }
    } catch (error) {
      console.error("Video generation failed:", error);
      clearInterval(progressInterval);
      setIsGenerating(false);
      setGenerationProgress(0);
      // 에러 처리 - 사용자에게 에러 메시지 표시
      alert("동영상 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 동영상 생성 완료 시 결과 화면 표시
  if (videoResult) {
    return <VideoResult animatePhotoUrl={videoResult} />;
  }

  if (!selectedImage) {
    return (
      <div className="flex flex-col h-screen justify-between">
        <SemiHeader
          title="사진을 동영상화"
          exit={false}
          onBackClick={handleBack}
        />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-body2 text-gray-3 mb-4">선택된 사진이 없습니다.</p>
            <BasicButton
              text="사진 선택하기"
              color="main_2_80"
              size={200}
              onClick={handleRetry}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen justify-between">
      {/* Header */}
      <SemiHeader
        title="사진을 동영상화"
        exit={false}
        onBackClick={handleBack}
      />

      <div className="flex-1 flex flex-col px-[1.25rem] mt-[3.12rem]">
        <div className="w-full">
          <div className="text-center">
            <h2 className="text-h3 text-gray-2 mb-[0.63rem]">
              선택된 사진으로 영상을 만들어요
            </h2>
            <p className="text-body2 text-gray-3">
              이 사진을 영상 만들기에 맞는지와요?
            </p>
          </div>

          {/* Selected Image Preview */}
          <div className="w-full h-[18.75rem] mt-[1.87rem] mb-[5.87rem] bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={selectedImage.preview}
              alt={selectedImage.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Progress Bar (when generating) */}
          {isGenerating && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">동영상 생성 중...</span>
                <span className="text-sm text-gray-600">
                  {generationProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="px-[1.25rem] space-y-[1.25rem] mb-[3.5rem]">
        <BasicButton
          className=""
          text="사진 다시 선택하기"
          color="main_2_80"
          size={350}
          onClick={handleRetry}
          disabled={isGenerating}
        />
        <BasicButton
          className={`${isGenerating ? "opacity-80 cursor-not-allowed" : ""}`}
          text={
            isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>이 사진으로 영상 제작중입니다</span>
              </div>
            ) : (
              "이 사진으로 영상 제작하기"
            )
          }
          color="main_1"
          size={350}
          onClick={handleGoToPromptInput}
          disabled={isGenerating}
        />
      </div>
    </div>
  );
};
