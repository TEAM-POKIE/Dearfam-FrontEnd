import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicButton from "@/components/BasicButton";
import { usePictureToVideoStore } from "@/context/store/pictureToVideoStore";
import { SemiHeader } from "@/components/SemiHeader";

export const VideoRequestPage = () => {
  const navigate = useNavigate();
  const { selectedFiles, clearFiles, setUserRequest } =
    usePictureToVideoStore();
  const [requestText, setRequestText] = useState("");

  const selectedImage = selectedFiles[0];

  const handleBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    clearFiles();
    navigate("/home/goods/pictureToVideo");
  };

  const handleSubmitRequest = () => {
    if (requestText.trim()) {
      setUserRequest(requestText.trim());
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
        <div className="w-full">
          <div className="text-center mb-[1.87rem]">
            <h2 className="text-h3 text-gray-2 mb-[0.63rem]">
              어떤 영상으로 만들까요?
            </h2>
            <p className="text-body2 text-gray-3">
              선택한 사진을 어떤 영상으로 만들고 싶은지와
              <br />
              어떤 내용이나 감정을 표현하고 싶은지 알려
              <br />
              주세요. 수즈 수 있어요.
            </p>
          </div>

          {/* Selected Image Preview - Small */}
          <div className="w-full h-[12rem] mb-[1.5rem] bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={selectedImage.preview}
              alt={selectedImage.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Request Input */}
          <div className="mb-[2rem]">
            <p className="text-body2 text-gray-3 mb-[0.75rem]">
              사진의 인물들이 어떻게해주고 나타내는 영
              <br />
              상으로 만들어주세요.
            </p>
            <textarea
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="예: 사진 속 인물들이 웃는 표정을 나타내면 좋겠어요."
              className="w-full h-[8rem] p-[1rem] border border-gray-300 rounded-lg text-body2 resize-none focus:outline-none focus:border-orange-500"
              maxLength={200}
            />
            <div className="text-right text-caption text-gray-400 mt-[0.5rem]">
              {requestText.length}/200
            </div>
          </div>
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
        />
        <BasicButton
          className={`${
            !requestText.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          text=""
          color="main_1"
          size={350}
          onClick={handleSubmitRequest}
          disabled={!requestText.trim()}
        />
      </div>
    </div>
  );
};
