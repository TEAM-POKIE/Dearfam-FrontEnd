// import { BasicLoading } from "@/components/BasicLoading";
// import { useState, useEffect } from "react";
// import { SelectGallery } from "./SelectGallery";

export function BookshelfPage() {
  // const [isLoading, setIsLoading] = useState(true);

  // // 컴포넌트가 마운트되면 로딩 완료
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000); // 1초 후 로딩 완료

  //   return () => clearTimeout(timer);
  // }, []);

  // // 로딩 중일 때 로딩 화면 표시
  // if (isLoading) {
  //   return (
  //     <div className="bg-bg-1 min-h-screen">
  //       <BasicLoading fullscreen text="책장 페이지 로딩 중..." size={80} />
  //     </div>
  //   );
  // }
  return (
    <div className="flex justify-center items-center mt-[20rem]">
      <div className="text-h2 text-center">버전 2에서 출시 예정입니다</div>
    </div>
  );
  // return <SelectGallery />;
}
