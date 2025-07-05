import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DailyViewProps {
  // 필요한 props 정의
}

export const DailyView: React.FC<DailyViewProps> = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">일상</h1>
      <div className="grid gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium mb-2">일상 카드</h2>
          <p className="text-gray-600">
            일상 페이지의 내용이 여기에 표시됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};
