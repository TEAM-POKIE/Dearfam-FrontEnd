import { BasicLoading } from "@/components/BasicLoading";
import { useState, useEffect } from "react";
import { GoodsBanner } from "./GoodsBanner";
import { ButtonContainer } from "./components/Button_container";
import { useNavigate } from "react-router-dom";

export function GoodsPage() {
  const navigate = useNavigate();
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
    <div className="mt-[1.25rem] px-[1.25rem]">
      <GoodsBanner />
      <div className="flex flex-col gap-[1.25rem]">
        <ButtonContainer
          title="사진을 동영상화"
          content="사진이 움직일 수 있다면?
        원하는 사진을 골라 움직이게 만들어보세요 !"
          onClick={() => {
            navigate("/home/goods/pictureToVideo");
          }}
        />
        <ButtonContainer
          title="우리 가족의 이야기를 그림 일기로 !"
          content="동심으로 돌아가 바라보는 우리 가족의
추얷들이 궁금하지 않나요 ?"
          onClick={() => {
            navigate("/home/goods/diary");
          }}
        />
      </div>
    </div>
  );
}
