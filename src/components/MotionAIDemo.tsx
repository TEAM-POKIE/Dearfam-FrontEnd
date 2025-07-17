import React, { useState, useEffect } from "react";
import { applyMotionAI } from "../utils/motion-ai-animations";

export const MotionAIDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [listItems, setListItems] = useState<string[]>([]);
  const [buttonScale, setButtonScale] = useState(false);

  // 리스트 아이템 순차 등장 효과 데모
  const addListItem = () => {
    const newItem = `아이템 ${listItems.length + 1}`;
    setListItems((prev) => [...prev, newItem]);
  };

  // 버튼 스케일 효과 데모
  const handleButtonClick = () => {
    setButtonScale(true);
    setTimeout(() => setButtonScale(false), 300);
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 리스트 아이템 순차 등장
    const timer = setTimeout(() => {
      setListItems(["첫 번째 아이템", "두 번째 아이템", "세 번째 아이템"]);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Motion AI 애니메이션 데모
      </h2>

      {/* 버튼 호버 효과 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">버튼 호버 효과</h3>
        <div className="flex gap-3">
          <button
            className="motion-button-hover px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleButtonClick}
          >
            Gentle Spring
          </button>
          <button
            className="motion-scale-medium px-4 py-2 bg-green-500 text-white rounded-lg"
            style={{ transform: buttonScale ? "scale(1.1)" : "scale(1)" }}
          >
            Medium Scale
          </button>
        </div>
      </div>

      {/* 카드 호버 효과 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">카드 호버 효과</h3>
        <div className="motion-card-hover p-4 bg-gray-100 rounded-lg cursor-pointer">
          <p>이 카드에 마우스를 올려보세요!</p>
          <p className="text-sm text-gray-600 mt-1">
            부드러운 스프링 애니메이션이 적용됩니다.
          </p>
        </div>
      </div>

      {/* 모달 등장 효과 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">모달 등장 효과</h3>
        <button
          className="motion-button-hover px-4 py-2 bg-purple-500 text-white rounded-lg"
          onClick={() => setShowModal(true)}
        >
          모달 열기
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`motion-modal-enter ${
                showModal ? "show" : ""
              } bg-white p-6 rounded-lg max-w-sm`}
            >
              <h4 className="text-lg font-semibold mb-4">모달 제목</h4>
              <p className="mb-4">스프링 애니메이션으로 등장하는 모달입니다!</p>
              <button
                className="motion-button-hover px-4 py-2 bg-gray-500 text-white rounded-lg"
                onClick={() => setShowModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 리스트 아이템 등장 효과 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">리스트 아이템 등장 효과</h3>
        <button
          className="motion-button-hover px-4 py-2 bg-orange-500 text-white rounded-lg mb-3"
          onClick={addListItem}
        >
          아이템 추가
        </button>
        <div className="space-y-2">
          {listItems.map((item, index) => (
            <div
              key={index}
              className="motion-list-item-enter show p-3 bg-gray-100 rounded-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* 바운스 효과 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">바운스 효과</h3>
        <div className="flex gap-3">
          <div className="motion-bounce-fast p-4 bg-yellow-100 rounded-lg text-center cursor-pointer">
            <p>빠른 바운스</p>
            <p className="text-sm text-gray-600">클릭해보세요!</p>
          </div>
          <div className="motion-bounce-slow p-4 bg-pink-100 rounded-lg text-center cursor-pointer">
            <p>느린 바운스</p>
            <p className="text-sm text-gray-600">클릭해보세요!</p>
          </div>
        </div>
      </div>

      {/* 인라인 스타일 적용 예시 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">인라인 스타일 적용</h3>
        <div
          className="p-4 bg-blue-100 rounded-lg cursor-pointer"
          style={applyMotionAI.spring("strong")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <p>TypeScript 헬퍼 함수로 적용된 애니메이션</p>
          <p className="text-sm text-gray-600">강한 스프링 효과</p>
        </div>
      </div>

      {/* 애니메이션 정보 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">사용 가능한 애니메이션</h3>
        <div className="text-sm space-y-1">
          <p>
            <code>motion-spring-gentle</code> - 부드러운 스프링 (450ms)
          </p>
          <p>
            <code>motion-spring-medium</code> - 중간 스프링 (900ms)
          </p>
          <p>
            <code>motion-spring-strong</code> - 강한 스프링 (1250ms)
          </p>
          <p>
            <code>motion-bounce-fast</code> - 빠른 바운스 (0.8s)
          </p>
          <p>
            <code>motion-bounce-slow</code> - 느린 바운스 (1.2s)
          </p>
          <p>
            <code>motion-button-hover</code> - 버튼 호버 효과
          </p>
          <p>
            <code>motion-card-hover</code> - 카드 호버 효과
          </p>
          <p>
            <code>motion-modal-enter</code> - 모달 등장 효과
          </p>
          <p>
            <code>motion-list-item-enter</code> - 리스트 아이템 등장 효과
          </p>
        </div>
      </div>
    </div>
  );
};

export default MotionAIDemo;
