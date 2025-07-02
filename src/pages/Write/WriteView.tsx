import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface WriteViewProps {
  // 필요한 props 정의
}

export const WriteView: React.FC<WriteViewProps> = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">글쓰기</h1>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F5751E]"
          rows={6}
          placeholder="여기에 글을 작성하세요..."
        />
        <div className="mt-4 flex justify-end">
          <button className="bg-[#F5751E] text-white px-4 py-2 rounded-md hover:bg-[#E56A1B]">
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};
