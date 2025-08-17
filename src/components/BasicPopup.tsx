import * as React from "react";

import { BasicButton } from "./BasicButton";
import exitIcon from "../assets/image/icon_exit_20.svg";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content?: string | React.ReactNode;
  buttonText: string;
  onButtonClick?: () => void;
  disabled?: boolean;
}

/**
 * 재사용 가능한 팝업 컴포넌트
 * @param {boolean} isOpen - 팝업 표시 여부
 * @param {Function} onClose - 닫기 버튼 클릭 시 호출될 함수
 * @param {string} title - 팝업 제목
 * @param {string|ReactNode} content - 팝업 내용 (문자열 또는 React 컴포넌트)
 * @param {string} buttonText - 버튼 텍스트
 * @param {Function} onButtonClick - 버튼 클릭 시 호출될 함수
 * @param {boolean} disabled - 버튼 비활성화 여부
 */
export const BasicPopup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title = "title",
  content,
  buttonText = "buttonText",
  onButtonClick,
  disabled = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div
        className="fixed inset-0 bg-black opacity-60"
        onClick={onClose}
      ></div>
      <div className="flex justify-center bg-white relative z-10 rounded-[1.25rem] px-[1.88rem]  pt-[3.12em] pb-[1.25rem]">
        <button
          onClick={onClose}
          className="absolute top-[1.25rem] right-[1.87rem] text-main-3 hover:text-neutral-600"
          aria-label="Close"
        >
          <img src={exitIcon} alt="exitIcon" />
        </button>

        <div className="w-full flex flex-col items-center gap-[1.88rem]">
          <h4 className="text-h4 text-center whitespace-pre-line">{title}</h4>

          {content && (
            <div>
              <div className=" text-center">
                {typeof content === "string" ? (
                  <p className="text-body3 text-gray-3 whitespace-pre-line">
                    {content}
                  </p>
                ) : (
                  content
                )}
              </div>
            </div>
          )}

          <BasicButton
            text={buttonText}
            onClick={onButtonClick || onClose}
            color="main_1"
            size={290}
            textStyle="text-body3"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicPopup;
