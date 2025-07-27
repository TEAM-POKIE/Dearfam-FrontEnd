import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Slider } from "@/components/ui/shadcn/slider";
import ConfirmPopup from "@/components/ConfirmPopup";
import deleteIcon from "../../../assets/image/section3/icon_cancel.svg";
import styles from "./AddPicture.module.css";
import { useWritePostStore } from "@/context/store/writePostStore";

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
  const { images, setImages } = useWritePostStore();
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  // zustand store의 images와 local files 상태 동기화
  useEffect(() => {
    setFiles(
      images.map((image) => ({
        ...image,
        preview: URL.createObjectURL(image),
        id: generateId(), // File 객체에는 id가 없으므로 새로 생성
      }))
    );
  }, [images]);
  const [sliderValue, setSliderValue] = useState([0]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);
  const userScrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isDragging = useRef(false);
  const autoScrollAnimationId = useRef<number | null>(null);
  const isAutoScrolling = useRef(false);

  // 컨텍스트 메뉴 방지 핸들러
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  // 자동 스크롤 중지 함수
  const stopAutoScroll = useCallback(() => {
    if (autoScrollAnimationId.current) {
      cancelAnimationFrame(autoScrollAnimationId.current);
      autoScrollAnimationId.current = null;
    }
    isAutoScrolling.current = false;
  }, []);

  // 자동 스크롤 함수
  const startAutoScroll = useCallback(
    (direction: "left" | "right", speed: number) => {
      if (isAutoScrolling.current || !scrollRef.current) return;

      isAutoScrolling.current = true;

      const scroll = () => {
        if (!scrollRef.current || !isAutoScrolling.current) return;

        const scrollAmount = direction === "left" ? -speed : speed;
        scrollRef.current.scrollLeft += scrollAmount;

        // 스크롤 경계 체크
        const maxScroll =
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        if (
          scrollRef.current.scrollLeft <= 0 ||
          scrollRef.current.scrollLeft >= maxScroll
        ) {
          stopAutoScroll();
          return;
        }

        autoScrollAnimationId.current = requestAnimationFrame(scroll);
      };

      autoScrollAnimationId.current = requestAnimationFrame(scroll);
    },
    [stopAutoScroll]
  );

  // 드래그 위치에 따른 자동 스크롤 체크
  const checkAutoScroll = useCallback(
    (clientX: number) => {
      if (!scrollRef.current) return;

      const container = scrollRef.current;
      const containerRect = container.getBoundingClientRect();
      const scrollThreshold = 80; // 경계 영역 크기
      const maxScrollSpeed = 8; // 최대 스크롤 속도

      // 왼쪽 경계 체크
      if (clientX < containerRect.left + scrollThreshold) {
        const distance = Math.max(0, clientX - containerRect.left);
        const speed = Math.max(
          1,
          maxScrollSpeed * (1 - distance / scrollThreshold)
        );
        if (!isAutoScrolling.current) {
          startAutoScroll("left", speed);
        }
      }
      // 오른쪽 경계 체크
      else if (clientX > containerRect.right - scrollThreshold) {
        const distance = Math.max(0, containerRect.right - clientX);
        const speed = Math.max(
          1,
          maxScrollSpeed * (1 - distance / scrollThreshold)
        );
        if (!isAutoScrolling.current) {
          startAutoScroll("right", speed);
        }
      }
      // 경계 영역 밖이면 자동 스크롤 중지
      else {
        stopAutoScroll();
      }
    },
    [startAutoScroll, stopAutoScroll]
  );

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

      setImages([...images, ...newFiles]);

      // 이미지가 추가될 때만 스크롤을 마지막으로 이동
      if (newFiles.length > 0) {
        setTimeout(() => {
          setSliderValue([100]);
        }, 100);
      }
    },
    [files.length, images, setImages]
  );

  // 삭제 확인 모달 띄우기
  const handleDeleteClick = useCallback((fileId: string) => {
    setFileToDelete(fileId);
    setShowDeleteModal(true);
  }, []);

  // 실제 파일 삭제 함수
  const removeFile = useCallback(
    (fileId: string) => {
      const fileIndex = files.findIndex((file) => file.id === fileId);
      if (fileIndex !== -1) {
        // URL.revokeObjectURL을 호출해서 메모리 누수 방지
        URL.revokeObjectURL(files[fileIndex].preview);

        // zustand store의 images도 함께 업데이트
        const newImages = images.filter((_, index) => index !== fileIndex);
        setImages(newImages);
      }
      // 삭제 시에는 현재 스크롤 위치 유지 (자동 스크롤 없음)
    },
    [files, images, setImages]
  );

  // 삭제 확인 처리
  const handleConfirmDelete = useCallback(() => {
    if (fileToDelete) {
      removeFile(fileToDelete);
    }
    setShowDeleteModal(false);
    setFileToDelete(null);
  }, [fileToDelete, removeFile]);

  // 삭제 취소 처리
  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setFileToDelete(null);
  }, []);

  // 드래그 앤 드롭 핸들러들
  const handleDragStart = useCallback((e: React.DragEvent, fileId: string) => {
    setDraggedItem(fileId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", fileId);

    // 드래그 중에는 스크롤 핸들러 비활성화
    isDragging.current = true;
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      // 드래그 중일 때 자동 스크롤 체크
      if (draggedItem) {
        checkAutoScroll(e.clientX);
      }
    },
    [draggedItem, checkAutoScroll]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent, fileId: string) => {
      e.preventDefault();
      if (draggedItem && draggedItem !== fileId) {
        setDragOverItem(fileId);
      }
    },
    [draggedItem]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      // 자식 요소로 이동하는 경우가 아닐 때만 dragOverItem을 null로 설정
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setDragOverItem(null);
        stopAutoScroll(); // 드래그가 컨테이너를 벗어나면 자동 스크롤 중지
      }
    },
    [stopAutoScroll]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, targetFileId: string) => {
      e.preventDefault();

      if (!draggedItem || draggedItem === targetFileId) {
        setDraggedItem(null);
        setDragOverItem(null);
        isDragging.current = false;
        return;
      }

      // files 배열 재정렬 후 zustand store 업데이트
      const draggedFileIndex = files.findIndex(
        (file) => file.id === draggedItem
      );
      const targetFileIndex = files.findIndex(
        (file) => file.id === targetFileId
      );

      if (draggedFileIndex !== -1 && targetFileIndex !== -1) {
        const newFiles = [...files];
        const [removed] = newFiles.splice(draggedFileIndex, 1);
        newFiles.splice(targetFileIndex, 0, removed);

        // File 객체만 추출해서 zustand store에 저장 (preview와 id 제외)
        const newImages = newFiles.map((file) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { preview, id, ...fileWithoutExtras } = file;
          return fileWithoutExtras as File;
        });
        setImages(newImages);
      }

      setDraggedItem(null);
      setDragOverItem(null);
      isDragging.current = false;
      stopAutoScroll(); // 드롭 완료 시 자동 스크롤 중지
    },
    [draggedItem, stopAutoScroll, files, setImages]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverItem(null);
    isDragging.current = false;
    stopAutoScroll(); // 드래그 종료 시 자동 스크롤 중지
  }, [stopAutoScroll]);

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
      if (autoScrollAnimationId.current) {
        cancelAnimationFrame(autoScrollAnimationId.current);
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

  // 첫 로드 시에만 슬라이더 초기화
  useEffect(() => {
    if (images.length === 0) {
      setSliderValue([0]);
    }
  }, [images.length]);

  // 드래그가 끝나면 자동 스크롤 중지
  useEffect(() => {
    if (!draggedItem) {
      stopAutoScroll();
    }
  }, [draggedItem, stopAutoScroll]);

  // 스크롤 위치에 따라 슬라이더 값 업데이트
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const maxScroll = Math.max(
        0,
        container.scrollWidth - container.clientWidth
      );

      if (maxScroll > 0) {
        let scrollPercentage = (container.scrollLeft / maxScroll) * 100;

        // 경계값 정확하게 처리 (더 넓은 오차 범위)
        if (container.scrollLeft <= 5) {
          scrollPercentage = 0;
        } else if (container.scrollLeft >= maxScroll - 5) {
          scrollPercentage = 100;
        }

        // 0-100 범위로 클램핑
        scrollPercentage = Math.min(100, Math.max(0, scrollPercentage));

        // 드래그 중이 아니거나 자동 스크롤 중일 때만 슬라이더 업데이트
        if (!isDragging.current || isAutoScrolling.current) {
          // 사용자가 수동으로 스크롤 중임을 표시
          isScrollingProgrammatically.current = true;
          setSliderValue([Math.round(scrollPercentage * 100) / 100]);

          // 기존 타임아웃 클리어
          if (userScrollTimeout.current) {
            clearTimeout(userScrollTimeout.current);
          }

          // 200ms 후 플래그 해제
          userScrollTimeout.current = setTimeout(() => {
            isScrollingProgrammatically.current = false;
          }, 200);
        }
      } else {
        // 스크롤할 수 없는 상태에서는 슬라이더를 0으로 설정
        if (!isDragging.current || isAutoScrolling.current) {
          isScrollingProgrammatically.current = true;
          setSliderValue([0]);

          if (userScrollTimeout.current) {
            clearTimeout(userScrollTimeout.current);
          }

          userScrollTimeout.current = setTimeout(() => {
            isScrollingProgrammatically.current = false;
          }, 200);
        }
      }
    }
  }, [files, images, setImages, isDragging, isAutoScrolling]);

  // 디바운스된 스크롤 핸들러
  const debouncedHandleScroll = useCallback(debounce(handleScroll, 16), [
    handleScroll,
  ]);

  // 실시간 스크롤 핸들러 (드래그 중에는 디바운스 없이)
  const realTimeHandleScroll = useCallback(() => {
    if (isDragging.current || isAutoScrolling.current) {
      handleScroll(); // 드래그/자동스크롤 중에는 즉시 업데이트
    } else {
      debouncedHandleScroll(); // 일반 스크롤에는 디바운스 적용
    }
  }, [handleScroll, debouncedHandleScroll]);

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
        <p className="text-body-4 ">선택된 이미지 ({images.length}/10)</p>
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
            // 모바일 길게 누르기 메뉴 방지
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
          }}
          onScroll={realTimeHandleScroll}
          onContextMenu={handleContextMenu}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex space-x-[0.19rem] ">
            {/* 선택된 이미지들 */}
            {files.map((file, index) => (
              <figure
                key={file.id}
                className={`
                  shrink-0 relative cursor-move ${styles.motionSpring} ${
                  styles.imageFadeIn
                }
                  ${draggedItem === file.id ? "opacity-50 scale-95" : ""}
                  ${dragOverItem === file.id ? styles.dragHover : ""}
                `}
                draggable
                onDragStart={(e) => handleDragStart(e, file.id)}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, file.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, file.id)}
                onDragEnd={handleDragEnd}
                onContextMenu={handleContextMenu}
                style={{
                  WebkitTouchCallout: "none",
                  WebkitUserSelect: "none",
                  userSelect: "none",
                }}
              >
                <div
                  className={`overflow-hidden rounded-md ${
                    styles.motionSpringFast
                  } ${dragOverItem === file.id ? "ring-2 ring-blue-400" : ""}`}
                >
                  <img
                    src={file.preview}
                    alt={`선택된 이미지 ${index + 1}`}
                    className="aspect-square h-[4.375rem] w-[4.375rem] object-cover"
                    draggable={false} // 이미지 자체의 드래그 방지
                    onContextMenu={handleContextMenu}
                    style={{
                      WebkitTouchCallout: "none",
                      WebkitUserSelect: "none",
                      userSelect: "none",
                      pointerEvents: "none", // 이미지 자체의 모든 포인터 이벤트 방지
                    }}
                  />
                </div>

                {/* 순서 표시 */}
                <div
                  className={`absolute top-[0.19rem] left-[0.19rem] bg-black bg-opacity-60 text-white text-xs rounded-full w-[1rem] h-[1rem] flex items-center justify-center pointer-events-none ${styles.motionSpringFast}`}
                >
                  {index + 1}
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={() => handleDeleteClick(file.id)}
                  className={`absolute top-[0.19rem] right-[0.19rem] w-[0.75rem] h-[0.75rem] z-10 ${styles.motionSpring} hover:scale-110 active:scale-95`}
                  aria-label="이미지 삭제"
                  onContextMenu={handleContextMenu}
                >
                  <img
                    className="w-[0.75rem] h-[0.75rem] object-cover "
                    src={deleteIcon}
                    alt="삭제"
                    draggable={false}
                    onContextMenu={handleContextMenu}
                    style={{
                      WebkitTouchCallout: "none",
                      WebkitUserSelect: "none",
                      userSelect: "none",
                    }}
                  />
                </button>
              </figure>
            ))}

            {/* 추가 버튼 (드롭존) */}
            {images.length < 10 && (
              <figure className="shrink-0">
                <div
                  {...getRootProps()}
                  className={`
                    aspect-square h-[4.375rem] w-[4.375rem] border-2 border-dashed rounded-md 
                    flex items-center justify-center cursor-pointer ${
                      styles.motionSpring
                    } ${styles.addButtonHover}
                    ${
                      isDragActive
                        ? "border-blue-400 bg-blue-50 scale-102"
                        : "border-gray-300"
                    }
                  `}
                  onContextMenu={handleContextMenu}
                  style={{
                    WebkitTouchCallout: "none",
                    WebkitUserSelect: "none",
                    userSelect: "none",
                  }}
                >
                  <input {...getInputProps()} />

                  <div className="flex flex-col items-center pointer-events-none">
                    <svg
                      className={`w-5 h-5 text-gray-400 ${
                        styles.motionSpringFast
                      } ${isDragActive ? "scale-110" : ""}`}
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

      {/* 삭제 확인 모달 */}
      <ConfirmPopup
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="이미지를 삭제하시겠어요?"
        content="선택한 이미지가 삭제됩니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};
