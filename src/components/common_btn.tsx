import * as React from "react";
import type { ButtonHTMLAttributes } from "react";

// 버튼 색상 타입 정의
type ButtonColor = "main_1" | "gray" | "main_2" | "white" | string;

// 버튼 props 타입 정의
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  size?: number;
  color?: ButtonColor;
  textColor?: string;
  textSize?: string | number;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  rounded?: boolean;
}

/**
 * 재사용 가능한 버튼 컴포넌트
 * @param {string} text - 버튼에 표시될 텍스트
 * @param {ButtonSize} size - 버튼 크기 (sm, md, lg, full 또는 숫자)
 * @param {ButtonColor} color - 버튼 배경색
 * @param {string} textColor - 텍스트 색상
 * @param {string|number} textSize - 텍스트 크기
 * @param {boolean} disabled - 비활성화 여부
 * @param {string} className - 추가 클래스명
 * @param {Function} onClick - 클릭 이벤트 핸들러
 * @param {boolean} fullWidth - 전체 너비 사용 여부
 * @param {boolean} rounded - 둥근 모서리 여부
 */
export const CommonButton: React.FC<ButtonProps> = ({
  text,
  size = "270",
  color = "main_1",
  textColor = "white",
  textSize = 16,
  disabled = false,
  className = "",
  onClick,
  fullWidth = false,
  rounded = true,
  ...rest
}) => {
  // 버튼 크기에 따른 패딩 및 너비 설정
  const getSizeStyles = () => {
    if (typeof size === "number") {
      return {
        width: `${size}px`,
        height: "50px",
      };
    }
  };

  // 버튼 색상에 따른 배경색 설정
  const getColorStyles = () => {
    switch (color) {
      case "main_1":
        return {
          backgroundColor: "var(--color-main-1)",
          color: textColor,
        };
      case "main_2":
        return {
          backgroundColor: "var(--color-main-2_80)",
          color: textColor,
        };
      case "gray":
        return {
          backgroundColor: "var(--color-gray-7)",
          color: textColor,
        };
      default:
        return {
          backgroundColor: color,
          color: textColor,
        };
    }
  };

  // 버튼 스타일 계산
  const buttonStyles = {
    ...getSizeStyles(),
    ...getColorStyles(),
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: rounded ? "14px" : "0",
    border: "none",
    outline: "none",
    transition: "all 0.2s ease",
    fontWeight: 400,
    width: fullWidth ? "100%" : typeof size === "number" ? `${size}px` : "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <button
      style={buttonStyles}
      disabled={disabled}
      onClick={onClick}
      className={className}
      {...rest}
    >
      {text}
    </button>
  );
};

export default CommonButton;
