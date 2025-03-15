import * as React from "react";

interface BasicButtonProps {
  text: string;
  onClick?: () => void;
  color?: "main_1" | "main_2" | "main_3" | "gray_3" | "gray_4";
  size?: number;
  fullWidth?: boolean;
  disabled?: boolean;
}

/**
 * 기본 버튼 컴포넌트
 * @param {string} text - 버튼 텍스트
 * @param {Function} onClick - 클릭 이벤트 핸들러
 * @param {string} color - 버튼 색상 (main_1, main_2, main_3, gray_3, gray_4)
 * @param {number} size - 버튼 너비 (픽셀)
 * @param {boolean} fullWidth - 전체 너비 적용 여부
 * @param {boolean} disabled - 비활성화 여부
 */
export const BasicButton: React.FC<BasicButtonProps> = ({
  text,
  onClick,
  color = "main_1",
  size,
  fullWidth = false,
  disabled = false,
}) => {
  // 색상에 따른 스타일 매핑
  const colorStyles = {
    main_1: "bg-main-1 text-white hover:bg-main-1/90",
    main_2: "bg-main-2 text-white hover:bg-main-2/90",
    main_3: "bg-main-3 text-white hover:bg-main-3/90",
    gray_3: "bg-neutral-600 text-white hover:bg-neutral-700",
    gray_4: "bg-neutral-500 text-white hover:bg-neutral-600",
  };

  // 인라인 스타일로 너비 설정
  const inlineStyle = {
    width: fullWidth ? "100%" : size ? `${size}px` : "auto",
    borderRadius: "10px",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={inlineStyle}
      className={`
        ${colorStyles[color]} 
        px-4 py-2 
        font-medium 
        transition-colors 
        duration-200
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {text}
    </button>
  );
};

export default BasicButton;
