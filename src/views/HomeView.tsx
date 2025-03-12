import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface HomeViewProps {
  // 필요한 props 정의
}

export const HomeView: React.FC<HomeViewProps> = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">홈</h1>
      <p>홈 화면 내용이 여기에 표시됩니다.</p>
    </div>
  );
};
