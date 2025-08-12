import { useNavigate } from "react-router-dom";
import { usePictureToVideoStore } from "@/context/store/pictureToVideoStore";
import { SemiHeader } from "@/components/SemiHeader";
import BasicLoading from "@/components/BasicLoading";

export const VideoProcessingPage = () => {
  const navigate = useNavigate();
  const { selectedFiles, userRequest } = usePictureToVideoStore();

  const selectedImage = selectedFiles[0];

  const handleBack = () => {
    navigate(-1);
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
