import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GoodsViewProps {
  // 필요한 props 정의
}

export const GoodsView: React.FC<GoodsViewProps> = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">굿즈</h1>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center"
          >
            <div className="w-full h-32 mb-2 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-500">상품 이미지</span>
            </div>
            <h3 className="text-sm font-medium">상품 {item}</h3>
            <p className="text-xs text-gray-500">10,000원</p>
          </div>
        ))}
      </div>
    </div>
  );
};
