import React from "react";
import loadingImage from "../assets/image/loading_image.svg";

interface BasicLoadingProps {
  /** 로딩 이미지 크기 (px) */
  size?: number;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 로딩 텍스트 표시 여부 */
  showText?: boolean;
  /** 로딩 텍스트 내용 */
  text?: string;
  /** 전체 화면 오버레이 여부 */
  fullscreen?: boolean;
}

/**
 * Motion AI 스프링 애니메이션을 사용한 로딩 컴포넌트
 *
 * @example
 * // 기본 사용법
 * <BasicLoading />
 *
 * // 커스텀 크기와 텍스트
 * <BasicLoading size={80} text="데이터 로딩 중..." />
 *
 * // 전체 화면 오버레이
 * <BasicLoading fullscreen />
 */
export const BasicLoading: React.FC<BasicLoadingProps> = ({
  size = 50,
  className = "",
  showText = true,
  text = "로딩 중...",
  fullscreen = false,
}) => {
  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      {/* 로딩 이미지 - 스프링 스케일 + 회전 애니메이션 */}
      <div className="relative">
        <img
          src={loadingImage}
          alt="로딩 중"
          style={{ width: `${size}px`, height: `${size}px` }}
          className="animate-loading-spring"
        />
      </div>

      {/* 로딩 텍스트 */}
      {showText && (
        <p className="text-body3 text-gray-3 animate-loading-text">{text}</p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50  motion-spring-gentle">
        {content}
      </div>
    );
  }

  return content;
};

export default BasicLoading;
