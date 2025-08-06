import * as React from "react";

interface BasicButtonProps {
  text: string;
  textStyle?: string;
  onClick?: () => void;
  color?: "main_1" | "main_2" | "main_3" | "gray_3" | "gray_4" | "bg-bg-3";
  size?: number;
  fullWidth?: boolean;
  disabled?: boolean;
  animation?: "gentle" | "medium" | "strong" | "none";
}

/**
 * 기본 버튼 컴포넌트 - Motion AI 애니메이션 적용
 * @param {string} text - 버튼 텍스트
 * @param {string} textStyle - 버튼 텍스트 스타일 (text_body1, text_body2, text_body3)
 * @param {Function} onClick - 클릭 이벤트 핸들러
 * @param {string} color - 버튼 색상 (main_1, main_2, main_3, gray_3, gray_4)
 * @param {number} size - 버튼 너비 (px 값으로 입력하면 자동으로 반응형으로 변환)
 * @param {boolean} fullWidth - 전체 너비 적용 여부
 * @param {boolean} disabled - 비활성화 여부
 * @param {string} animation - Motion AI 애니메이션 타입 (gentle, medium, strong, none)
 */
export const BasicButton: React.FC<BasicButtonProps> = ({
  text,
  onClick,
  color = "main_1",
  size,
  fullWidth = false,
  textStyle = "text_body3",
  disabled = false,
  animation = "gentle",
}) => {
  // 색상에 따른 스타일 매핑
  const colorStyles = {
    main_1: "bg-main-1 text-white hover:bg-main-1/90",
    main_2: "bg-main-2 text-white hover:bg-main-2/90",
    main_2_80: "bg-main-2_80 text-white hover:bg-main-2_80/90",
    main_3: "bg-main-3 text-white hover:bg-main-3/90",
    gray_3: "bg-gray-3 text-white hover:bg-neutral-700",
    gray_4: "bg-gray-4 text-white hover:bg-neutral-600",
    "bg-bg-3": "bg-bg-3 text-white hover:bg-bg-3/90",
  };

  const textStyleMap: Record<string, string> = {
    text_body2: "text-body2",
    text_body3: "text-body3",
    text_body4: "text-body4",
  };

  // Motion AI 애니메이션 클래스 매핑
  const animationClasses = {
    gentle: "motion-spring-gentle",
    medium: "motion-spring-medium",
    strong: "motion-spring-strong",
    none: "",
  };

  // px를 rem으로 변환 (1rem = 16px)
  const pxToRem = (px: number) => `${px / 16}rem`;

  // 인라인 스타일로 너비 설정
  const inlineStyle = {
    width: fullWidth ? "100%" : size ? `${pxToRem(size)}` : "auto",
    borderRadius: "0.88rem", // 14px를 rem으로 변환
  };

  // 버튼 클릭 시 스케일 효과
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // 버튼 클릭 시 스케일 효과 적용
    const button = e.currentTarget;
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 150);

    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={inlineStyle}
      className={`
        ${colorStyles[color]}   
        h-[3.125rem]
        ${textStyleMap[textStyle] || textStyle || "text-body3"} 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${disabled ? "" : animationClasses[animation]}
        ${disabled ? "" : "hover:scale-[1.02] active:scale-[0.98]"}
        transition-colors
      `}
    >
      {text}
    </button>
  );
};

export default BasicButton;
