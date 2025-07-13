import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Slider } from "@/components/ui/shadcn/slider";
import deleteIcon from "../../../assets/image/section3/icon_cancel.svg";

interface FileWithPreview extends File {
  preview: string;
  id: string;
}

// 고유 ID 생성 함수
const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 디바운스 함수
const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: T) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const AddPicture = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [sliderValue, setSliderValue] = useState([0]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);
  const userScrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isDragging = useRef(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // 현재 파일 수와 새로 추가할 파일 수를 확인
      const remainingSlots = 10 - files.length;
      const filesToAdd = acceptedFiles.slice(0, remainingSlots);

      const newFiles = filesToAdd.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: generateId(),
        })
      );

      setFiles((prev) => [...prev, ...newFiles]);
    },
    [files.length]
  );

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => {
      const fileIndex = prev.findIndex((file) => file.id === fileId);
      if (fileIndex !== -1) {
        // URL.revokeObjectURL을 호출해서 메모리 누수 방지
        URL.revokeObjectURL(prev[fileIndex].preview);
        return prev.filter((file) => file.id !== fileId);
      }
      return prev;
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 10 - files.length,
    disabled: files.length >= 10,
  });

  // 컴포넌트 언마운트 시 URL 정리
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [files]);

  // 진행 중인 애니메이션 취소
  const cancelAnimation = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  }, []);

  // 즉시 스크롤 (드래그 중)
  const immediateScrollTo = useCallback(
    (targetPosition: number) => {
      if (!scrollRef.current) return;
      cancelAnimation();
      scrollRef.current.scrollLeft = targetPosition;
    },
    [cancelAnimation]
  );

  // 부드러운 스크롤 함수 (드래그 완료 후)
  const smoothScrollTo = useCallback(
    (targetPosition: number) => {
      if (!scrollRef.current) return;

      cancelAnimation();

      const container = scrollRef.current;
      const startPosition = container.scrollLeft;
      const distance = targetPosition - startPosition;

      // 거리가 작으면 즉시 스크롤
      if (Math.abs(distance) < 5) {
        container.scrollLeft = targetPosition;
        return;
      }

      const duration = 300;
      let startTime: number | null = null;

      const easeInOutQuart = (t: number): number => {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
      };

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeProgress = easeInOutQuart(progress);

        container.scrollLeft = startPosition + distance * easeProgress;

        if (progress < 1) {
          animationFrameId.current = requestAnimationFrame(animateScroll);
        } else {
          animationFrameId.current = null;
        }
      };

      animationFrameId.current = requestAnimationFrame(animateScroll);
    },
    [cancelAnimation]
  );

  // 슬라이더 값이 변경될 때마다 스크롤 위치 업데이트
  useEffect(() => {
    if (scrollRef.current && !isScrollingProgrammatically.current) {
      const container = scrollRef.current;
      const maxScroll = Math.max(
        0,
        container.scrollWidth - container.clientWidth
      );

      if (maxScroll > 0) {
        const scrollPosition = (sliderValue[0] / 100) * maxScroll;

        // 드래그 중이면 즉시 스크롤, 아니면 부드러운 스크롤
        if (isDragging.current) {
          immediateScrollTo(scrollPosition);
        } else {
          smoothScrollTo(scrollPosition);
        }
      }
    }
  }, [sliderValue, smoothScrollTo, immediateScrollTo]);

  // 이미지가 추가될 때마다 슬라이더를 최대값으로 이동
  useEffect(() => {
    if (files.length > 0) {
      // 레이아웃 업데이트를 위한 짧은 딜레이
      setTimeout(() => {
        setSliderValue([100]);
      }, 100);
    } else {
      setSliderValue([0]);
    }
  }, [files.length]);

  // 스크롤 위치에 따라 슬라이더 값 업데이트
  const handleScroll = useCallback(() => {
    if (scrollRef.current && !isDragging.current) {
      const container = scrollRef.current;
      const maxScroll = Math.max(
        0,
        container.scrollWidth - container.clientWidth
      );

      if (maxScroll > 0) {
        const scrollPercentage = Math.min(
          100,
          Math.max(0, (container.scrollLeft / maxScroll) * 100)
        );

        // 사용자가 수동으로 스크롤 중임을 표시
        isScrollingProgrammatically.current = true;
        setSliderValue([Math.round(scrollPercentage * 10) / 10]);

        // 기존 타임아웃 클리어
        if (userScrollTimeout.current) {
          clearTimeout(userScrollTimeout.current);
        }

        // 200ms 후 플래그 해제
        userScrollTimeout.current = setTimeout(() => {
          isScrollingProgrammatically.current = false;
        }, 200);
      }
    }
  }, []);

  // 디바운스된 스크롤 핸들러
  const debouncedHandleScroll = useCallback(debounce(handleScroll, 16), [
    handleScroll,
  ]);

  // 슬라이더 드래그 시작
  const handleSliderPointerDown = useCallback(() => {
    isDragging.current = true;
    cancelAnimation();
  }, [cancelAnimation]);

  // 슬라이더 드래그 종료
  const handleSliderPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // 슬라이더 값 변경 핸들러
  const handleSliderChange = useCallback((value: number[]) => {
    setSliderValue(value);
  }, []);

  return (
    <div className="w-full mt-[1.25rem] px-[0.625rem]">
      {/* 헤더 정보 */}
      <div>
        <p className="text-body-4 ">선택된 이미지 ({files.length}/10)</p>
      </div>

      {/* 가로 스크롤 이미지 영역 */}
      <div className="w-full  mt-[0.625rem] ">
        <div
          ref={scrollRef}
          className="w-full h-full overflow-x-scroll overflow-y-hidden scrollbar-hide"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            // 하드웨어 가속 활성화
            willChange: "scroll-position",
            transform: "translateZ(0)",
          }}
          onScroll={debouncedHandleScroll}
        >
          <div className="flex space-x-[0.19rem] ">
            {/* 선택된 이미지들 */}
            {files.map((file, index) => (
              <figure key={file.id} className="shrink-0 relative">
                <div className="overflow-hidden rounded-md">
                  <img
                    src={file.preview}
                    alt={`선택된 이미지 ${index + 1}`}
                    className="aspect-square h-[4.375rem] w-[4.375rem] object-cover"
                  />
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={() => removeFile(file.id)}
                  className="absolute top-[0.19rem] right-[0.19rem] w-[0.75rem] h-[0.75rem] "
                  aria-label="이미지 삭제"
                >
                  <img
                    className="w-[0.75rem] h-[0.75rem] object-cover "
                    src={deleteIcon}
                    alt="삭제"
                  />
                </button>
              </figure>
            ))}

            {/* 추가 버튼 (드롭존) */}
            {files.length < 10 && (
              <figure className="shrink-0">
                <div
                  {...getRootProps()}
                  className={`
                    aspect-square h-[4.375rem] w-[4.375rem] border-2 border-dashed rounded-md 
                    flex items-center justify-center cursor-pointer transition-colors
                    ${
                      isDragActive
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    }
                  `}
                >
                  <input {...getInputProps()} />

                  <div className="flex flex-col items-center">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="text-xs text-gray-500 mt-1">추가</span>
                  </div>
                </div>
              </figure>
            )}
          </div>
        </div>
      </div>

      {/* 슬라이더로 스크롤 제어 */}
      <div className="mt-4 px-2">
        <Slider
          value={sliderValue}
          onValueChange={handleSliderChange}
          onPointerDown={handleSliderPointerDown}
          onPointerUp={handleSliderPointerUp}
          max={100}
          step={0.1}
          className="w-full"
        />
      </div>
    </div>
  );
};
