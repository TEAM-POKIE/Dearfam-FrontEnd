import { BasicLoading } from "@/components/BasicLoading";
import { useState, useEffect } from "react";

export function GoodsPage() {
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트가 마운트되면 로딩 완료
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1초 후 로딩 완료

    return () => clearTimeout(timer);
  }, []);

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="bg-bg-1 min-h-screen">
        <BasicLoading fullscreen text="굿즈 페이지 로딩 중..." size={80} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-1">굿즈</h1>
      <p className="text-gray-100">굿즈 페이지 내용이 여기에 표시됩니다.</p>
    </div>
  );
}
