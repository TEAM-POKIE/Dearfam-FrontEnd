import * as React from "react";
import { useLocation } from "react-router-dom";
import { SemiHeader } from "@/components/SemiHeader";
import BasicButton from "@/components/BasicButton";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { loadMediaAsBase64 } from "@/utils/mediaDownload";
import cloud from "../../../assets/image/section5/icon_cloud_sun.svg";
import sun from "../../../assets/image/section5/icon_sun.svg";
import rain from "../../../assets/image/section5/icon_umbrella.svg";
import snow from "../../../assets/image/section5/icon_snowflake.svg";
import { Grid } from "lucide-react";

interface DiaryData {
  id: string;
  title: string;
  content: string;
  weather?: string;
  mood?: string;
  illustration?: string;
  date?: string; // API에서 받은 날짜 정보 (예: "2025-01-15" 또는 "2025-01-15T10:30:00Z")
}

export const DiaryResult = () => {
  const location = useLocation();
  const [imageLoading, setImageLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);
  const [isCapturing, setIsCapturing] = React.useState(false);
  const templateRef = React.useRef<HTMLDivElement>(null);

  // SelectDiary에서 전달받은 그림일기 데이터
  const diaryData = location.state?.diaryData as DiaryData;

  // 기본 데이터 (테스트용)
  const defaultDiaryData: DiaryData = {
    id: "test-1",
    title: "가족 그림일기",
    content:
      "오늘 하루도 가족과 함께 행복한 시간을 보냈어요.\n함께 공원에서 산책하고 맛있는 음식도 먹었습니다.\n이런 소중한 시간들이 계속 이어지길 바라요.",
    weather: "sunny",
    mood: "happy",
    illustration: "",
    date: "2025-01-15", // 테스트용 날짜
  };

  // 날짜 파싱 함수
  const parseDate = (dateString?: string) => {
    if (!dateString) {
      const today = new Date();
      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      };
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // 잘못된 날짜 형식일 경우 오늘 날짜 반환
        const today = new Date();
        return {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate(),
        };
      }

      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    } catch {
      // 파싱 에러 시 오늘 날짜 반환
      const today = new Date();
      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      };
    }
  };

  // 실제 데이터가 없으면 기본 데이터 사용
  const finalDiaryData = diaryData || defaultDiaryData;

  // 날짜 정보 파싱
  const dateInfo = parseDate(finalDiaryData.date);

  // 이미지가 변경될 때마다 로딩 상태 리셋
  React.useEffect(() => {
    if (finalDiaryData.illustration) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [finalDiaryData.illustration]);

  // 공통 유틸리티를 사용한 이미지 로드
  // const loadImageWithCorsCache = async (
  //   src: string
  // ): Promise<string | null> => {
  //   try {
  //     console.log("공통 유틸리티로 이미지 로드 시작:", src);
  //     return await loadMediaAsBase64(src);
  //   } catch (error) {
  //     console.log("이미지 로드 실패:");
  //     console.warn("이미지 base64 변환 실패:", error);
  //     return null;
  //   }
  // };

  // 템플릿 이미지 저장 함수 (최적화된 버전)
  const handleSaveAsImage = async () => {
    if (!templateRef.current) return;

    setIsCapturing(true);

    try {
      // 웹폰트가 로드될 때까지 대기
      const docAny = document as unknown as {
        fonts?: { ready: Promise<void> };
      };
      if (docAny.fonts?.ready) {
        await docAny.fonts.ready.catch(() => undefined);
      }

      // 이미지 로딩이 완료될 때까지 대기
      if (finalDiaryData.illustration && (imageLoading || imageError)) {
        alert("이미지 로딩이 완료된 후 다시 시도해주세요.");
        return;
      }

      // // 이미지가 있는 경우 CORS 처리
      // let safeImageBase64: string | null = null;
      // const imgElement = templateRef.current.querySelector(
      //   'img[alt="그림일기 이미지"]'
      // ) as HTMLImageElement;
      // const originalSrc = imgElement?.src;

      // if (finalDiaryData.illustration && !imageError && imgElement) {
      //   console.log("CORS 우회를 위한 이미지 처리 시작");
      //   // safeImageBase64 = await loadImageWithCorsCache(
      //   //   finalDiaryData.illustration
      //   // );

      //   if (safeImageBase64) {
      //     imgElement.src = safeImageBase64;
      //     await new Promise((resolve) => setTimeout(resolve, 300)); // DOM 업데이트 대기
      //   }
      // }

      // html2canvas로 템플릿 캡처
      const { width, height } = templateRef.current.getBoundingClientRect();
      const canvas = await html2canvas(templateRef.current, {
        scale: 3, // 고해상도
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#F5F2E8",
        width,
        height,
        logging: false,
        foreignObjectRendering: false,
        letterRendering: true, // 텍스트 품질 향상
        imageTimeout: 15000,
        removeContainer: true,
      });

      // // 원본 이미지 src 복원
      // if (imgElement && originalSrc) {
      //   imgElement.src = originalSrc;
      // }

      // 파일명 생성 (일기 날짜 기반)
      const filename = `dearfam_diary_${dateInfo.year}${String(
        dateInfo.month
      ).padStart(2, "0")}${String(dateInfo.day).padStart(2, "0")}.png`;

      // Blob으로 변환하여 파일 저장
      canvas.toBlob(
        (blob) => {
          if (blob) {
            saveAs(blob, filename);
            alert(
              `🎉 그림일기가 성공적으로 저장되었습니다!\n파일명: ${filename}`
            );
          } else {
            throw new Error("Canvas to Blob 변환 실패");
          }
        },
        "image/png",
        0.95 // 품질 최적화
      );
    } catch (error) {
      console.error("이미지 저장 중 오류:", error);

      // 더 자세한 에러 메시지
      let errorMessage = "이미지 저장 중 오류가 발생했습니다.";
      if (error instanceof Error) {
        if (error.message.includes("CORS")) {
          errorMessage =
            "이미지 권한 문제로 저장에 실패했습니다. 잠시 후 다시 시도해주세요.";
        } else if (error.message.includes("Canvas")) {
          errorMessage =
            "이미지 변환 중 오류가 발생했습니다. 템플릿을 확인하고 다시 시도해주세요.";
        }
      }

      alert(errorMessage);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleNext = () => {
    // 다음 단계로 이동
    console.log("다음 단계로 이동:", {
      diaryData: finalDiaryData,
    });
    // navigate('/home/goods/diary/cover', { state: { diaryData: finalDiaryData } });
  };

  return (
    <div className="h-[100vh] flex flex-col">
      {/* 상단 고정 헤더 */}
      <div className="flex-shrink-0">
        <SemiHeader title="템플릿 선택" exit={false} />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col justify-center items-center px-[1.25rem] py-[2rem]">
        {/* 설명 텍스트 */}
        <div className="text-center mb-[2.5rem]">
          <p className="text-body3 text-gray-3 leading-relaxed">
            해당 그림 일기의 템플릿을 선택해주세요.
            <br />
            선택하신 템플릿은 다음 페이지에
            <br />
            동일하게 모두 적용돼요.
          </p>
        </div>

        {/* 단일 템플릿 */}
        <div
          ref={templateRef}
          className="w-full px-[0.75rem] py-[0.76rem] mb-[3rem] bg-bg-2 rounded-[0.30175rem] h-[29.11638rem]"
        >
          <div className="w-full  h-full  border-[2.414px] border-main-2 rounded-[0.30175rem]">
            <div className=" text-[1.2rem] font-OwnglyphMinhyeChae flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem]">
              <span>{dateInfo.year}</span>
              <span>년</span>
              <span>{dateInfo.month}</span>
              <span>월</span>
              <span>{dateInfo.day}</span>
              <span>일</span>
              <span className="ml-[0.95rem] mr-[0.93rem]">날씨</span>
              <div className="flex items-center gap-[0.45rem] ">
                <img className="w-[1.2rem] h-[1.2rem]" src={sun} alt="sun" />
                <img
                  className="w-[1.2rem] h-[1.2rem]"
                  src={cloud}
                  alt="cloud"
                />
                <img className="w-[1.2rem] h-[1.2rem]" src={rain} alt="rain" />
                <img className="w-[1.2rem] h-[1.2rem]" src={snow} alt="snow" />
              </div>
            </div>
            <div className="h-[12.80819rem] border-t-[2.414px] border-main-2 bg-main-4 flex justify-center items-center overflow-hidden relative">
              {finalDiaryData.illustration ? (
                <>
                  {imageLoading && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-main-4">
                      <div className="flex flex-col items-center text-gray-500">
                        <div className="animate-spin w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full mb-2"></div>
                        <div className="text-body4">이미지 로딩 중...</div>
                      </div>
                    </div>
                  )}
                  <img
                    src="https://cdn.dearfam.store/posts/post-58/62c3d5a7-7e47-4694-b0ce-cda3eebb1ad7.png"
                    alt="그림일기 이미지"
                    className={`h-full w-[12.80819rem] object-cover ${
                      imageLoading ? "opacity-0" : "opacity-100"
                    } transition-opacity duration-300`}
                    onLoad={() => {
                      setImageLoading(false);
                      setImageError(false);
                    }}
                    onError={() => {
                      setImageLoading(false);
                      setImageError(true);
                    }}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <div className="text-[2rem] mb-2">🎨</div>
                  <div className="text-body3">그림일기 이미지</div>
                </div>
              )}
            </div>
            {/* 텍스트 영역: 항상 줄 배경 표시, 고정 줄 개수에 맞춰 높이 설정 */}
            <div className="ㅎrid border-t-[2.414px] border-main-2 bg-bg-2  font-OwnglyphMinhyeChae text-[1.2rem]  leading-[1.94rem]">
              {finalDiaryData.content}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="flex-shrink-0 px-[1.5rem] pb-[3rem] space-y-[0.75rem]">
        <button
          onClick={handleSaveAsImage}
          disabled={isCapturing}
          className={`w-full h-[3.5rem] rounded-[0.625rem] border-2 border-main-2 bg-transparent text-main-2 text-body1 font-medium transition-all duration-200 ${
            isCapturing
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-main-2 hover:text-white active:scale-95"
          }`}
        >
          {isCapturing ? "이미지 저장 중..." : "이미지 저장"}
        </button>
        <BasicButton
          text="다음"
          color="main_2_80"
          size={350}
          onClick={handleNext}
        />
      </div>
    </div>
  );
};
