import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import BasicButton from "@/components/BasicButton";
import { SemiHeader } from "@/components/SemiHeader";
import { usePictureToVideoStore } from "@/context/store/pictureToVideoStore";

export const VideoResultPage = () => {
  const navigate = useNavigate();
  const { videoResultUrl } = usePictureToVideoStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Store에서 결과 URL 가져오기
  const animatePhotoUrl = videoResultUrl;

  const handleBack = () => {
    navigate("/home/goods/pictureToVideo");
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const handleGallery = () => {
    // 갤러리에 저장하기 기능 구현
    console.log("갤러리에 저장하기");
    alert("갤러리에 저장되었습니다!");
  };

  const handleCreateNew = () => {
    navigate("/home/goods/pictureToVideo");
  };

  if (!animatePhotoUrl) {
    return (
      <div className="flex flex-col h-screen justify-between">
        <SemiHeader
          title="사진을 동영상화"
          exit={false}
          onBackClick={handleBack}
        />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-body2 text-gray-3 mb-4">동영상을 찾을 수 없습니다.</p>
            <BasicButton
              text="처음으로 돌아가기"
              color="main_2_80"
              size={200}
              onClick={handleCreateNew}
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
              영상이 완성되었어요!
            </h2>
            <p className="text-body2 text-gray-3">
              선택한 사진을 멋진한 내용을 바탕으로 영상화를 마쳤어요.
            </p>
          </div>

          {/* Video Preview */}
          <div className="relative w-full h-[18.75rem] mb-[5.87rem] bg-gray-100 rounded-2xl overflow-hidden">
            {animatePhotoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={animatePhotoUrl}
                  className="w-full h-full object-cover"
                  onEnded={handleVideoEnded}
                  playsInline
                  muted
                  loop={false}
                />
                
                {/* Play/Pause Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={handlePlayPause}
                    className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </button>
                </div>
              </>
            ) : (
              // 비디오 URL이 없을 때 이미지 표시
              <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Play className="w-8 h-8 text-gray-500 ml-1" />
                  </div>
                  <p className="text-body2 text-gray-500">동영상을 불러오는 중...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="px-[1.25rem] space-y-[1.25rem] mb-[3.5rem]">
        <BasicButton
          className=""
          text="갤러리에 저장하기"
          color="main_1"
          size={350}
          onClick={handleGallery}
        />
        <BasicButton
          className=""
          text="새로운 굿즈 만들어요"
          color="main_2_80"
          size={350}
          onClick={handleCreateNew}
        />
      </div>
    </div>
  );
};