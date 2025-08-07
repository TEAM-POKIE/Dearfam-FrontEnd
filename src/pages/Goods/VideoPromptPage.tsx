import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicButton from "@/components/BasicButton";
import { usePictureToVideoStore } from "@/context/store/pictureToVideoStore";
import { SemiHeader } from "@/components/SemiHeader";

export const VideoPromptPage = () => {
  const navigate = useNavigate();
  const { selectedFiles, clearFiles, setUserRequest } =
    usePictureToVideoStore();
  const [promptText, setPromptText] = useState("");

  const selectedImage = selectedFiles[0];

  const handleBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    clearFiles();
    navigate("/home/goods/pictureToVideo");
  };

  const handleStartGeneration = () => {
    if (promptText.trim()) {
      setUserRequest(promptText.trim());
      navigate("/home/goods/videoProcessing");
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
          text="영상 제작할래요"
          color={!promptText.trim() ? "bg-bg-3" : "main_1"}
          size={350}
          onClick={handleStartGeneration}
          disabled={!promptText.trim()}
        />
      </div>
    </div>
  );
};
