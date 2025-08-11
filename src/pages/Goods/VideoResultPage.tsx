import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import BasicButton from "@/components/BasicButton";
import { SemiHeader } from "@/components/SemiHeader";
import PlayIcon from "@/assets/image/section5/icon_play.svg";

import { usePictureToVideoStore } from "@/context/store/pictureToVideoStore";

export const VideoResultPage = () => {
  const navigate = useNavigate();
  const { videoResultUrl } = usePictureToVideoStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Store에서 결과 URL 가져오기
  const animatePhotoUrl = videoResultUrl;

  useEffect(() => {
    if (videoRef.current && animatePhotoUrl) {
      const video = videoRef.current;

      const handleLoadStart = () => setIsLoading(true);
      const handleCanPlay = () => setIsLoading(false);
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };

      video.addEventListener("loadstart", handleLoadStart);
      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        video.removeEventListener("loadstart", handleLoadStart);
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [animatePhotoUrl]);

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

  // 모바일 기기 감지 함수
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  const downloadVideoFromUrl = async (url: string, filename: string): Promise<void> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  };

  const handleGallery = async () => {
    if (!animatePhotoUrl) return;

    setIsSaving(true);

    try {
      console.log("=== 갤러리 저장 시작 ===");
      console.log("비디오 URL:", animatePhotoUrl);

      // 파일명 생성
      const buildFileName = (url: string) => {
        const fromUrl = url.split("?")[0].split("/").pop();
        if (fromUrl && fromUrl.includes(".")) return fromUrl;
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        return `dearfam-video-${ts}.mp4`;
      };
      const filename = buildFileName(animatePhotoUrl);

      // Fetch를 사용한 안정적인 다운로드
      await downloadVideoFromUrl(animatePhotoUrl, filename);

      // 성공 메시지
      if (isMobileDevice()) {
        alert(
          "다운로드가 완료되었어요! '파일' 앱 또는 다운로드 폴더에서 확인해 주세요."
        );
      } else {
        alert("다운로드가 완료되었어요! Downloads 폴더를 확인하세요.");
      }

      console.log("=== 기기 저장 처리 완료 (자동 다운로드) ===");
    } catch (error) {
      console.error("Error saving video:", error);

      // 에러 타입에 따른 구체적인 메시지 제공
      let errorMessage = "저장 중 오류가 발생했습니다. 다시 시도해주세요.";

      if (error instanceof Error) {
        if (
          error.message.includes("CORS") ||
          error.message.includes("Access-Control")
        ) {
          errorMessage =
            "동영상 다운로드 권한 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
        } else if (error.message.includes("timeout")) {
          errorMessage =
            "다운로드 시간이 초과되었습니다. 네트워크 상태를 확인하고 다시 시도해주세요.";
        } else if (error.message.includes("network")) {
          errorMessage = "네트워크 연결을 확인하고 다시 시도해주세요.";
        } else if (error.message.includes("HTTP error")) {
          errorMessage = "동영상 파일에 접근할 수 없습니다. 다시 시도해주세요.";
        }
      }

      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
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
            <p className="text-body2 text-gray-3 mb-4">
              동영상을 찾을 수 없습니다.
            </p>
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
          <div className="text-start mb-[1.87rem] px-[0.625rem]">
            <h2 className="text-h3 text-gray-2 mb-[0.63rem]">
              영상이 완성되었어요!
            </h2>
            <p className="text-body2 text-gray-3">
              선택한 사진을 멋진한 내용을 바탕으로 영상화를 마쳤어요.
            </p>
          </div>

          {/* Video Preview */}
          <div
            className="relative w-full h-[18.75rem] rounded-[1.25rem] overflow-hidden cursor-pointer bg-gray-3"
            onClick={() => setShowControls(!showControls)}
          >
            {animatePhotoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={animatePhotoUrl}
                  className="w-full h-full object-cover"
                  onEnded={handleVideoEnded}
                  playsInline
                  muted={false}
                  loop={false}
                />

                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mb-2 mx-auto"></div>
                      <p className="text-white text-sm">로딩 중...</p>
                    </div>
                  </div>
                )}

                {/* Play/Pause Overlay */}
                {(!isPlaying || showControls) && !isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={handlePlayPause}
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white "
                    >
                      {isPlaying ? (
                        <Pause className="w-[3.125rem] h-[3.125rem] " />
                      ) : (
                        <img
                          src={PlayIcon}
                          alt="play"
                          className="w-[3.125rem] h-[3.125rem] ml-1"
                        />
                      )}
                    </button>
                  </div>
                )}

                {/* Video Controls */}
                {showControls && !isLoading && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <div className="flex items-center space-x-3 text-white">
                      <span className="text-xs">
                        {Math.floor(currentTime / 60)}:
                        {Math.floor(currentTime % 60)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                      <div className="flex-1 bg-gray-300 rounded-full h-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full"
                          style={{
                            width: `${
                              duration ? (currentTime / duration) * 100 : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs">
                        {Math.floor(duration / 60)}:
                        {Math.floor(duration % 60)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // 비디오 URL이 없을 때 이미지 표시
              <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Play className="w-8 h-8 text-gray-500 ml-1" />
                  </div>
                  <p className="text-body2 text-gray-500">
                    동영상을 불러오는 중...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="px-[1.25rem] space-y-[1.25rem] mb-[3.5rem]">
        <BasicButton
          text={isSaving ? "저장 중..." : "갤러리에 저장할래요"}
          color="main_1"
          size={350}
          onClick={handleGallery}
          disabled={isSaving}
        />
        <BasicButton
          text="새로운 굿즈 또 만들래요"
          color="main_2_80"
          size={350}
          onClick={handleCreateNew}
        />
      </div>
    </div>
  );
};
