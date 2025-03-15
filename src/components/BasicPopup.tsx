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
  content = "this is content. this is content. this is content. this is content. this is content. this is content. this is content. this is content. this is content. ",
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
      <div className="flex justify-center bg-white w-[21.875rem] h-[17.5rem] px-[1.888rem] py-[1.25rem] relative z-10 rounded-[1.25rem]">
        <button
          onClick={onClose}
          className="absolute top-[1.25rem] right-[1.25rem] text-main-3 hover:text-neutral-600"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="w-full flex flex-col items-center gap-[1.88rem]">
          <h4 className="text-h4 text-center">{title}</h4>

          <div>
            <div className="text-neutral-600 text-center">
              {typeof content === "string" ? (
                <p className="text-body3">{content}</p>
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
