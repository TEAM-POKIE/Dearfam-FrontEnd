import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicButton from "@/components/BasicButton";
import { usePictureToVideoStore } from "@/context/store/pictureToVideoStore";
import { SemiHeader } from "@/components/SemiHeader";
import { usePostAnimatePhotoGenerate, type AnimatePhotoResponse } from "@/data/api/animate/AnimatePhoto";

export const VideoPromptPage = () => {
  const navigate = useNavigate();
  const { selectedFiles, clearFiles, setUserRequest, setVideoResultUrl } =
    usePictureToVideoStore();
  const [promptText, setPromptText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const animatePhotoMutation = usePostAnimatePhotoGenerate();

  const selectedImage = selectedFiles[0];

  const handleBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    clearFiles();
    navigate("/goods/pictureToVideo");
  };

  const handleStartGeneration = async () => {
    if (!promptText.trim() || !selectedImage) {
      return;
    }

    setIsLoading(true);
    setUserRequest(promptText.trim());

    // 처리 페이지로 먼저 이동
    navigate("/goods/videoProcessing");

    try {
      console.log("=== 영상 생성 API 호출 시작 ===");
      console.log("프롬프트:", promptText.trim());
      console.log("이미지 파일:", selectedImage.file);

      // 실제 AnimatePhoto API 호출
      const response: AnimatePhotoResponse = await animatePhotoMutation.mutateAsync({
        request: {
          actionPrompt: promptText.trim(),
        },
        image: selectedImage.file,
      });

      console.log("=== API 응답 성공 ===");
      console.log("전체 응답:", response);
      console.log("응답 데이터:", response.data);
      console.log("응답 데이터의 data:", response.data?.data);
      console.log("animatePhotoTempUrl:", response.data?.data?.animatePhotoTempUrl);

      // API 응답에서 동영상 URL 추출 (axios response 구조 고려)
      const videoUrl = response.data?.data?.animatePhotoTempUrl;
      
      if (videoUrl) {
        // Store에 결과 URL 저장
        setVideoResultUrl(videoUrl);
        
        // 결과 페이지로 이동
        setTimeout(() => {
          navigate("/goods/videoResult");
        }, 2000); // 로딩 시간을 위해 2초 대기
      } else {
        throw new Error("동영상 URL을 받아올 수 없습니다.");
      }
    } catch (error) {
      console.error("=== 영상 생성 실패 ===");
      console.error("에러:", error);
      if (error.response) {
        console.error("응답 상태:", error.response.status);
        console.error("응답 데이터:", error.response.data);
      }
      
      alert("영상 생성에 실패했습니다. 다시 시도해주세요.");
      navigate(-1); // 이전 페이지로 돌아가기
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="w-full ">
          <div className=" mb-[1.87rem] px-[0.62rem]">
            <h2 className="text-h3 text-gray-2 mb-[0.63rem]">
              어떤 영상으로 만들까요?
            </h2>
            <p className="text-body2 text-gray-3">
              선택한 사진을 어떤 영상으로 만들지 입력해주
              <br />
              세요. 더 이상 말할 수 없는 가족의 못든 모습을
              <br />
              만나볼 수도 있어요.
            </p>
          </div>

          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="ex. 사진 속 인물들이 활짝 웃고 있는 영상으로 만들어주세요."
            className="w-full px-[1.25rem] py-[0.94rem] mb-[2rem] resize-none bg-bg-2 h-[10rem] rounded-[0.875rem]  text-body2 placeholder:text-gray-4 text-gray-2  focus:outline-none"
            maxLength={50}
          />
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="px-[1.25rem] space-y-[1.25rem] mb-[3.5rem]">
        <BasicButton
          text={isLoading ? "영상 생성 중..." : "영상 제작할래요"}
          color={!promptText.trim() || isLoading ? "bg-bg-3" : "main_1"}
          size={350}
          onClick={handleStartGeneration}
          disabled={!promptText.trim() || isLoading}
        />
      </div>
    </div>
  );
};
