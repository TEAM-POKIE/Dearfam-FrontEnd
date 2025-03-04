export function DailyPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">일상</h1>
      <p className="text-main-1 text-lg mb-4">
        일상 페이지 내용이 여기에 표시됩니다. (main-1 색상)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-bg-3 text-gray-7 rounded">main-1 배경색</div>
        <div className="p-4 bg-main-2 text-white rounded">main-2 배경색</div>
        <div className="p-4 bg-main-3 text-white rounded">main-3 배경색</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-6 text-main-1 rounded border border-gray-5">
          main-1 텍스트 색상
        </div>
        <div className="p-4 bg-gray-6 text-main-2 rounded border border-gray-5">
          main-2 텍스트 색상
        </div>
        <div className="p-4 bg-gray-6 text-main-3 rounded border border-gray-5">
          main-3 텍스트 색상
        </div>
      </div>
    </div>
  );
}
