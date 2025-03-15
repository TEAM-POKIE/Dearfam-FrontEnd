import * as React from "react";
import { X } from "lucide-react";
import { BasicButton } from "./BasicButton";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | React.ReactNode;
  buttonText: string;
  onButtonClick?: () => void;
}

/**
 * 재사용 가능한 팝업 컴포넌트
 * @param {boolean} isOpen - 팝업 표시 여부
 * @param {Function} onClose - 닫기 버튼 클릭 시 호출될 함수
 * @param {string} title - 팝업 제목
 * @param {string|ReactNode} content - 팝업 내용 (문자열 또는 React 컴포넌트)
 * @param {string} buttonText - 버튼 텍스트
 * @param {Function} onButtonClick - 버튼 클릭 시 호출될 함수
 */
export const BasicPopup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title = "title",
  content = "content",
  buttonText = "buttonText",
  onButtonClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-center z-50 ">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div
        style={{
          width: "350px",
          padding: "20px 30px",
          borderRadius: "20px",
        }}
        className="flex justify-center bg-white max-w-md mx-4 relative z-10"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="p-6 w-full flex flex-col items-center">
          <h2 className="text-h3 text-center mb-4">{title}</h2>

          <div className="mb-6">
            <div className="p-4 text-neutral-600 text-center">
              {typeof content === "string" ? (
                <p className="text-body1">{content}</p>
              ) : (
                content
              )}
            </div>
          </div>

          <BasicButton
            text={buttonText}
            onClick={onButtonClick || onClose}
            color="main_1"
            size={290}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicPopup;
