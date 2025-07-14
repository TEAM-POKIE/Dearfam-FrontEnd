import * as React from "react";
import { useState, useEffect } from "react";
import { BasicButton } from "./BasicButton";
import exitIcon from "../assets/image/icon_exit_20.svg";

interface ConfirmPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

/**
 * 확인/취소 버튼이 있는 팝업 컴포넌트
 * @param {boolean} isOpen - 팝업 표시 여부
 * @param {Function} onClose - 닫기 버튼 클릭 시 호출될 함수
 * @param {string} title - 팝업 제목
 * @param {string|ReactNode} content - 팝업 내용
 * @param {string} confirmText - 확인 버튼 텍스트
 * @param {string} cancelText - 취소 버튼 텍스트
 * @param {Function} onConfirm - 확인 버튼 클릭 시 호출될 함수
 * @param {Function} onCancel - 취소 버튼 클릭 시 호출될 함수
 */
export const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  isOpen,
  onClose,
  title,
  content,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // 다음 프레임에서 애니메이션 시작
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      // 닫기 애니메이션 시작
      setIsAnimating(false);
      // 애니메이션 완료 후 렌더링 중단
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 550); // 애니메이션 지속 시간과 동일

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        transition:
          "opacity 550ms linear(0, 0.1654, 0.4677, 0.7368, 0.9162, 1.0096, 1.043, 1.0437, 1.0315, 1.0177, 1.0074, 1.0012, 0.9985, 1, 0.9982, 0.9989, 0.9995, 1)",
        opacity: isAnimating ? 1 : 0,
      }}
    >
      <div
        className="fixed inset-0 bg-black"
        onClick={onClose}
        style={{
          transition:
            "opacity 550ms linear(0, 0.1654, 0.4677, 0.7368, 0.9162, 1.0096, 1.043, 1.0437, 1.0315, 1.0177, 1.0074, 1.0012, 0.9985, 1, 0.9982, 0.9989, 0.9995, 1)",
          opacity: isAnimating ? 0.6 : 0,
        }}
      ></div>
      <div
        className="flex justify-center bg-white relative z-10 rounded-[clamp(0.75rem,1.92vw,1.25rem)] w-[clamp(15.625rem,70vw,21.875rem)] p-[clamp(0.75rem,2.88vw,1.875rem)]"
        style={{
          transition:
            "all 550ms linear(0, 0.1654, 0.4677, 0.7368, 0.9162, 1.0096, 1.043, 1.0437, 1.0315, 1.0177, 1.0074, 1.0012, 0.9985, 1, 0.9982, 0.9989, 0.9995, 1)",
          transform: isAnimating ? "scale(1)" : "scale(0.8)",
          opacity: isAnimating ? 1 : 0,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-[clamp(0.75rem,1.92vw,1.25rem)] right-[clamp(0.75rem,1.92vw,1.25rem)] text-main-3 hover:text-neutral-600"
          aria-label="Close"
        >
          <img src={exitIcon} alt="exitIcon" />
        </button>

        <div className="w-full flex flex-col items-center gap-[clamp(1rem,2.88vw,1.875rem)]">
          <h4 className="text-h4 text-center whitespace-pre-line">{title}</h4>

          <div>
            <div className="text-neutral-600 text-center">
              {typeof content === "string" ? (
                <p className="text-body3 whitespace-pre-line">{content}</p>
              ) : (
                content
              )}
            </div>
          </div>

          <div className="flex gap-[0.75rem] w-full">
            <BasicButton
              text={cancelText}
              onClick={handleCancel}
              color="gray_3"
              size={145}
              textStyle="text-h4"
            />
            <BasicButton
              text={confirmText}
              onClick={onConfirm}
              color="main_1"
              size={145}
              textStyle="text-h4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
