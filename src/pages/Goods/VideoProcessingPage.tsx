import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePictureToVideoStore } from "@/context/store/pictureToVideoStore";
import { SemiHeader } from "@/components/SemiHeader";
import { usePostAnimatePhotoGenerate } from "@/data/api/animate/AnimatePhoto";
import BasicLoading from "@/components/BasicLoading";

export const VideoProcessingPage = () => {
  const navigate = useNavigate();
  const { selectedFiles, userRequest, setVideoResultUrl } =
    usePictureToVideoStore();
  const [generationProgress, setGenerationProgress] = useState(0);

  const selectedImage = selectedFiles[0];
  const animatePhotoMutation = usePostAnimatePhotoGenerate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleGenerateVideo = async () => {
    if (!selectedImage || !userRequest) {
      navigate(-1);
      return;
    }

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
      // 실제 AnimatePhoto API 호출 (File 객체 직접 전달)
      const response = await animatePhotoMutation.mutateAsync({
        request: {
          actionPrompt: userRequest,
        },
        image: selectedImage.file,
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      // API 응답에서 actionPrompt 추출 (예시 응답 구조에 따라)
      const actionPrompt =
        response.data?.actionPrompt || response.data?.data?.actionPrompt;

      if (actionPrompt) {
        // Store에 결과 URL 저장
        setVideoResultUrl(actionPrompt);

        setTimeout(() => {
          // 결과 페이지로 이동
          navigate("/home/goods/videoResult");
        }, 1000);
      } else {
        throw new Error("동영상 URL을 받아올 수 없습니다.");
      }
    } catch (error) {
      console.error("Video generation failed:", error);
      clearInterval(progressInterval);
      setGenerationProgress(0);
      alert("동영상 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 페이지 로드 시 자동으로 영상 생성 시작
  useEffect(() => {
    if (selectedImage && userRequest) {
      handleGenerateVideo();
    } else {
      // 필요한 데이터가 없으면 이전 페이지로 이동
      navigate(-1);
    }
  }, []);

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
            <p className="text-body2 text-gray-3 mb-4">
              선택된 사진이 없습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BasicLoading
      fullscreen
      size={80}
      text="프롬프트를 보고 영상 가져와 수행중"
      showText={true}
    />
  );
};
