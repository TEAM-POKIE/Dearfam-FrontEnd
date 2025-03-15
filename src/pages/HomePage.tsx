import * as React from "react";
import { BasicButton } from "../components/BasicButton";
import { BasicPopup } from "../components/BasicPopup";

export function HomePage() {
  // 팝업 표시 여부를 관리하는 상태 추가
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [showFontTest, setShowFontTest] = React.useState(false);

  // 팝업 열기/닫기 함수
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);
  const closePopup = () => setIsPopupOpen(false);

  // 폰트 테스트 표시 토글
  const toggleFontTest = () => setShowFontTest(!showFontTest);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-main-1 mb-6 ">홈</h1>
      <div className="flex flex-col items-center justify-center gap-4">
        {/* 버튼 클릭 시 팝업 토글 */}
        <BasicButton
          text="팝업 열기/닫기"
          color="main_2"
          size={270}
          onClick={togglePopup}
        />

        {/* 폰트 테스트 버튼 */}
        <BasicButton
          text="폰트 테스트 보기/숨기기"
          color="main_1"
          size={270}
          onClick={toggleFontTest}
        />

        {/* 팝업 컴포넌트 */}
        <BasicPopup
          buttonText="확인"
          isOpen={isPopupOpen}
          onClose={closePopup}
        />

        {/* 폰트 테스트 컴포넌트 */}
        {showFontTest && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow-lg w-full max-w-3xl">
            <p className="text-h1 text-logo-orange">제목 1 (h1)</p>
            <p className="text-h2 text-main-2">제목 2 (h2)</p>
            <p className="text-h3 text-logo-purple">제목 3 (h3)</p>
            <p className="text-h4 text-logo-red">제목 4 (h3)</p>
            <p className="text-h5 text-logo-green">제목 5 (h3)</p>
            <p className="text-body1 text-logo-orange">본문 1 (body1)</p>
            <p className="text-body2 text-logo-green">본문 2 (body2)</p>
            <p className="text-body3 text-logo-purple">본문 2 (body2)</p>
            <p className="text-caption1 text-logo-red">캡션 (caption)</p>
            <p className="text-caption2 text-logo-green">캡션 (caption)</p>
          </div>
        )}
      </div>
    </div>
  );
}
